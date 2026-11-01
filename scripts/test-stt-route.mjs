import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

const routePath = resolve('src/app/api/stt/route.ts');
const buildDir = mkdtempSync(join(dirname(routePath), '.stt-test-'));
const compiledRoute = join(buildDir, 'route.mjs');
const routeSource = readFileSync(routePath, 'utf8');
const transpiled = ts.transpileModule(routeSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022
  }
});
const require = createRequire(import.meta.url);
const nextServerUrl = pathToFileURL(require.resolve('next/server')).href;
const compiledSource = transpiled.outputText.replace(
  /from ['"]next\/server['"]/,
  `from '${nextServerUrl}'`
);
writeFileSync(compiledRoute, compiledSource, 'utf8');

let POST;
try {
  ({ POST } = await import(pathToFileURL(compiledRoute).href));
} catch (error) {
  rmSync(buildDir, { recursive: true, force: true });
  throw error;
}

const trackedEnv = ['ELEVENLABS_API_KEY', 'GROQ_API_KEY', 'ADE_STT_MAX_AUDIO_BYTES', 'ADE_STT_ALLOW_ELEVENLABS_FALLBACK'];
const originalFetch = globalThis.fetch;
const ELEVENLABS_URL = 'https://api.elevenlabs.io/v1/speech-to-text';
const GROQ_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_MULTIPART_BODY_BYTES = MAX_AUDIO_BYTES + 64 * 1024;

function configureEnv({ eleven = 'mock-eleven-key', groq = undefined, elevenFallback = undefined, maxBytes = undefined } = {}) {
  if (eleven == null) delete process.env.ELEVENLABS_API_KEY;
  else process.env.ELEVENLABS_API_KEY = eleven;

  if (groq == null) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = groq;

  if (elevenFallback === undefined) delete process.env.ADE_STT_ALLOW_ELEVENLABS_FALLBACK;
  else process.env.ADE_STT_ALLOW_ELEVENLABS_FALLBACK = elevenFallback;

  if (maxBytes === undefined) delete process.env.ADE_STT_MAX_AUDIO_BYTES;
  else process.env.ADE_STT_MAX_AUDIO_BYTES = String(maxBytes);
}

function makeForm({ bytes = 2048, type = 'audio/webm', lang = 'es', includeFile = true } = {}) {
  const form = new FormData();
  if (includeFile) {
    const audio = new Blob([new Uint8Array(bytes)], { type });
    form.append('file', audio, 'client-name.webm');
  }
  if (lang !== null) form.append('lang', lang);
  return form;
}

function makeRequest(form, headers = undefined) {
  return new Request('http://localhost/api/stt', {
    method: 'POST',
    headers,
    body: form
  });
}

function makeMultipartBytes({ audioBytes = 2048, totalBytes } = {}) {
  const boundary = 'ade-stt-test-boundary';
  const encoder = new TextEncoder();
  const fileHeader = encoder.encode(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="recording.webm"\r\nContent-Type: audio/webm\r\n\r\n`
  );
  const fields = encoder.encode(
    `\r\n--${boundary}\r\nContent-Disposition: form-data; name="lang"\r\n\r\nes\r\n--${boundary}\r\nContent-Disposition: form-data; name="padding"\r\n\r\n`
  );
  const end = encoder.encode(`\r\n--${boundary}--\r\n`);
  const paddingLength = totalBytes === undefined
    ? 0
    : totalBytes - fileHeader.byteLength - audioBytes - fields.byteLength - end.byteLength;
  if (paddingLength < 0) throw new RangeError('Requested multipart body is smaller than its fixed parts');

  const body = new Uint8Array(fileHeader.byteLength + audioBytes + fields.byteLength + paddingLength + end.byteLength);
  let offset = 0;
  body.set(fileHeader, offset);
  offset += fileHeader.byteLength;
  offset += audioBytes;
  body.set(fields, offset);
  offset += fields.byteLength + paddingLength;
  body.set(end, offset);

  return { boundary, body };
}

function makeRawMultipartRequest({
  audioBytes = 2048,
  totalBytes,
  contentLength,
  keepStreamOpen = false,
  chunkSizes,
  errorAfterChunks,
  onCancel,
  cancelError
} = {}) {
  const { boundary, body: bytes } = makeMultipartBytes({ audioBytes, totalBytes });
  const chunks = [];
  if (chunkSizes) {
    let offset = 0;
    for (const size of chunkSizes) {
      chunks.push(bytes.slice(offset, offset + size));
      offset += size;
    }
    if (offset < bytes.byteLength && errorAfterChunks === undefined) chunks.push(bytes.slice(offset));
    assert.ok(offset <= bytes.byteLength, 'chunk sizes cannot exceed the multipart body');
    if (errorAfterChunks === undefined) {
      assert.equal(offset, bytes.byteLength, 'chunk sizes must cover the complete multipart body');
    }
  } else {
    chunks.push(bytes);
  }

  let nextChunk = 0;
  const yieldedChunks = { count: 0 };
  const body = new ReadableStream({
    pull(controller) {
      if (errorAfterChunks !== undefined && nextChunk >= errorAfterChunks) {
        controller.error(new Error('mock request stream failure'));
        return;
      }
      if (nextChunk < chunks.length) {
        controller.enqueue(chunks[nextChunk++]);
        yieldedChunks.count += 1;
        if (nextChunk === chunks.length && !keepStreamOpen && errorAfterChunks === undefined) {
          controller.close();
        }
        return;
      }
      if (!keepStreamOpen && errorAfterChunks === undefined) controller.close();
    },
    cancel(reason) {
      onCancel?.(reason);
      if (cancelError) throw new Error('mock cancellation cleanup failure');
    }
  });
  const headers = { 'content-type': `multipart/form-data; boundary=${boundary}` };
  if (contentLength !== undefined) headers['content-length'] = String(contentLength);

  const request = new Request('http://localhost/api/stt', {
      method: 'POST',
      headers,
      body,
      duplex: 'half'
    });
  return { request, yieldedChunks };
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

function rawResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

async function runWithMocks({ env = {}, fetchMock, request = makeRequest(makeForm()) }) {
  configureEnv(env);
  globalThis.fetch = fetchMock;
  try {
    const response = await POST(request);
    return { response, data: await response.json() };
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of trackedEnv) delete process.env[key];
  }
}

async function runWithFakeTimeout({ timeoutOnCall, ...options }) {
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const delays = [];
  const clearedTimers = [];

  globalThis.setTimeout = (callback, delay, ...args) => {
    const timer = Symbol('mock-timeout');
    delays.push(delay);
    if (delays.length === timeoutOnCall) queueMicrotask(() => callback(...args));
    return timer;
  };
  globalThis.clearTimeout = (timer) => clearedTimers.push(timer);

  try {
    const result = await runWithMocks(options);
    return { ...result, delays, clearedTimers };
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
}

test('Groq is the first STT provider and receives the requested language and MIME-derived filename', async () => {
  const calls = [];
  const result = await runWithMocks({
    env: { groq: 'mock-groq-key' },
    request: makeRequest(makeForm({ type: 'audio/ogg', lang: 'en' })),
    fetchMock: async (url, init) => {
      calls.push({ url: String(url), init });
      return jsonResponse({ text: 'Recognized English words' });
    }
  });

  assert.equal(result.response.status, 200);
  assert.equal(result.data.text, 'Recognized English words');
  assert.equal(result.data.provider, 'groq-whisper');
  assert.deepEqual(calls.map((call) => call.url), [GROQ_URL]);
  assert.equal(calls[0].init.body.get('model'), 'whisper-large-v3-turbo');
  assert.equal(calls[0].init.body.get('language'), 'en');
  assert.equal(calls[0].init.body.get('file').name, 'recording.ogg');
  assert.equal(calls[0].init.body.get('file').type, 'audio/ogg');
});

test('Groq empty or failed response never fabricates text and does not call an unauthorized alternate', async (t) => {
  for (const response of [jsonResponse({ text: '  ' }), jsonResponse({ message: 'failure' }, 500), rawResponse('{bad json')]) {
    await t.test('empty/failed Groq response', async () => {
      const calls = [];
      const result = await runWithMocks({
        env: { groq: 'mock-groq-key', eleven: 'mock-eleven-key' },
        fetchMock: async (url) => { calls.push(String(url)); return response; }
      });
      assert.equal(result.response.status, 502);
      assert.equal(result.data.text, '');
      assert.equal(result.data.error, 'stt_upstream_error');
      assert.deepEqual(calls, [GROQ_URL]);
    });
  }
});

test('configured and explicitly authorized ElevenLabs is called only after Groq fails', async () => {
  const calls = [];
  const result = await runWithMocks({
    env: { groq: 'mock-groq-key', eleven: 'mock-eleven-key', elevenFallback: 'true' },
    fetchMock: async (url) => {
      calls.push(String(url));
      return String(url) === GROQ_URL
        ? jsonResponse({ error: 'Groq unavailable' }, 503)
        : jsonResponse({ text: 'Alternate transcript' });
    }
  });

  assert.equal(result.response.status, 200);
  assert.equal(result.data.text, 'Alternate transcript');
  assert.equal(result.data.provider, 'elevenlabs-scribe');
  assert.deepEqual(calls, [GROQ_URL, ELEVENLABS_URL]);
});

test('Groq authentication failure is not retried and only an authorized different provider may be tried once', async () => {
  const calls = [];
  const result = await runWithMocks({
    env: { groq: 'mock-groq-key', eleven: 'mock-eleven-key', elevenFallback: 'true' },
    fetchMock: async (url) => {
      calls.push(String(url));
      return String(url) === GROQ_URL
        ? jsonResponse({ error: 'authentication failed' }, 401)
        : jsonResponse({ text: 'Alternate transcript' });
    }
  });
  assert.equal(result.response.status, 200);
  assert.equal(result.data.provider, 'elevenlabs-scribe');
  assert.deepEqual(calls, [GROQ_URL, ELEVENLABS_URL]);
});

test('provider diagnostics never include mock credentials or upstream error text', async () => {
  const originalWarn = console.warn;
  const originalInfo = console.info;
  const diagnostics = [];
  console.warn = (...values) => diagnostics.push(values.join(' '));
  console.info = (...values) => diagnostics.push(values.join(' '));
  try {
    await runWithMocks({
      env: { groq: 'mock-secret-value', eleven: null },
      fetchMock: async () => jsonResponse({ error: 'private upstream payload' }, 401)
    });
  } finally {
    console.warn = originalWarn;
    console.info = originalInfo;
  }
  assert.doesNotMatch(diagnostics.join('\n'), /mock-secret-value|private upstream payload/);
});

test('ElevenLabs is never called without explicit opt-in, even when its key exists', async () => {
  const calls = [];
  const result = await runWithMocks({
    env: { groq: 'mock-groq-key', eleven: 'mock-eleven-key' },
    fetchMock: async (url) => { calls.push(String(url)); return jsonResponse({ error: 'failed' }, 500); }
  });

  assert.equal(result.response.status, 502);
  assert.equal(result.data.text, '');
  assert.deepEqual(calls, [GROQ_URL]);
});

test('when Groq is not configured, an authorized configured alternate may be used', async () => {
  const calls = [];
  const result = await runWithMocks({
    env: { groq: null, eleven: 'mock-eleven-key', elevenFallback: 'true' },
    fetchMock: async (url) => { calls.push(String(url)); return jsonResponse({ text: 'Alternate transcript' }); }
  });

  assert.equal(result.response.status, 200);
  assert.equal(result.data.text, 'Alternate transcript');
  assert.deepEqual(calls, [ELEVENLABS_URL]);
});

test('unconfigured STT returns an empty controlled response without provider calls', async () => {
  const calls = [];
  const result = await runWithMocks({
    env: { groq: null, eleven: null },
    fetchMock: async (url) => { calls.push(String(url)); return jsonResponse({ text: 'unexpected' }); }
  });
  assert.equal(result.response.status, 503);
  assert.equal(result.data.text, '');
  assert.equal(result.data.error, 'stt_not_configured');
  assert.deepEqual(calls, []);
});

test('Groq receives only recognized audio MIME types; filename does not determine format acceptance', async (t) => {
  for (const [mime, extension] of [['audio/webm;codecs=opus', 'webm'], ['audio/ogg', 'ogg'], ['audio/mp4', 'mp4']]) {
    await t.test(mime, async () => {
      let received;
      const result = await runWithMocks({
        env: { groq: 'mock-groq-key' },
        request: makeRequest(makeForm({ type: mime })),
        fetchMock: async (_url, init) => {
          received = init.body.get('file');
          return jsonResponse({ text: 'Recognized words' });
        }
      });
      assert.equal(result.response.status, 200);
      assert.equal(received.type, `audio/${extension}`);
      assert.equal(received.name, `recording.${extension}`);
    });
  }

  const invalid = await runWithMocks({
    env: { groq: 'mock-groq-key' },
    request: makeRequest(makeForm({ type: 'audio/wav' })),
    fetchMock: async () => { throw new Error('Provider must not be called'); }
  });
  assert.equal(invalid.response.status, 415);
  assert.equal(invalid.data.error, 'unsupported_audio_format');
});

test('invalid and oversized requests are rejected before providers', async (t) => {
  const cases = [
    ['missing file', makeForm({ includeFile: false }), 400],
    ['empty file', makeForm({ bytes: 0 }), 400],
    ['unsupported MIME', makeForm({ type: 'application/octet-stream' }), 415],
    ['unsupported language', makeForm({ lang: 'fr' }), 400],
    ['oversized file', makeForm({ bytes: MAX_AUDIO_BYTES + 1 }), 413],
    ['oversized declared body', makeForm(), 413, { 'content-length': String(MAX_MULTIPART_BODY_BYTES + 1) }]
  ];

  for (const [label, form, expectedStatus, headers] of cases) {
    await t.test(label, async () => {
      const calls = [];
      const result = await runWithMocks({
        env: { groq: 'mock-groq-key' },
        request: makeRequest(form, headers),
        fetchMock: async (url) => { calls.push(String(url)); return jsonResponse({ text: 'unexpected' }); }
      });
      assert.equal(result.response.status, expectedStatus);
      assert.equal(result.data.text, '');
      assert.deepEqual(calls, []);
    });
  }
});

test('multipart body below and exactly at total limit passes as multiple chunks', async (t) => {
  for (const [label, totalBytes] of [['below', MAX_MULTIPART_BODY_BYTES - 1], ['exact', MAX_MULTIPART_BODY_BYTES]]) {
    await t.test(label, async () => {
      const calls = [];
      const { request, yieldedChunks } = makeRawMultipartRequest({
        audioBytes: MAX_AUDIO_BYTES,
        totalBytes,
        contentLength: totalBytes,
        chunkSizes: [1024, 8192, totalBytes - 9216]
      });
      const result = await runWithMocks({
        env: { groq: 'mock-groq-key' }, request,
        fetchMock: async (url) => { calls.push(String(url)); return jsonResponse({ text: 'Recognized words' }); }
      });
      assert.equal(result.response.status, 200);
      assert.equal(result.data.text, 'Recognized words');
      assert.deepEqual(calls, [GROQ_URL]);
      assert.ok(yieldedChunks.count >= 3);
      assert.equal(request.body.locked, false);
    });
  }
});

test('multipart over-limit crossing chunk returns 413 and never calls a provider despite unreliable Content-Length', async (t) => {
  for (const [label, contentLength] of [['absent', undefined], ['invalid', 'not-a-number'], ['smaller than actual', 1]]) {
    await t.test(label, async () => {
      let cancelled = false;
      const calls = [];
      const { request, yieldedChunks } = makeRawMultipartRequest({
        audioBytes: 1024, totalBytes: MAX_MULTIPART_BODY_BYTES + 1, contentLength,
        chunkSizes: [MAX_MULTIPART_BODY_BYTES - 5, 6], keepStreamOpen: true,
        onCancel: () => { cancelled = true; }, cancelError: label === 'absent'
      });
      const result = await runWithMocks({
        request, fetchMock: async (url) => { calls.push(String(url)); return jsonResponse({ text: 'unexpected' }); }
      });
      assert.equal(result.response.status, 413);
      assert.equal(result.data.error, 'audio_too_large');
      assert.deepEqual(calls, []);
      assert.equal(cancelled, true);
      assert.equal(yieldedChunks.count, 2);
      assert.equal(request.body.locked, false);
    });
  }
});

test('Groq timeout aborts its request and returns no fabricated transcript', async () => {
  let aborted = false;
  const calls = [];
  const result = await runWithFakeTimeout({
    timeoutOnCall: 1,
    env: { groq: 'mock-groq-key' },
    fetchMock: async (url, init) => {
      calls.push(String(url));
      return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => {
        aborted = true;
        reject(new DOMException('Mock timeout', 'AbortError'));
      }, { once: true }));
    }
  });
  assert.equal(result.response.status, 502);
  assert.equal(result.data.text, '');
  assert.deepEqual(calls, [GROQ_URL]);
  assert.deepEqual(result.delays, [8_000]);
  assert.equal(aborted, true);
});

test('malformed multipart returns 400 without provider calls', async () => {
  const request = new Request('http://localhost/api/stt', {
    method: 'POST', headers: { 'content-type': 'multipart/form-data; boundary=expected-boundary' },
    body: 'not multipart'
  });
  let calls = 0;
  const result = await runWithMocks({ request, fetchMock: async () => { calls += 1; return jsonResponse({ text: 'unexpected' }); } });
  assert.equal(result.response.status, 400);
  assert.equal(result.data.error, 'invalid_form_data');
  assert.equal(calls, 0);
});
test.after(() => {
  globalThis.fetch = originalFetch;
  for (const key of trackedEnv) delete process.env[key];
  rmSync(buildDir, { recursive: true, force: true });
});
