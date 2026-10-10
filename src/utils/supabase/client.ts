import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function purgeResidualAuthCookies() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
        if (name.startsWith('sb-') && name.includes('auth-token')) {
          // Elimina la cookie residual en todos los ámbitos posibles
          document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`
          document.cookie = `${name}=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`
          document.cookie = `${name}=; Path=/; Domain=.${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`
        }
      }
    } catch {
      // Ignorar errores en entornos cerrados
    }
  }
}

// Ejecutar purga de inmediato en cuanto se importe en el cliente
purgeResidualAuthCookies()

export function createClient() {
  purgeResidualAuthCookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}
