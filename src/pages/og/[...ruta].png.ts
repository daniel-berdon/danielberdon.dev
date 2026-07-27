/**
 * Tarjeta de previsualización por entrada del blog.
 *
 * Se genera en el build, una por entrada y idioma, así que publicar es escribir
 * el Markdown y nada más: no hay que abrir un editor de imágenes ni recordar
 * subir una captura. Sin esto, todas las entradas compartían la `og.png` del
 * sitio y cinco enlaces distintos se veían iguales al compartirlos.
 *
 * satori compone la tarjeta y convierte el texto a trazos —por eso el PNG no
 * depende de que la máquina que compila tenga las tipografías instaladas, algo
 * que en el servidor de Netlify no se cumple— y sharp la rasteriza.
 *
 * Las tipografías salen de las mismas woff2 que sirve el sitio, descomprimidas
 * a TTF e instanciadas a un peso fijo en src/assets/fonts: satori no lee woff2
 * y su analizador tampoco entiende la tabla `fvar` de una fuente variable. Si
 * algún día cambian las del sitio, se rehacen con:
 *
 *   npx --yes wawoff2 …            # woff2 → ttf
 *   python3 -m fontTools.varLib.instancer archivo.ttf wght=700
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { minutosLectura } from '../../lib/lectura';
import { tonoDe, PALETA, COLORES } from '../../lib/blog';
import { formatDate, type Lang } from '../../i18n/ui';

const ANCHO = 1200;
const ALTO = 630;

const raizFuentes = path.resolve('src/assets/fonts');
const [grotesk, mono] = await Promise.all([
  fs.readFile(path.join(raizFuentes, 'space-grotesk-700.ttf')),
  fs.readFile(path.join(raizFuentes, 'jetbrains-mono-400.ttf')),
]);

/** Nodo al gusto de satori. Se construye a mano en vez de con JSX: este
    archivo es un endpoint, no un componente, y no compila JSX. */
type Nodo = { type: string; props: Record<string, unknown> };
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
): Nodo => ({ type, props: { style, children } });

/** Escuadra de encuadre, el mismo gesto que las esquinas del retrato */
const esquina = (lados: Record<string, unknown>, color: string): Nodo =>
  el('div', {
    position: 'absolute',
    width: 54,
    height: 54,
    borderColor: color,
    borderStyle: 'solid',
    borderWidth: 0,
    ...lados,
  });

function tarjeta(datos: {
  titulo: string;
  eyebrow: string;
  pie: string;
  tono: string;
}): Nodo {
  const { titulo, eyebrow, pie, tono } = datos;
  return el(
    'div',
    {
      width: ANCHO,
      height: ALTO,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      padding: '0 96px',
      backgroundColor: COLORES.fondo,
      fontFamily: 'Space Grotesk',
    },
    [
      esquina({ top: 36, left: 36, borderTopWidth: 3, borderLeftWidth: 3 }, tono),
      esquina({ top: 36, right: 36, borderTopWidth: 3, borderRightWidth: 3 }, tono),
      esquina(
        { bottom: 36, left: 36, borderBottomWidth: 3, borderLeftWidth: 3 },
        tono,
      ),
      esquina(
        { bottom: 36, right: 36, borderBottomWidth: 3, borderRightWidth: 3 },
        tono,
      ),

      // Cintillo: sección y datos de la entrada
      el(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          color: COLORES.apagado,
        },
        [
          el('div', { width: 28, height: 3, backgroundColor: tono }),
          el('div', {}, eyebrow),
        ],
      ),

      // Titular: lo que cambia en cada entrada
      el(
        'div',
        {
          display: 'flex',
          marginTop: 28,
          fontSize: titulo.length > 46 ? 62 : 76,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: COLORES.tinta,
          maxWidth: 940,
        },
        titulo,
      ),

      // Tira de la paleta, con el tono de la entrada al frente
      el(
        'div',
        { display: 'flex', gap: 10, marginTop: 44 },
        PALETA.map((c) =>
          el('div', {
            width: c === tono ? 56 : 28,
            height: 10,
            borderRadius: 999,
            backgroundColor: c,
            opacity: c === tono ? 1 : 0.4,
          }),
        ),
      ),

      // Pie: dominio y metadatos
      el(
        'div',
        {
          display: 'flex',
          marginTop: 40,
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          color: COLORES.tintaSuave,
        },
        pie,
      ),
    ],
  );
}

/** Español en la raíz de la colección, inglés bajo en/ */
const idiomaDe = (id: string): Lang => (id.startsWith('en/') ? 'en' : 'es');
const slugDe = (id: string) => id.split('/').pop() as string;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.borrador);

  // El tono se asigna dentro de cada idioma, con el mismo orden que el índice
  return (['es', 'en'] as const).flatMap((lang) => {
    const delIdioma = posts
      .filter((p) => idiomaDe(p.id) === lang)
      .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());

    return delIdioma.map((post, i) => ({
      // /og/mi-entrada.png en español, /og/en/mi-entrada.png en inglés
      params: { ruta: lang === 'en' ? `en/${slugDe(post.id)}` : slugDe(post.id) },
      props: {
        titulo: post.data.titulo,
        fecha: post.data.fecha,
        minutos: minutosLectura(post.body ?? ''),
        tono: PALETA[tonoDe(i, delIdioma.length) - 1],
        lang,
      },
    }));
  });
};

export const GET: APIRoute = async ({ props }) => {
  const { titulo, fecha, minutos, tono, lang } = props as {
    titulo: string;
    fecha: Date;
    minutos: number;
    tono: string;
    lang: Lang;
  };

  const svg = await satori(tarjeta({
    titulo,
    tono,
    eyebrow: lang === 'en' ? 'TECHNICAL NOTES' : 'NOTAS TÉCNICAS',
    pie: `danielberdon.dev · ${formatDate(fecha, lang)} · ${minutos} ${
      lang === 'en' ? 'min read' : 'min de lectura'
    }`,
  }) as never, {
    width: ANCHO,
    height: ALTO,
    fonts: [
      { name: 'Space Grotesk', data: grotesk, weight: 700, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
