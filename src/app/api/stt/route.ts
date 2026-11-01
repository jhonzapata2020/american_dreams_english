import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_CONFIGURED_AUDIO_BYTES = DEFAULT_MAX_AUDIO_BYTES;
const MAX_MULTIPART_OVERHEAD_BYTES = 64 * 1024;
const PROVIDER_TIMEOUT_MS = 8_000;
const GROQ_MODEL = 'whisper-large-v3-turbo';

const AUDIO_FORMATS: Record<string, { extension: string; mimeType: string }> = {
  'audio/webm': { extension: 'webm', mimeType: 'audio/webm' },
  'audio/ogg': { extension: 'ogg', mimeType: 'audio/ogg' },
  'audio/mp4': { extension: 'mp4', mimeType: 'audio/mp4' }
};

function getMaxAudioBytes(): number {
  const configured = Number(process.env.ADE_STT_MAX_AUDIO_BYTES);
  if (!Number.isSafeInteger(configured) || configured <= 0) {
    return DEFAULT_MAX_AUDIO_BYTES;
  }

  // Permite reducir el límite por entorno; nunca permite superar el techo conservador local.
  return Math.min(configured, MAX_CONFIGURED_AUDIO_BYTES);
}

function failure(error: string, provider: string, status: number) {
  return NextResponse.json({ text: '', error, provider }, { status });
}

