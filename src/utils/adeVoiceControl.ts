import { createAdminClient } from './supabase/admin';
import { matchStaticResponse, LOCAL_ADE_ROUTES } from '../lib/adeLocalRouting';

export interface ADEUsageResult {
  allowed: boolean;
  turnsCount: number;
  maxFreeTurns: number;
  turnsRemaining: number;
  limitReached: boolean;
  closingMessage?: string;
}

export const PRECACHED_INTENTS: Record<string, { text: string; audioUrl: string }> = Object.fromEntries(
  LOCAL_ADE_ROUTES.map((r) => [r.id, { text: r.text, audioUrl: r.audioUrl }])
);

/**
 * Detecta si el mensaje coincide con una intención institucional precargada
 * para ahorrar 100% de caracteres en ElevenLabs mediante los 28 audios locales.
 */
export function matchPrecachedIntent(
  query: string,
  lang: 'es' | 'en' = 'es',
  lastIntentKey?: string | null,
  lastAudioPlayed?: string | null
): { intentKey: string; text: string; audioUrl: string } | null {
  const match = matchStaticResponse(query, lang, lastIntentKey, lastAudioPlayed);
  if (!match) return null;
  return {
    intentKey: match.id,
    text: match.text,
    audioUrl: match.audioUrl
  };
}

// Fallback en memoria en caso de desconexión o latencia de base de datos
const inMemoryUsage = new Map<string, number>();

/**
 * Registra y telemetriza el uso de turnos de voz de ADE sin bloquear la conversación
 * ni inyectar mensajes forzados de matrícula.
 */
export async function trackGuestVoiceTurn(sessionToken: string): Promise<ADEUsageResult> {
  const MAX_FREE_TURNS = 10;
  const token = sessionToken?.trim() || 'anonymous_guest';

  try {
    const supabase = createAdminClient();

    // 1. Consultar estado actual
    const { data: existing, error: selectError } = await supabase
      .from('guest_ade_usage')
      .select('voice_turns_count, max_free_turns')
      .eq('session_token', token)
      .maybeSingle();

    if (!selectError && existing) {
      const currentCount = existing.voice_turns_count ?? 0;
      const nextCount = currentCount + 1;
      
      await supabase
        .from('guest_ade_usage')
        .update({
          voice_turns_count: nextCount,
          last_interaction: new Date().toISOString()
        })
        .eq('session_token', token);

      return {
        allowed: true,
        turnsCount: nextCount,
        maxFreeTurns: MAX_FREE_TURNS,
        turnsRemaining: Math.max(0, MAX_FREE_TURNS - nextCount),
        limitReached: false
      };
    } else {
      // Registrar primera interacción
      await supabase
        .from('guest_ade_usage')
        .insert({
          session_token: token,
          voice_turns_count: 1,
          max_free_turns: MAX_FREE_TURNS,
          last_interaction: new Date().toISOString()
        });

      return {
        allowed: true,
        turnsCount: 1,
        maxFreeTurns: MAX_FREE_TURNS,
        turnsRemaining: MAX_FREE_TURNS - 1,
        limitReached: false
      };
    }
  } catch (err) {
    const current = inMemoryUsage.get(token) || 0;
    const next = current + 1;
    inMemoryUsage.set(token, next);

    return {
      allowed: true,
      turnsCount: next,
      maxFreeTurns: MAX_FREE_TURNS,
      turnsRemaining: Math.max(0, MAX_FREE_TURNS - next),
      limitReached: false
    };
  }
}
