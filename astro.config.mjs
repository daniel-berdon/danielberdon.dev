// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://danielberdon.dev',
  // Español por defecto en la raíz; la versión en inglés vive bajo /en.
  // El sitemap genera solo las alternativas hreflang entre idiomas.
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  // astro-icon inserta los SVG en el HTML en build: cero JS en el cliente
  integrations: [
    // El sitemap lleva su propia config i18n: es la que emite las
    // alternativas hreflang entre /… y /en/…
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-MX', en: 'en-US' },
      },
    }),
    icon(),
  ],
  build: {
    // HTML/CSS/JS inline pequeño reduce peticiones; los estilos globales van en archivo.
    inlineStylesheets: 'auto',
  },
});
