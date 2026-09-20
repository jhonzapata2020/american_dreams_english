/**
 * Utilidades deterministas de formateo numérico y de moneda
 * Previene discrepancias de hidratación (hydration mismatches) entre Server-Side Rendering y Client-Side Rendering.
 */

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatCOPK(copAmount: number): string {
  const thousands = Math.round(copAmount / 1000);
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(thousands);
}

export function formatMoney(amount: number, currency: string = 'COP'): string {
  if (currency === 'USD') {
    return `$${Math.round(amount)} USD`;
  }
  if (currency === 'EUR') {
    return `€${Math.round(amount)} EUR`;
  }
  return `$${formatCOP(amount)} COP`;
}
