import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site, siteText } from '../../data/site';

/** Feed del blog en inglés. Los borradores no salen publicados. */
export async function GET(context) {
  const posts = (
    await getCollection('blog', ({ id, data }) => !data.borrador && id.startsWith('en/'))
  ).sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());

  return rss({
    title: `${site.name} — Blog`,
    description: siteText.en.blogDescription,
    site: context.site ?? site.url,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.titulo,
      description: post.data.resumen,
      pubDate: post.data.fecha,
      categories: [...post.data.tags],
      link: `/en/blog/${post.id.split('/').pop()}`,
    })),
    customData: '<language>en-us</language>',
  });
}
