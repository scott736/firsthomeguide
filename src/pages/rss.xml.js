import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts';

export async function GET(context) {
  const docs = await getCollection('docs');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: docs.map((doc) => ({
      title: doc.data.title,
      description: doc.data.description || '',
      link: `/${doc.id}/`,
      pubDate: new Date('2025-01-15'),
    })),
  });
}
