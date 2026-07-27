/**
 * Cadenas de interfaz por idioma.
 *
 * El sitio se publica en español (raíz) e inglés (bajo /en). Toda la UI pasa
 * por `t(lang)`: para añadir un idioma, duplica un objeto de `ui`, traduce
 * los valores y crea las rutas con el prefijo correspondiente.
 */

export const defaultLang = 'es';
export const locales = ['es', 'en'] as const;
export type Lang = (typeof locales)[number];

export const ui = {
  es: {
    'skip.link': 'Saltar al contenido principal',

    'nav.trabajo': 'Proyectos',
    'nav.trayectoria': 'Trayectoria',
    'nav.blog': 'Blog',
    'nav.contacto': 'Contacto',
    'nav.aria': 'Navegación principal',
    'nav.app.aria': 'Secciones del sitio',
    'nav.lang.aria': 'View this page in English',

    'blog.title': 'Blog',
    'blog.eyebrow': 'Notas técnicas',
    'blog.latest': 'Última entrada',
    'blog.earlier': 'Anteriores',
    'blog.read': 'Leer',
    'blog.back': 'Todas las entradas',
    'blog.more': 'Más entradas',
    'blog.older': 'Entrada anterior',
    'blog.newer': 'Entrada siguiente',
    'blog.updated': 'Actualizado el',
    'blog.min': 'min de lectura',
    'blog.empty':
      'Aún no hay entradas publicadas. Estoy escribiendo la primera: vuelve pronto o suscríbete al RSS.',

    'theme.toggle.light': 'Claro',
    'theme.toggle.dark': 'Oscuro',
    'theme.toggle.aria': 'Oscuro — pulsa para cambiar de tema',

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
  en: {
    'skip.link': 'Skip to main content',

    'nav.trabajo': 'Projects',
    'nav.trayectoria': 'Experience',
    'nav.blog': 'Blog',
    'nav.contacto': 'Contact',
    'nav.aria': 'Main navigation',
    'nav.app.aria': 'Site sections',
    'nav.lang.aria': 'Ver esta página en español',

    'blog.title': 'Blog',
    'blog.eyebrow': 'Technical notes',
    'blog.latest': 'Latest post',
    'blog.earlier': 'Earlier posts',
    'blog.read': 'Read',
    'blog.back': 'All posts',
    'blog.more': 'More posts',
    'blog.older': 'Older post',
    'blog.newer': 'Newer post',
    'blog.updated': 'Updated on',
    'blog.min': 'min read',
    'blog.empty':
      'No posts published yet. I am writing the first one: come back soon or subscribe to the RSS feed.',

    'theme.toggle.light': 'Light',
    'theme.toggle.dark': 'Dark',
    'theme.toggle.aria': 'Dark — press to toggle theme',

    'boot.ui': '> mounting interface ………………',
    'boot.theme': '> cold theme, blue accent …',
    'boot.portrait': '> 1-bit portrait …………',
    'boot.ready': 'ready',

    'hero.eyebrow': 'Web Development & IT Engineer',
    'hero.meta.ubicacion': 'Location',
    'hero.meta.disponibilidad': 'Status',
    'hero.meta.contacto': 'Email',
    'hero.meta.idiomas': 'Languages',
    'hero.index': 'Index',
    'hero.portrait.alt':
      'Portrait of Daniel Berdon processed with 1-bit Atkinson dithering',

    'section.01.title': 'About me',
    'section.02.title': 'Experience',
    'section.03.title': 'Projects',
    'section.04.title': 'Capabilities',
    'section.05.title': 'Contact',

    'about.p1':
      'I am a Computer Systems engineer and I lead the IT area of a digital agency in Monterrey. I have spent ten years on web and digital projects, specialized in translating business needs into solutions that work: web platforms, internal tools, process automation and applied artificial intelligence.',
    'about.p2':
      'I work end to end: requirements gathering, vendor evaluation, development, production rollout, documentation and infrastructure maintenance. My technical profile is complemented by digital design, video and multimedia production — I approach every project from both the analytical and the creative side.',

    'projects.rol': 'Role',
    'projects.stack': 'Stack',
    'projects.resultado': 'Outcome',
    'projects.more': 'View full case',

    'xp.formacion': 'Education',

    'about.fetch.aria': 'Profile card in terminal format',
    'about.skills.aria': 'Work areas and their stack',
    'method.aria': 'How I work, in three steps',
    'method.1.title': 'Diagnosis',
    'method.1.text': 'Understand the process before writing a single line.',
    'method.2.title': 'Construction',
    'method.2.text': 'To production in parts, not in one leap.',
    'method.3.title': 'Follow-through',
    'method.3.text': 'Tuning and support once the system is in use.',

    'contact.lead':
      'Low latency, zero red tape. Drop me a line and we will talk.',
    'contact.note': 'I reply within 24 business hours.',
    'contact.copy': 'copy email',
    'contact.copied': 'copied ✓',

    'footer.top': 'Back to top',
    'footer.konami': 'Does this sequence ring a bell? Try it right here.',

    'case.back': 'Project index',
    'case.rol': 'Role',
    'case.anio': 'Year',
    'case.stack': 'Stack',
    'case.resultado': 'Outcome',
    'case.prev': 'Previous project',
    'case.next': 'Next project',

    '404.title': 'Page not found',
    '404.text':
      'The URL you are looking for does not exist or was moved. As in any good system, the error is logged: head back home and carry on through the index.',
    '404.link': 'Back to home',
  },
} as const;

export type UiKey = keyof (typeof ui)[typeof defaultLang];

/** Devuelve la función de traducción para un idioma. */
export function useTranslations(lang: Lang = defaultLang) {
  return function t(key: UiKey): string {
    return ui[lang][key];
  };
}

/** Idioma de una ruta: todo lo que cuelga de /en es inglés. */
export function getLangFromUrl(url: URL): Lang {
  const primer = url.pathname.split('/')[1];
  return (locales as readonly string[]).includes(primer) && primer !== defaultLang
    ? (primer as Lang)
    : defaultLang;
}

/** Portada del idioma: '/' en español, '/en/' en inglés. */
export function homePath(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

/** Prefija una ruta interna con el idioma: ('en', '/blog') → '/en/blog'. */
export function localePath(lang: Lang, path: string): string {
  return lang === defaultLang ? path : `/${lang}${path}`;
}

/** La misma página en el otro idioma: los slugs son idénticos entre idiomas,
    así que basta añadir o quitar el prefijo /en. */
export function switchLangPath(pathname: string, target: Lang): string {
  const sinIdioma = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (target === defaultLang) return sinIdioma;
  return sinIdioma === '/' ? '/en/' : `/en${sinIdioma}`;
}

/** Fecha larga localizada: "23 de julio de 2026" / "July 23, 2026". */
export function formatDate(date: Date, lang: Lang = defaultLang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
