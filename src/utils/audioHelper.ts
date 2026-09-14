/**
 * Genera un Data URL conteniendo un audio WAV sintético (tono de prueba armónico)
 * utilizando Web Audio API / PCM ArrayBuffer encoder.
 * Garantiza que la demostración comercial funcione 100% libre de fallos técnicos de micrófono.
 */
export function createSynthesizedAudioUrl(seconds: number = 4): string {
  const sampleRate = 22050;
  const numSamples = sampleRate * seconds;
  const buffer = new Uint8Array(44 + numSamples);

  // Helper para escribir strings ASCII
  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      buffer[offset + i] = string.charCodeAt(i);
    }
  }

  // RIFF Header
  writeString(0, 'RIFF');
  const fileSize = 36 + numSamples;
  buffer[4] = fileSize & 0xff;
  buffer[5] = (fileSize >> 8) & 0xff;
  buffer[6] = (fileSize >> 16) & 0xff;
  buffer[7] = (fileSize >> 24) & 0xff;

  writeString(8, 'WAVE');
  writeString(12, 'fmt ');

  // Subchunk1Size (16 bytes para PCM)
  buffer[16] = 16; buffer[17] = 0; buffer[18] = 0; buffer[19] = 0;
  // AudioFormat (1 = PCM)
  buffer[20] = 1; buffer[21] = 0;
  // NumChannels (1 = Mono)
  buffer[22] = 1; buffer[23] = 0;
  // SampleRate
  buffer[24] = sampleRate & 0xff;
  buffer[25] = (sampleRate >> 8) & 0xff;
  buffer[26] = (sampleRate >> 16) & 0xff;
  buffer[27] = (sampleRate >> 24) & 0xff;
  // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  const byteRate = sampleRate;
  buffer[28] = byteRate & 0xff;
  buffer[29] = (byteRate >> 8) & 0xff;
  buffer[30] = (byteRate >> 16) & 0xff;
  buffer[31] = (byteRate >> 24) & 0xff;
  // BlockAlign (NumChannels * BitsPerSample/8)
  buffer[32] = 1; buffer[33] = 0;
  // BitsPerSample (8 bits)
  buffer[34] = 8; buffer[35] = 0;

  // data Subchunk
  writeString(36, 'data');
  buffer[40] = numSamples & 0xff;
  buffer[41] = (numSamples >> 8) & 0xff;
  buffer[42] = (numSamples >> 16) & 0xff;
  buffer[43] = (numSamples >> 24) & 0xff;

  // Generar un tono agradable con arpegio sintético (Hello from American Dreams Turbo)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Frecuencias: 440Hz, 554.37Hz (C#), 659.25Hz (E) alternando suavemente
    const freq = t < 1 ? 440 : t < 2 ? 554.37 : t < 3 ? 659.25 : 880;
    const env = Math.sin((t % 1) * Math.PI); // Envolvente de volumen
    const sampleVal = Math.sin(2 * Math.PI * freq * t) * env;
    // Escalar de [-1, 1] a 8-bit unsigned [0, 255]
    buffer[44 + i] = Math.floor((sampleVal + 1) * 127.5);
  }

  // Convertir Uint8Array a Base64 Data URL
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  const base64 = btoa(binary);
  return `data:audio/wav;base64,${base64}`;
}
