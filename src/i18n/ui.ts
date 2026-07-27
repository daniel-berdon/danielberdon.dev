/**
 * Cadenas de interfaz por idioma.
 *
 * Hoy el sitio se publica solo en español, pero toda la UI pasa por `t()`.
 * Para añadir inglés: duplica el objeto `es` como `en`, traduce los valores
 * y sirve las rutas bajo /en (ver README).
 */

export const defaultLang = 'es';
export type Lang = keyof typeof ui;

export const ui = {
  es: {
    'skip.link': 'Saltar al contenido principal',

    'nav.trabajo': 'Proyectos',
    'nav.trayectoria': 'Trayectoria',
    'nav.blog': 'Blog',
    'nav.contacto': 'Contacto',
    'nav.aria': 'Navegación principal',

    'blog.title': 'Blog',
    'blog.eyebrow': 'Notas técnicas',
    'blog.back': 'Todas las entradas',
    'blog.more': 'Más entradas',
    'blog.older': 'Entrada anterior',
    'blog.newer': 'Entrada siguiente',
    'blog.updated': 'Actualizado el',
    'blog.empty':
      'Aún no hay entradas publicadas. Estoy escribiendo la primera: vuelve pronto o suscríbete al RSS.',

    'theme.toggle.light': 'Claro',
    'theme.toggle.dark': 'Oscuro',
    'theme.toggle.aria': 'Claro — pulsa para cambiar de tema',

    'boot.ui': '> montando interfaz ………………',
    'boot.theme': '> tema frío, acento azul ……',
    'boot.portrait': '> retrato en 1 bit …………',
    'boot.ready': 'listo',

    'hero.eyebrow': 'Ingeniero de Desarrollo Web y TI',
    'hero.meta.ubicacion': 'Ubicación',
    'hero.meta.disponibilidad': 'Estado',
    'hero.meta.contacto': 'Correo',
    'hero.meta.idiomas': 'Idiomas',
    'hero.index': 'Índice',
    'hero.portrait.alt':
      'Retrato de Daniel Berdon procesado con dithering Atkinson de 1 bit',

    'section.01.title': 'Sobre mí',
    'section.02.title': 'Trayectoria',
    'section.03.title': 'Proyectos',
    'section.04.title': 'Capacidades',
    'section.05.title': 'Contacto',

    'about.p1':
      'Soy ingeniero en Sistemas Computacionales y lidero el área de TI de una agencia digital en Monterrey. Llevo diez años en proyectos web y digitales, especializado en traducir necesidades de negocio en soluciones que funcionan: plataformas web, herramientas internas, automatización de procesos e inteligencia artificial aplicada.',
    'about.p2':
      'Trabajo de punta a punta: levantamiento de requerimientos, evaluación de proveedores, desarrollo, puesta en producción, documentación y mantenimiento de la infraestructura. Mi perfil técnico se complementa con diseño digital, video y producción multimedia — abordo cada proyecto desde lo analítico y desde lo creativo.',

    'projects.rol': 'Rol',
    'projects.stack': 'Stack',
    'projects.resultado': 'Resultado',
    'projects.more': 'Ver caso completo',

    'xp.formacion': 'Formación',

    'about.fetch.aria': 'Ficha técnica en formato terminal',
    'about.skills.aria': 'Frentes de trabajo y su stack',
    'method.aria': 'Cómo trabajo, en tres pasos',
    'method.1.title': 'Diagnóstico',
    'method.1.text': 'Entender el proceso antes de escribir una línea.',
    'method.2.title': 'Construcción',
    'method.2.text': 'A producción por partes, no en un solo salto.',
    'method.3.title': 'Acompañamiento',
    'method.3.text': 'Ajustes y soporte con el sistema ya en uso.',

    'contact.lead':
      'Baja latencia, cero burocracia. Escríbeme y lo vemos.',
    'contact.note': 'Respondo en menos de 24 h laborables.',
    'contact.copy': 'copiar correo',
    'contact.copied': 'copiado ✓',

    'footer.top': 'Volver arriba',
    'footer.konami': '¿Te suena esta secuencia? Pruébala aquí mismo.',

    'case.back': 'Índice de proyectos',
    'case.rol': 'Rol',
    'case.anio': 'Año',
    'case.stack': 'Stack',
    'case.resultado': 'Resultado',
    'case.prev': 'Proyecto anterior',
    'case.next': 'Proyecto siguiente',

    '404.title': 'Página no encontrada',
    '404.text':
      'La URL que buscas no existe o se movió de sitio. Como en todo buen sistema, el error está registrado: vuelve al inicio y sigue por el índice.',
    '404.link': 'Volver al inicio',
  },
} as const;

export type UiKey = keyof (typeof ui)[typeof defaultLang];

/** Devuelve la función de traducción para un idioma. */
export function useTranslations(lang: Lang = defaultLang) {
  return function t(key: UiKey): string {
    return ui[lang][key];
  };
}

/** Fecha larga en español: "23 de julio de 2026". */
export function formatDate(date: Date, lang: Lang = defaultLang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
