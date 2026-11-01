export type ADEAudioFormat = {
  extension: 'webm' | 'ogg' | 'mp4';
  mimeType: 'audio/webm' | 'audio/ogg' | 'audio/mp4';
};

const AUDIO_FORMATS: Record<string, ADEAudioFormat> = {
  'audio/webm': { extension: 'webm', mimeType: 'audio/webm' },
  'audio/ogg': { extension: 'ogg', mimeType: 'audio/ogg' },
  'audio/mp4': { extension: 'mp4', mimeType: 'audio/mp4' }
};

export const MEDIA_RECORDER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/mp4;codecs=mp4a.40.2',
  'audio/mp4'
] as const;

export function getADEAudioFormat(mimeType: string): ADEAudioFormat | null {
  const baseMimeType = mimeType.split(';', 1)[0].trim().toLowerCase();
  return AUDIO_FORMATS[baseMimeType] || null;
}

export function chooseMediaRecorderMimeType(isTypeSupported: (mimeType: string) => boolean): string | null {
  return MEDIA_RECORDER_MIME_CANDIDATES.find(isTypeSupported) || null;
}

export function getSpeechRecognitionLocale(language: 'en' | 'es', navigatorLanguage?: string): string {
  const browserLanguage = navigatorLanguage?.trim();
  if (language === 'en') {
    return browserLanguage?.toLowerCase().startsWith('en') ? browserLanguage : 'en-US';
  }
  return browserLanguage?.toLowerCase().startsWith('es') ? browserLanguage : 'es-CO';
}

export function getValidTranscript(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function selectRecognitionTranscript(finalTranscript: unknown, interimTranscript: unknown): string {
  return getValidTranscript(finalTranscript) || getValidTranscript(interimTranscript);
}

export function extractRecognitionTranscript(results: ArrayLike<any>): { final: string; interim: string } {
  let final = '';
  let interim = '';
  for (let i = 0; i < results.length; i += 1) {
    const item = results[i];
    const transcript = getValidTranscript(item?.[0]?.transcript);
    if (!transcript) continue;
    if (item?.isFinal) final += `${final ? ' ' : ''}${transcript}`;
    else interim += `${interim ? ' ' : ''}${transcript}`;
  }
  return { final, interim };
}

export function getRecognitionAction(
  errorCode: string,
  hasTranscript: boolean
): 'use-transcript' | 'permission-denied' | 'fallback' | 'ignore' | 'restart' {
  if (errorCode === 'aborted') return 'ignore';
  if (errorCode === 'not-allowed') return 'permission-denied';
  if (errorCode === 'no-speech') return 'ignore';
  if (errorCode === 'ended') {
    return hasTranscript ? 'use-transcript' : 'restart';
  }
  if (hasTranscript) return 'use-transcript';
  if (errorCode === 'network' || errorCode === 'service-not-allowed') return 'fallback';
  return 'ignore';
}

export function chooseTTSPlaybackMode(
  ok: boolean,
  contentType: string,
  payload?: { cachedAudioUrl?: unknown; provider?: unknown }
): 'cached-audio' | 'server-audio' | 'browser-speech' | 'none' {
  if (!ok) return 'browser-speech';
  if (contentType.includes('application/json')) {
    if (typeof payload?.cachedAudioUrl === 'string' && payload.cachedAudioUrl) return 'cached-audio';
    if (payload?.provider === 'client-neural-fallback') return 'browser-speech';
    return 'none';
  }
  return contentType.includes('audio/mpeg') ? 'server-audio' : 'none';
}
