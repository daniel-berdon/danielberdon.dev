/**
 * Reglas compartidas del blog. Viven aquí porque las usan dos sitios que no se
 * ven entre sí: el índice, que pinta las entradas, y el endpoint que genera la
 * tarjeta de previsualización de cada una. Si el color se calculara por
 * separado en cada uno, acabarían discrepando.
 */

/** Colores de la paleta categórica (--c-1 … --c-6) */
export const TONOS = 6;

/**
 * Número de tono de una entrada dentro de un listado ordenado de más reciente
 * a más antigua.
 *
 * Se cuenta desde la más antigua a propósito: numerando desde la primera de la
 * lista, publicar recolorearía todo el blog en cada entrada nueva. Así cada
 * una conserva su color y la nueva toma el siguiente del ciclo.
 */
export function tonoDe(indiceEnLista: number, total: number): number {
  return ((total - 1 - indiceEnLista) % TONOS) + 1;
}

/** La paleta en hexadecimal: la tarjeta se rasteriza fuera del navegador y
    ahí no existen las variables CSS. Son los valores del tema oscuro. */
export const PALETA = [
  '#4da3ff', // c-1 azul
  '#35d6e8', // c-2 cian
  '#a78bfa', // c-3 violeta
  '#fbbf24', // c-4 ámbar
  '#3ecf8e', // c-5 verde
  '#ff8fa3', // c-6 rosa
] as const;

export const COLORES = {
  fondo: '#0d0d0f',
  tinta: '#ededf0',
  tintaSuave: '#b4b4ba',
  apagado: '#8a8a92',
} as const;
