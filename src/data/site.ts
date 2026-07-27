/**
 * Datos globales del sitio.
 * Edita este archivo para actualizar identidad, contacto y enlaces:
 * se propaga a metadatos, JSON-LD, header, hero, contacto y footer.
 */
export const site = {
  name: 'Daniel Berdon',
  legalName: 'Héctor Daniel Berdon Carrillo',
  role: 'Ingeniero de Desarrollo Web y TI',
  /** Versión del sitio: aparece en el footer y en la consola */
  version: '2.5.0',
  tagline:
    'Plataformas web, herramientas internas, automatización de procesos e IA aplicada para empresas que quieren dejar de hacer a mano lo que la tecnología ya puede resolver.',
  url: 'https://danielberdon.dev',
  domain: 'danielberdon.dev',
  email: 'danielberdon.dev@gmail.com',
  location: 'Monterrey, N.L., México',
  locationShort: 'Monterrey, MX',
  coordinates: '25.6866° N, 100.3161° W',
  timezone: 'UTC-6',
  languages: 'Español nativo · Inglés B2',
  availability: 'Disponible para proyectos',
  availabilityShort: 'Disponible para proyectos',
  description:
    'Portafolio de Daniel Berdon, ingeniero de desarrollo web y TI en Monterrey. Plataformas web, automatización de procesos e inteligencia artificial aplicada al negocio.',
  blogDescription:
    'Notas técnicas sobre desarrollo web, automatización de procesos, infraestructura e IA aplicada. Lo que aprendo resolviendo problemas reales en producción.',
  social: {
    linkedin: {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/daniel-berdon',
      detail: 'in/daniel-berdon',
    },
  },
  cv: {
    label: 'Descargar CV',
    url: '/cv-daniel-berdon.pdf',
    detail: 'PDF · 5 KB',
    actualizado: 'Julio 2026',
  },
  /**
   * Arranque de la actividad laboral, en hora de Monterrey. Alimenta el
   * contador de uptime en vivo de la ficha `fetch`: se lee como fecha local
   * de esa zona, así la cifra sale igual desde cualquier país.
   */
  uptimeSince: '2016-01-11T09:00:00',
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
} as const;
