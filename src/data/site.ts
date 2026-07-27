/**
 * Datos globales del sitio.
 * Edita este archivo para actualizar identidad, contacto y enlaces:
 * se propaga a metadatos, JSON-LD, header, hero, contacto y footer.
 *
 * `site` recoge lo que no cambia entre idiomas; `siteText` lo traducido.
 */
export const site = {
  name: 'Daniel Berdon',
  legalName: 'Héctor Daniel Berdon Carrillo',
  /** Versión del sitio: aparece en el footer y en la consola */
  version: '2.5.0',
  url: 'https://danielberdon.dev',
  domain: 'danielberdon.dev',
  email: 'danielberdon.dev@gmail.com',
  coordinates: '25.6866° N, 100.3161° W',
  timezone: 'UTC-6',
  social: {
    linkedin: {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/daniel-berdon',
      detail: 'in/daniel-berdon',
    },
  },
  cv: {
    url: '/cv-daniel-berdon.pdf',
    detail: 'PDF · 5 KB',
  },
  /**
   * Arranque de la actividad laboral, en hora de Monterrey. Alimenta el
   * contador de uptime en vivo de la ficha `fetch`: se lee como fecha local
   * de esa zona, así la cifra sale igual desde cualquier país.
   */
  uptimeSince: '2016-01-11T09:00:00',
} as const;

/**
 * Textos del sitio por idioma. Las claves son las mismas en todos los
 * idiomas; el contenido en Markdown vive en src/content/<colección>/en/.
 */
export const siteText = {
  es: {
    role: 'Ingeniero de Desarrollo Web y TI',
    tagline:
      'Plataformas web, herramientas internas, automatización de procesos e IA aplicada para empresas que quieren dejar de hacer a mano lo que la tecnología ya puede resolver.',
    location: 'Monterrey, N.L., México',
    locationShort: 'Monterrey, MX',
    languages: 'Español nativo · Inglés B2',
    availabilityShort: 'Disponible para proyectos',
    description:
      'Portafolio de Daniel Berdon, ingeniero de desarrollo web y TI en Monterrey. Plataformas web, automatización de procesos e inteligencia artificial aplicada al negocio.',
    blogDescription:
      'Notas técnicas sobre desarrollo web, automatización de procesos, infraestructura e IA aplicada. Lo que aprendo resolviendo problemas reales en producción.',
    cv: {
      label: 'Descargar CV',
      actualizado: 'Julio 2026',
    },
    /**
     * Ficha estilo `fetch` de la sección Sobre mí (clave: valor de terminal).
     * Solo datos verificables: todo sale del CV y de las capacidades.
     */
    fetch: {
      rol: 'Ing. de Desarrollo Web y TI',
      host: 'Monterrey, MX (UTC-6)',
      /** Texto de reserva: lo que se ve si el contador en vivo no arranca */
      uptime: '10 años en producción',
    },
    /**
     * Frentes de trabajo. Se pintan como pills, sin nota ni porcentaje: la
     * escala 0–10 era autoasignada y no verificable. `tone` es el color de la
     * paleta categórica con el que se distingue cada frente.
     */
    skills: [
      { name: 'Desarrollo web', tone: 'var(--c-1)' },
      { name: 'Automatización de procesos', tone: 'var(--c-5)' },
      { name: 'E-commerce y plataformas a medida', tone: 'var(--c-3)' },
      { name: 'Infraestructura y servidores', tone: 'var(--c-4)' },
      { name: 'IA aplicada', tone: 'var(--c-6)' },
      { name: 'Gestión técnica de proyectos', tone: 'var(--c-2)' },
    ],
    /** Áreas de conocimiento para el JSON-LD Person */
    knowsAbout: [
      'Desarrollo web',
      'WordPress',
      'WooCommerce',
      'TypeScript',
      'PHP',
      'Python',
      'Automatización de procesos',
      'Inteligencia artificial',
      'n8n',
      'Administración de servidores Linux',
    ],
  },
  en: {
    role: 'Web Development & IT Engineer',
    tagline:
      'Web platforms, internal tools, process automation and applied AI for companies that want to stop doing by hand what technology can already solve.',
    location: 'Monterrey, N.L., Mexico',
    locationShort: 'Monterrey, MX',
    languages: 'Native Spanish · English B2',
    availabilityShort: 'Available for projects',
    description:
      'Portfolio of Daniel Berdon, web development and IT engineer in Monterrey. Web platforms, process automation and artificial intelligence applied to business.',
    blogDescription:
      'Technical notes on web development, process automation, infrastructure and applied AI. What I learn solving real problems in production.',
    cv: {
      label: 'Download CV',
      actualizado: 'July 2026',
    },
    fetch: {
      rol: 'Web Dev & IT Engineer',
      host: 'Monterrey, MX (UTC-6)',
      uptime: '10 years in production',
    },
    skills: [
      { name: 'Web development', tone: 'var(--c-1)' },
      { name: 'Process automation', tone: 'var(--c-5)' },
      { name: 'E-commerce and custom platforms', tone: 'var(--c-3)' },
      { name: 'Infrastructure and servers', tone: 'var(--c-4)' },
      { name: 'Applied AI', tone: 'var(--c-6)' },
      { name: 'Technical project management', tone: 'var(--c-2)' },
    ],
    knowsAbout: [
      'Web development',
      'WordPress',
      'WooCommerce',
      'TypeScript',
      'PHP',
      'Python',
      'Process automation',
      'Artificial intelligence',
      'n8n',
      'Linux server administration',
    ],
  },
} as const;
