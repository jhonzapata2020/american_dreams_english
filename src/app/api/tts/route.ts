import { NextResponse } from 'next/server';
import { PRECACHED_INTENTS } from '../../../utils/adeVoiceControl';
import { matchStaticResponse } from '../../../lib/adeLocalRouting';

export async function POST(req: Request) {
  try {
    const {
      text,
      lang = 'en',
      isAudioEnabled = true,
      intentKey
    } = await req.json();

    // 1. CONDICIÓN DE AUDIO: Solo sintetizar si el audio está activo
    if (!isAudioEnabled) {
      return NextResponse.json(
        { skipped: true, reason: 'El audio está desactivado en el cliente' },
        { status: 200 }
      );
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // 2. PROTECCIÓN CACHÉ PRECARGADA (CERO CONSUMO ELEVENLABS)
    if (intentKey && PRECACHED_INTENTS[intentKey]) {
      return NextResponse.json(
        { cachedAudioUrl: PRECACHED_INTENTS[intentKey].audioUrl, intentKey, provider: 'ade-cache' },
        { status: 200 }
      );
    }

    const staticMatch = matchStaticResponse(text, lang as 'es' | 'en');
    if (staticMatch) {
      return NextResponse.json(
        { cachedAudioUrl: staticMatch.audioUrl, intentKey: staticMatch.id, provider: 'ade-local-static' },
        { status: 200 }
      );
    }

    // Limitar texto a máximo 220 caracteres como salvaguarda de cuota
    const safeText = text.slice(0, 220).trim();

    // 3. ELEVENLABS (Voz Rachel - Capa Gratuita / Pro)
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    if (elevenKey) {
      // Voice ID oficial de ADE en ElevenLabs
      const voiceId = process.env.ELEVENLABS_VOICE_ID || 'kfGEdprt9Oe4pbdP8VTo';
      const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

      let response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': elevenKey
          },
          body: JSON.stringify({
            text: safeText,
            model_id: modelId,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.2,
              use_speaker_boost: true
            }
          })
        }
      );

      // Si la voz de la librería requiere plan pago (402), usar automáticamente voz premade permitida en capa gratuita (Alice)
      if (response.status === 402 && voiceId !== 'Xb7hH8MSUJpSbSDYk0k2') {
        console.warn('Voz de librería requiere suscripción en ElevenLabs. Alternando a voz gratuita de alta fidelidad (Alice)...');
        response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': elevenKey
            },
            body: JSON.stringify({
              text: safeText,
              model_id: modelId,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.8,
                style: 0.2,
                use_speaker_boost: true
              }
            })
          }
        );
      }

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        return new Response(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=2592000, immutable' // 30 días de caché inmutable
          }
        });
      } else {
        const errDetail = await response.text();
        console.warn('ElevenLabs API aviso/error:', response.status, errDetail);
      }
    }

    // 4. OPENAI TTS ('nova' - Voz idéntica a ChatGPT)
    const openAIKey = process.env.OPENAI_API_KEY;
    if (openAIKey) {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: safeText,
          voice: 'nova',
          speed: 1.02
        })
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        return new Response(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=2592000, immutable'
          }
        });
      }
    }

    // 5. MICROSOFT AZURE SPEECH (500.000 caracteres gratis/mes para siempre)
    const azureKey = process.env.AZURE_SPEECH_KEY;
    const azureRegion = process.env.AZURE_SPEECH_REGION || 'eastus';
    if (azureKey) {
      const voiceName = lang === 'en' ? 'en-US-JennyNeural' : 'es-CO-SalmaNeural';
      const ssml = `
        <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang === 'en' ? 'en-US' : 'es-CO'}'>
          <voice name='${voiceName}'>${safeText}</voice>
        </speak>
      `;

      const response = await fetch(
        `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
          },
          body: ssml
        }
      );

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        return new Response(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=2592000, immutable'
          }
        });
      }
    }

    // Fallback a síntesis neuronal local del navegador
    return NextResponse.json(
      { provider: 'client-neural-fallback', message: 'Usar síntesis neuronal femenina del cliente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('TTS Route Error:', error);
    return NextResponse.json({ error: 'TTS processing error', details: String(error) }, { status: 500 });
  }
}
