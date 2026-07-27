// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://danielberdon.dev',
  // astro-icon inserta los SVG en el HTML en build: cero JS en el cliente
  integrations: [sitemap(), icon()],
  build: {
    // HTML/CSS/JS inline pequeño reduce peticiones; los estilos globales van en archivo.
    inlineStylesheets: 'auto',
  },
});
