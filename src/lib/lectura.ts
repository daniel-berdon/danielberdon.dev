/**
 * Tiempo de lectura estimado de una entrada.
 *
 * Se calcula desde el Markdown en crudo en lugar de con un plugin remark:
 * Astro 7 exigiría instalar y activar otro procesador de Markdown solo para
 * esto, y el cálculo es una división.
 */
const PALABRAS_POR_MINUTO = 200;

export function minutosLectura(markdown: string): number {
  const limpio = markdown
    .replace(/```[\s\S]*?```/g, ' ') // bloques de código
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // enlaces e imágenes
    .replace(/[#>*_`~-]/g, ' ');
  const palabras = limpio.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO));
}
