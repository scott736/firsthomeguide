// @ts-check
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import { defineConfig } from 'astro/config';
// https://astro.build/config
export default defineConfig({
  site: 'https://firsthomeguide.ca',
  adapter: vercel(),
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['nofollow', 'noopener', 'noreferrer'],
      }],
    ],
  },
  integrations: [
    starlight({
      title: 'FirstHomeGuide.ca',
      description: 'Your complete guide to buying your first home in Canada',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: '/favicon/site.webmanifest',
          },
        },
        {
          tag: 'script',
          content: "if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}",
        },
      ],
      logo: {
        light: './public/layout/logo-light.svg',
        dark: './public/layout/logo-dark.svg',
        alt: 'FirstHomeGuide.ca',
        replacesTitle: true,
      },
      favicon: '/favicon/favicon.svg',
      components: {
        Head: './src/components/starlight/Head.astro',
        Footer: './src/components/starlight/Footer.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        Sidebar: './src/components/starlight/Sidebar.astro',
      },
      sidebar: [
        {
          label: 'Welcome',
          slug: 'guide/welcome',
        },
        {
          label: 'Module 1: Are You Ready?',
          autogenerate: { directory: 'guide/1-are-you-ready' },
        },
        {
          label: 'Module 2: Saving Smart',
          autogenerate: { directory: 'guide/2-saving-smart' },
        },
        {
          label: 'Module 3: Down Payments & Mortgages',
          autogenerate: { directory: 'guide/3-down-payments-mortgages' },
        },
        {
          label: 'Module 4: Government Programs',
          autogenerate: { directory: 'guide/4-government-programs' },
        },
        {
          label: 'Module 5: Finding a Home',
          autogenerate: { directory: 'guide/5-finding-a-home' },
        },
        {
          label: 'Module 6: Making an Offer',
          autogenerate: { directory: 'guide/6-making-an-offer' },
        },
        {
          label: 'Module 7: Closing the Deal',
          autogenerate: { directory: 'guide/7-closing-the-deal' },
        },
        {
          label: 'Module 8: Life After Closing',
          autogenerate: { directory: 'guide/8-life-after-closing' },
        },
        {
          label: 'FAQ',
          slug: 'guide/faq',
        },
        {
          label: 'Glossary',
          slug: 'guide/glossary',
        },
      ],
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-light', 'github-dark'],
      },
    }),
    mdx(),
    sitemap({
      customPages: [
        'https://firsthomeguide.ca/book-a-call/',
        'https://firsthomeguide.ca/tools/cost-of-waiting/',
        'https://firsthomeguide.ca/tools/readiness-assessment/',
      ],
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/offline') &&
        !page.includes('/api/') &&
        !page.includes('/print-guide') &&
        !page.includes('/my-guide'),
      serialize: (item) => {
        const url = item.url;

        // Homepage — highest priority
        if (url === 'https://firsthomeguide.ca/' || url === 'https://firsthomeguide.ca') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }

        // Guide welcome & module landing pages
        if (url.includes('/guide/welcome')) {
          return { ...item, changefreq: 'weekly', priority: 0.9 };
        }

        // Guide content pages
        if (url.includes('/guide/')) {
          return { ...item, changefreq: 'weekly', priority: 0.8 };
        }

        // Tools
        if (url.includes('/tools/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }

        // About, book-a-call
        if (url.includes('/about') || url.includes('/book-a-call')) {
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        }

        // Everything else
        return { ...item, changefreq: 'monthly', priority: 0.5 };
      },
    }),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
