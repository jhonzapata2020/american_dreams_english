/**
 * Configuración centralizada de datos de contacto institucional de American Dream English.
 * Unifica los enlaces de WhatsApp, teléfonos de atención y canales de soporte.
 */

export const CONTACT_CONFIG = {
  // Número oficial de WhatsApp y atención (Profe Anthony / Admisiones)
  whatsappRaw: '573127459728',
  whatsappFormatted: '+57 312 745 9728',
  phoneLandline: '+57 (604) 827-2471',
  email: 'contacto@americandreams.edu.co',
  location: {
    address: 'Vereda Casanova, Kilómetro 3 Vía Turbo - Apartadó',
    city: 'Turbo, Antioquia, Colombia',
    coordinates: '8.091769,-76.708828',
  },
} as const;

/**
 * Genera una URL directa de WhatsApp con mensaje codificado
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = 'Hola American Dream English, quisiera recibir información sobre los programas y matrículas.';
  const message = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${CONTACT_CONFIG.whatsappRaw}?text=${message}`;
}
