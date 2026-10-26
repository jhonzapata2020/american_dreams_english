import { NextResponse } from 'next/server';
import {
  matchPrecachedIntent,
  trackGuestVoiceTurn
} from '../../../utils/adeVoiceControl';
import { isLikelyEnglish } from '../../../lib/adeLocalRouting';

export async function POST(req: Request) {
  try {
    const {
      message,
      lang = 'es',
      sessionToken,
      isVoiceTurn = false,
      lastResolvedIntent = null,
      lastAudioPlayed = null
    } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'El mensaje es requerido' },
        { status: 400 }
      );
    }

    // 1. CACHÉ DE RESPUESTAS INSTITUCIONALES (CERO CONSUMO ELEVENLABS / LLM)
    // Conmutación dinámica: si el mensaje actual es en inglés se busca en inglés, si es español en español
    const detectedEnglish = isLikelyEnglish(message);
    const effectiveLang: 'en' | 'es' = detectedEnglish ? 'en' : 'es';
    const cachedMatch = matchPrecachedIntent(message, effectiveLang, lastResolvedIntent, lastAudioPlayed);
    if (cachedMatch) {
      return NextResponse.json({
        reply: cachedMatch.text,
        cachedAudioUrl: cachedMatch.audioUrl,
        intentKey: cachedMatch.intentKey,
        provider: 'ade-audio-cache',
        cached: true,
        turnsRemaining: 10,
        limitReached: false
      });
    }

    // 2. TELEMETRÍA Y SEGUIMIENTO DE TURNOS (SIN SECUESTRO DE CONVERSACIÓN)
    let usageInfo = {
      allowed: true,
      turnsCount: 0,
      turnsRemaining: 10,
      limitReached: false
    };

    if (isVoiceTurn) {
      try {
        const turnCheck = await trackGuestVoiceTurn(sessionToken || 'guest_default');
        usageInfo = turnCheck;
      } catch (e) {
        // Silencioso
      }
    }

    // 3. INTENTO CON AGENTE DAPTA (Entrenado con PDF oficial de la academia)
    const daptaUrl = process.env.DAPTA_AGENT_URL || process.env.DAPTA_WEBHOOK_URL;
    const daptaKey = process.env.DAPTA_API_KEY;
    if (daptaUrl || daptaKey) {
      try {
        const endpoint = daptaUrl || 'https://api.dapta.ai/api/v1/chat';
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (daptaKey) headers['Authorization'] = `Bearer ${daptaKey}`;

        const daptaRes = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message,
            query: message,
            language: effectiveLang,
            sessionToken
          })
        });

        if (daptaRes.ok) {
          const daptaData = await daptaRes.json();
          const replyText = daptaData?.reply || daptaData?.response || daptaData?.answer || daptaData?.message;
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              provider: 'dapta-agent',
              cached: false,
              turnsRemaining: usageInfo.turnsRemaining,
              limitReached: usageInfo.limitReached
            });
          }
        }
      } catch (daptaErr) {
        console.warn('Fallback de Dapta a Gemini Flash:', daptaErr);
      }
    }

    // 4. SYSTEM PROMPT DE ALTO RENDIMIENTO INSTITUCIONAL (Gemini Flash / GPT-4o mini)
    const institutionalSystemPrompt = `Eres ADE, tutora virtual y asesora de admisiones oficial de American Dream English (sede presencial en Turbo, Urabá, Resolución SED 2471 y cobertura virtual internacional).
Tu objetivo es motivar, asesorar y promover activamente las matrículas virtuales, el Campus Virtual y los materiales de la Tienda Digital.

DIRECTRICES OBLIGATORIAS:
1. REGLA ESTRICTA DE BREVEDAD (AHORRO MÁXIMO DE VOZ):
   - Cada respuesta DEBE tener EXACTAMENTE 2 oraciones (entre 140 y 180 caracteres en total). Ni una palabra de más.
   - Siempre cierra con una llamada a la acción (visitar la Tienda, revisar horarios del Campus o matricularse).
2. PROHIBICIÓN LEGAL DE COMPETIDORES:
   - Jamás menciones nombres de marcas registradas ni competidores comerciales (terminantemente prohibido nombrar Open English u otras empresas).
   - Siempre contrasta nuestra metodología diciendo: "a diferencia de las plataformas convencionales de videos pregrabados en soledad".
3. PROPUESTA DE VALOR DEL MÉTODO:
   - Resalta interacción humana en tiempo real con docentes certificados C1/C2 en grupos guiados con corrección en vivo.
   - Explica el Campus Virtual y la Sala de Cómputo Virtual con horarios 100% flexibles y seguimiento personalizado.
   - Promueve activamente los e-books y guías de estudio descargables en la sección "Tienda".
   - Ofrece matrículas virtuales para cualquier lugar del mundo y programas presenciales en Urabá, con preparación para certificación internacional MCER (B2/C1) y Fondo de Becas.
4. TONO:
   - Motivador, empático, seguro y bilingüe natural. Responde en ${effectiveLang === 'en' ? 'Inglés' : 'Español'}.`;

    // 5. INTENTO CON GOOGLE GEMINI 1.5 FLASH (Google AI Studio)
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: institutionalSystemPrompt + '\n\nPregunta: ' + message }] }
              ],
              generationConfig: {
                maxOutputTokens: 80,
                temperature: 0.6
              }
            })
          }
        );

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const replyText = gData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              provider: 'gemini-flash',
              cached: false,
              turnsRemaining: usageInfo.turnsRemaining,
              limitReached: usageInfo.limitReached
            });
          }
        }
      } catch (err) {
        console.warn('Fallo llamada Gemini Flash, usando motor institucional:', err);
      }
    }

    // 6. INTENTO CON OPENAI (GPT-4o mini)
    const openAIKey = process.env.OPENAI_API_KEY;
    if (openAIKey) {
      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: institutionalSystemPrompt },
              { role: 'user', content: message }
            ],
            max_tokens: 80,
            temperature: 0.6
          })
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const replyText = aiData?.choices?.[0]?.message?.content?.trim();
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              provider: 'gpt-4o-mini',
              cached: false,
              turnsRemaining: usageInfo.turnsRemaining,
              limitReached: usageInfo.limitReached
            });
          }
        }
      } catch (err) {
        console.warn('Fallback de OpenAI a motor institucional local:', err);
      }
    }

    // 7. MOTOR DE CONOCIMIENTO INSTITUCIONAL LOCAL (0 Latencia, 0 Costo, 100% Breve)
    const lower = message.toLowerCase();
    let reply = '';

    if (
      lower.includes('como estas') ||
      lower.includes('cómo estás') ||
      lower.includes('how are you') ||
      lower.includes('que tal')
    ) {
      reply =
        effectiveLang === 'en'
          ? "I'm doing great and excited to help you speak English! Explore our live Campus or start your enrollment today."
          : "¡Muy bien! Qué alegría saludarte y guiarte a tu meta bilingüe. Explora nuestro Campus Virtual o haz clic en 'Matricúlate'.";
    } else if (
      lower.includes('hablemos en ingl') ||
      lower.includes('practicar ingl') ||
      lower.includes('practice english') ||
      lower.includes('speak english') ||
      lower.includes('talk in english') ||
      lower.includes('english with you')
    ) {
      reply = "Awesome! Practice in real time with our certified C1/C2 teachers in the Virtual Campus. Tell me, what is your dream goal with English?";
    } else if (lower.includes('horario') || lower.includes('tiempo')) {
      reply =
        effectiveLang === 'en'
          ? "Our live classes have flexible morning, afternoon, and evening sessions in our Virtual Campus. Click 'Enroll' to get started!"
          : "Nuestras clases en vivo cuentan con horarios flexibles mañana, tarde y noche en el Campus Virtual. ¡Haz clic en 'Matricúlate' y elige tu horario!";
    } else if (lower.includes('sede') || lower.includes('turbo') || lower.includes('uraba') || lower.includes('direccion')) {
      reply =
        effectiveLang === 'en'
          ? "We have an official campus in Turbo, Urabá, and nationwide virtual live classes. Join our Campus today!"
          : "Tenemos sede oficial en Turbo, Urabá, y cobertura virtual para todo el país. ¡Conoce nuestras aulas presenciales o únete al Campus online!";
    } else {
      reply =
        effectiveLang === 'en'
          ? "At American Dream English you practice in real-time with certified live C1 teachers. Tell me, what would you like to achieve today?"
          : "En American Dream English aprendes con docentes C1 en vivo y seguimiento personalizado. ¡Haz clic en 'Matricúlate' para asegurar tu cupo!";
    }

    return NextResponse.json({
      reply,
      provider: 'ade-institutional-engine',
      turnsRemaining: usageInfo.turnsRemaining,
      limitReached: usageInfo.limitReached
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Error procesando solicitud de chat' },
      { status: 500 }
    );
  }
}