function createBodyLimitedRequest(req: Request, maxBodyBytes: number) {
  let bodyTooLarge = false;
  if (!req.body) {
    return { request: req, wasBodyTooLarge: () => bodyTooLarge };
  }

  const reader = req.body.getReader();
  let bytesRead = 0;
  let pendingRead: Promise<ReadableStreamReadResult<Uint8Array>> | null = null;
  let cancelPromise: Promise<void> | null = null;
  let releasePromise: Promise<void> | null = null;

  const releaseReader = () => {
    if (!releasePromise) {
      releasePromise = (async () => {
        // releaseLock() throws while a read request is pending. Cancellation resolves
        // that read; wait for it before releasing, but don't wait for a slow source
        // cancellation hook to finish before allowing the HTTP handler to respond.
        if (pendingRead) await pendingRead.then(() => undefined, () => undefined);
        reader.releaseLock();
      })();
    }
    return releasePromise;
  };

  const cancelReader = async (reason: unknown) => {
    if (!cancelPromise) {
      cancelPromise = reader.cancel(reason);
      // Observe a source cancellation failure even though it must not replace the
      // route's intended 413/400 response.
      void cancelPromise.catch(() => undefined);
    }
    await releaseReader();
  };

  const limitedBody = new ReadableStream<Uint8Array>({
    async pull(controller) {
      let readPromise: Promise<ReadableStreamReadResult<Uint8Array>>;
      try {
        readPromise = reader.read();
        pendingRead = readPromise;
        const { done, value } = await readPromise;
        pendingRead = null;
        if (done) {
          await releaseReader();
          controller.close();
          return;
        }

        bytesRead += value.byteLength;
        if (bytesRead > maxBodyBytes) {
          bodyTooLarge = true;
          const error = new Error('Request body exceeds the allowed size');
          try {
            await cancelReader(error);
          } catch {
            // El error de limpieza no debe reemplazar la respuesta 413.
          }
          controller.error(error);
          return;
        }

        controller.enqueue(value);
      } catch (error) {
        pendingRead = null;
        try {
          await releaseReader();
        } catch {
          // Preserve the original read error for request.formData().
        }
        controller.error(error);
      }
    },
    async cancel(reason) {
      try {
        await cancelReader(reason);
      } catch {
        // Cancellation cleanup must not surface as a secondary stream error.
      }
    }
  });

  // Pasar los encabezados originales conserva el Content-Type y su boundary multipart.
  // Node requiere duplex="half" al construir Request con un ReadableStream como body.
  const limitedRequest = new Request(req.url, {
    method: req.method,
    headers: req.headers,
    signal: req.signal,
    body: limitedBody,
    duplex: 'half'
  } as RequestInit);

  return { request: limitedRequest, wasBodyTooLarge: () => bodyTooLarge };
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

type ProviderAttempt = {
  text: string | null;
  category?: 'authentication' | 'http' | 'invalid-json' | 'empty-transcript' | 'timeout' | 'network';
  status?: number;
};

function logProviderFailure(provider: string, attempt: ProviderAttempt) {
  console.warn('ADE STT provider diagnostic', {
    provider,
    category: attempt.category || 'unknown',
    ...(attempt.status ? { status: attempt.status } : {})
  });
}

function getAudioFormat(file: File) {
  const normalizedMime = file.type.split(';', 1)[0].trim().toLowerCase();
  return AUDIO_FORMATS[normalizedMime] || null;
}

function createProviderForm(file: File, format: { extension: string; mimeType: string }) {
  const formData = new FormData();
  const filename = `recording.${format.extension}`;
  const audioFile = new File([file], filename, { type: format.mimeType });
  formData.append('file', audioFile, filename);
  return formData;
}

function getGroqKey(): string {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim()) {
    return process.env.GROQ_API_KEY.trim().replace(/^["']|["']$/g, '');
  }
  if (process.env['GROQ_API_KEY'] && process.env['GROQ_API_KEY'].trim()) {
    return process.env['GROQ_API_KEY'].trim().replace(/^["']|["']$/g, '');
  }
  if (process.env.NEXT_PUBLIC_GROQ_API_KEY && process.env.NEXT_PUBLIC_GROQ_API_KEY.trim()) {
    return process.env.NEXT_PUBLIC_GROQ_API_KEY.trim().replace(/^["']|["']$/g, '');
  }
  if (process.env['NEXT_PUBLIC_GROQ_API_KEY'] && process.env['NEXT_PUBLIC_GROQ_API_KEY'].trim()) {
    return process.env['NEXT_PUBLIC_GROQ_API_KEY'].trim().replace(/^["']|["']$/g, '');
  }
  const entry = Object.entries(process.env).find(
    ([k]) => k.trim().toUpperCase() === 'GROQ_API_KEY' || k.trim().toUpperCase() === 'NEXT_PUBLIC_GROQ_API_KEY'
  );
  if (entry && typeof entry[1] === 'string' && entry[1].trim()) {
    return entry[1].trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

async function transcribeWithGroq(file: File, lang: 'en' | 'es', format: { extension: string; mimeType: string }): Promise<ProviderAttempt> {
  const groqKey = getGroqKey();
  if (!groqKey) return { text: null, category: 'authentication' };

  const formData = createProviderForm(file, format);
  formData.append('model', GROQ_MODEL);
  formData.append('language', lang);
  formData.append('response_format', 'json');

  try {
    const response = await fetchWithTimeout('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${groqKey}` },
      body: formData
    });

    if (!response.ok) {
      return {
        text: null,
        category: response.status === 401 || response.status === 403 ? 'authentication' : 'http',
        status: response.status
      };
    }

    const data = await response.json().catch(() => null);
    const text = data && typeof data.text === 'string' ? data.text.trim() : '';
    return text
      ? { text }
      : { text: null, category: data ? 'empty-transcript' : 'invalid-json', status: response.status };
  } catch (error) {
    return {
      text: null,
      category: error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'network'
    };
  }
}

async function transcribeWithElevenLabs(file: File, lang: 'en' | 'es', format: { extension: string; mimeType: string }): Promise<ProviderAttempt> {
  const elevenKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!elevenKey || process.env.ADE_STT_ALLOW_ELEVENLABS_FALLBACK !== 'true') {
    return { text: null, category: 'authentication' };
  }

  const formData = createProviderForm(file, format);
  formData.append('model_id', 'scribe_v2');
  formData.append('language_code', lang === 'en' ? 'eng' : 'spa');

  try {
    const response = await fetchWithTimeout('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: { 'xi-api-key': elevenKey },
      body: formData
    });
    if (!response.ok) {
      return {
        text: null,
        category: response.status === 401 || response.status === 403 ? 'authentication' : 'http',
        status: response.status
      };
    }

    const data = await response.json().catch(() => null);
    const text = data && typeof data.text === 'string' ? data.text.trim() : '';
    return text
      ? { text }
      : { text: null, category: data ? 'empty-transcript' : 'invalid-json', status: response.status };
  } catch (error) {
    return {
      text: null,
      category: error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'network'
    };
  }
}

export async function GET() {
  const groqKey = getGroqKey();
  const elevenKey = process.env.ELEVENLABS_API_KEY?.trim() || '';

  const envNames = Object.keys(process.env).filter((k) =>
    ['GROQ', 'ELEVEN', 'WOMPI', 'SUPABASE', 'GA', 'VERCEL'].some((p) => k.toUpperCase().includes(p))
  );

  return NextResponse.json({
    status: 'ok',
    vercelProject: process.env.VERCEL_PROJECT_NAME || 'unknown',
    vercelEnv: process.env.VERCEL_ENV || 'unknown',
    vercelBranch: process.env.VERCEL_GIT_COMMIT_REF || 'unknown',
    vercelCommit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
    groq: {
      configured: Boolean(groqKey),
      keyLength: groqKey ? groqKey.length : 0,
      prefixValid: groqKey ? groqKey.startsWith('gsk_') : false
    },
    elevenlabs: {
      configured: Boolean(elevenKey),
      keyLength: elevenKey ? elevenKey.length : 0
    },
    discoveredKeys: envNames
  });
}

export async function POST(req: Request) {
  try {
    const maxAudioBytes = getMaxAudioBytes();
    const maxMultipartBodyBytes = maxAudioBytes + MAX_MULTIPART_OVERHEAD_BYTES;
    const contentLengthHeader = req.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (Number.isFinite(contentLength) && contentLength > maxMultipartBodyBytes) {
        console.warn('ADE STT request diagnostic', { category: 'body-over-limit' });
        return failure('audio_too_large', 'none', 413);
      }
    }

    const boundedRequest = createBodyLimitedRequest(req, maxMultipartBodyBytes);
    let formData: FormData;
    try {
      formData = await boundedRequest.request.formData();
    } catch {
      if (boundedRequest.wasBodyTooLarge()) {
        console.warn('ADE STT request diagnostic', { category: 'body-over-limit' });
        return failure('audio_too_large', 'none', 413);
      }
      console.warn('ADE STT request diagnostic', { category: 'invalid-multipart' });
      return failure('invalid_form_data', 'none', 400);
    }

    const fileValue = formData.get('file');
    const langValue = formData.get('lang');
    const lang = langValue === null ? 'es' : langValue;

    if (typeof File === 'undefined' || !(fileValue instanceof File)) {
      console.warn('ADE STT request diagnostic', { category: 'file-missing' });
      return failure('audio_file_required', 'none', 400);
    }
    if (fileValue.size === 0) {
      console.warn('ADE STT request diagnostic', { category: 'audio-empty' });
      return failure('audio_file_empty', 'none', 400);
    }
    if (fileValue.size > maxAudioBytes) {
      console.warn('ADE STT request diagnostic', { category: 'audio-over-limit', bytes: fileValue.size });
      return failure('audio_too_large', 'none', 413);
    }
    if (lang !== 'en' && lang !== 'es') {
      console.warn('ADE STT request diagnostic', { category: 'unsupported-language' });
      return failure('unsupported_language', 'none', 400);
    }

    const format = getAudioFormat(fileValue);
    if (!format) {
      console.warn('ADE STT request diagnostic', { category: 'unsupported-mime' });
      return failure('unsupported_audio_format', 'none', 415);
    }

    const groqKey = getGroqKey();
    const groqConfigured = Boolean(groqKey);
    const elevenFallbackAllowed = Boolean(
      process.env.ELEVENLABS_API_KEY?.trim() && process.env.ADE_STT_ALLOW_ELEVENLABS_FALLBACK === 'true'
    );

    if (groqConfigured) {
      const groqAttempt = await transcribeWithGroq(fileValue, lang, format);
      if (groqAttempt.text) {
        return NextResponse.json({ text: groqAttempt.text, provider: 'groq-whisper' });
      }
      logProviderFailure('groq-whisper', groqAttempt);
    } else {
      console.info('ADE STT provider diagnostic', { provider: 'groq-whisper', category: 'not-configured' });
    }

    // ElevenLabs puede generar consumo. Solo se usa como alternativa cuando
    // existe su credencial y el operador habilitó explícitamente este fallback.
    if (elevenFallbackAllowed) {
      const elevenAttempt = await transcribeWithElevenLabs(fileValue, lang, format);
      if (elevenAttempt.text) {
        return NextResponse.json({ text: elevenAttempt.text, provider: 'elevenlabs-scribe' });
      }
      logProviderFailure('elevenlabs-scribe', elevenAttempt);
    }

    if (!groqConfigured && !elevenFallbackAllowed) {
      console.warn('ADE STT provider diagnostic', { provider: 'none', category: 'no-authorized-provider' });
      return failure('stt_not_configured', 'none', 503);
    }
    return failure('stt_upstream_error', groqConfigured ? 'groq-whisper' : 'elevenlabs-scribe', 502);
  } catch {
    // No devolver detalles internos ni registrar datos de audio o transcripción.
    return failure('stt_processing_error', 'none', 500);
  }
}
