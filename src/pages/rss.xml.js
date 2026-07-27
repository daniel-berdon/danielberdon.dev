import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

/** Feed del blog. Los borradores no salen publicados. */
export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.borrador)).sort(
    (a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf(),
  );

  return rss({
    title: `${site.name} — Blog`,
    description: site.blogDescription,
    site: context.site ?? site.url,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.titulo,
      description: post.data.resumen,
      pubDate: post.data.fecha,
      categories: [...post.data.tags],
      link: `/blog/${post.id}`,
    })),
    customData: '<language>es-mx</language>',
  });
}
