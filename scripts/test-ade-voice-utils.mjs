import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(resolve('src/lib/adeVoiceUtils.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const utils = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const routingSource = readFileSync(resolve('src/lib/adeLocalRouting.ts'), 'utf8');
const routingCompiled = ts.transpileModule(routingSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const routing = await import(`data:text/javascript;base64,${Buffer.from(routingCompiled).toString('base64')}`);

test('MediaRecorder chooses only a MIME reported as supported, in preference order', () => {
  const supported = new Set(['audio/mp4;codecs=mp4a.40.2', 'audio/mp4']);
  assert.equal(utils.chooseMediaRecorderMimeType((mime) => supported.has(mime)), 'audio/mp4;codecs=mp4a.40.2');
  assert.equal(utils.chooseMediaRecorderMimeType(() => false), null);
});

test('audio MIME validation uses the media type, accepts supported codec parameters, and rejects unknown types', () => {
  assert.deepEqual(utils.getADEAudioFormat(' Audio/WEBM;codecs=opus '), {
    extension: 'webm', mimeType: 'audio/webm'
  });
  assert.deepEqual(utils.getADEAudioFormat('audio/ogg; codecs=opus'), {
    extension: 'ogg', mimeType: 'audio/ogg'
  });
  assert.deepEqual(utils.getADEAudioFormat('audio/mp4'), {
    extension: 'mp4', mimeType: 'audio/mp4'
  });
  assert.equal(utils.getADEAudioFormat('audio/wav'), null);
  assert.equal(utils.getADEAudioFormat(''), null);
});

test('recognition language follows ADE selection and uses a matching browser dialect when available', () => {
  assert.equal(utils.getSpeechRecognitionLocale('en', 'es-CO'), 'en-US');
  assert.equal(utils.getSpeechRecognitionLocale('en', 'en-GB'), 'en-GB');
  assert.equal(utils.getSpeechRecognitionLocale('es', 'en-US'), 'es-CO');
  assert.equal(utils.getSpeechRecognitionLocale('es', 'es-MX'), 'es-MX');
});

test('only non-empty string transcripts are considered valid', () => {
  assert.equal(utils.getValidTranscript('  course prices  '), 'course prices');
  assert.equal(utils.getValidTranscript('   '), '');
  assert.equal(utils.getValidTranscript(undefined), '');
  assert.equal(utils.getValidTranscript({ transcript: 'invented' }), '');
});

test('final recognition text wins over interim text; interim is usable once when final text is absent', () => {
  assert.equal(utils.selectRecognitionTranscript('final answer', 'interim hypothesis'), 'final answer');
  assert.equal(utils.selectRecognitionTranscript('', ' interim hypothesis '), 'interim hypothesis');
  assert.equal(utils.selectRecognitionTranscript(' ', ' '), '');
});

test('recognition separates interim text from final transcript and assembles final segments', () => {
  const result = utils.extractRecognitionTranscript([
    { isFinal: true, 0: { transcript: ' course ' } },
    { isFinal: false, 0: { transcript: 'prices' } },
    { isFinal: true, 0: { transcript: 'please' } },
    { isFinal: true, 0: { transcript: '   ' } }
  ]);
  assert.deepEqual(result, { final: 'course please', interim: 'prices' });
  assert.deepEqual(utils.extractRecognitionTranscript([]), { final: '', interim: '' });
});

test('recognition errors use a valid final transcript, report permission denial, or hand off to recording', () => {
  assert.equal(utils.getRecognitionAction('network', true), 'use-transcript');
  assert.equal(utils.getRecognitionAction('no-speech', false), 'ignore');
  assert.equal(utils.getRecognitionAction('ended', false), 'restart');
  assert.equal(utils.getRecognitionAction('ended', true), 'use-transcript');
  assert.equal(utils.getRecognitionAction('service-not-allowed', false), 'fallback');
  assert.equal(utils.getRecognitionAction('network', false), 'fallback');
  assert.equal(utils.getRecognitionAction('not-allowed', false), 'permission-denied');
  assert.equal(utils.getRecognitionAction('not-allowed', true), 'permission-denied');
  assert.equal(utils.getRecognitionAction('aborted', false), 'ignore');
});

test('TTS chooses exactly one playback path and does not replace a valid cached or server audio response', () => {
  assert.equal(utils.chooseTTSPlaybackMode(true, 'application/json', { cachedAudioUrl: '/audio/ade/es-precios.mp3' }), 'cached-audio');
  assert.equal(utils.chooseTTSPlaybackMode(true, 'application/json', { provider: 'client-neural-fallback' }), 'browser-speech');
  assert.equal(utils.chooseTTSPlaybackMode(true, 'audio/mpeg'), 'server-audio');
  assert.equal(utils.chooseTTSPlaybackMode(false, 'application/json'), 'browser-speech');
  assert.equal(utils.chooseTTSPlaybackMode(true, 'application/json', { provider: 'unknown' }), 'none');
});

test('common Spanish and English course questions resolve to local MP3 routes', () => {
  const spanish = routing.matchStaticResponse('¿Cuánto cuestan los cursos?', 'es');
  const english = routing.matchStaticResponse('What courses do you offer?', 'en');
  assert.equal(spanish?.id, 'es-precios');
  assert.equal(spanish?.audioUrl, '/audio/ade/es-precios.mp3');
  assert.equal(english?.id, 'en-levels');
  assert.equal(english?.audioUrl, '/audio/ade/en-levels.mp3');
  assert.equal(existsSync(resolve('public', 'audio/ade/es-precios.mp3')), true);
  assert.equal(existsSync(resolve('public', 'audio/ade/en-levels.mp3')), true);
  assert.equal(existsSync(resolve('public', 'audio/ade/en-hello.mp3')), true);
});
