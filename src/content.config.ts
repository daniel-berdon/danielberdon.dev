import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Colecciones de contenido — edita solo los archivos de src/content/,
 * el marcado nunca se toca.
 *
 * Idiomas: el español vive en la raíz de cada colección y el inglés en la
 * subcarpeta en/ con el MISMO nombre de archivo (el slug se comparte entre
 * idiomas, así el selector de idioma solo cambia el prefijo /en). Las páginas
 * filtran por prefijo de id. En trayectoria, el puesto en curso se marca con
 * fin: 'Actualidad' (es) o 'Present' (en).
 */

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    titulo: z.string(),
    /** El problema en una línea: es el gancho de la lista editorial */
    problema: z.string(),
    rol: z.string(),
    stack: z.array(z.string()).min(2),
    /** Resultado medible: cifra o cambio concreto */
    resultado: z.string(),
    anio: z.string(),
    cliente: z.string().optional(),
    enlace: z.url().optional(),
    orden: z.number(),
    destacado: z.boolean().default(true),
  }),
});

const trayectoria = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trayectoria' }),
  schema: z.object({
    puesto: z.string(),
    empresa: z.string(),
    /** Texto libre: "2023", "2021 — 2023", "Actualidad"… */
    inicio: z.string(),
    fin: z.string(),
    logros: z.array(z.string()).min(1),
    orden: z.number(),
    /** La formación no es un puesto: se lista aparte, bajo la línea de tiempo */
    tipo: z.enum(['puesto', 'formacion']).default('puesto'),
  }),
});

const capacidades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/capacidades' }),
  schema: z.object({
    area: z.string(),
    /** Una línea que explica qué resuelve el área */
    resumen: z.string(),
    /** Tecnologías concretas: se pintan como etiquetas */
    stack: z.array(z.string()).min(3),
    orden: z.number(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    /** Entradilla: se usa en el índice, en la meta description y en el RSS */
    resumen: z.string(),
    fecha: z.coerce.date(),
    /** Actualización opcional; si existe, se muestra junto a la fecha */
    actualizado: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Un borrador se escribe en local pero no se publica */
    borrador: z.boolean().default(false),
  }),
});

export const collections = { proyectos, trayectoria, capacidades, blog };
