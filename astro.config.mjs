// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
// https://astro.build/config
export default defineConfig({
  site: 'https://firsthomeguide.ca',
  integrations: [
    starlight({
      title: 'FirstHomeGuide.ca',
      description: 'Your complete guide to buying your first home in Canada',
      components: {
        Head: './src/components/starlight/Head.astro',
      },
      logo: {
        light: './public/layout/logo-light.svg',
        dark: './public/layout/logo-dark.svg',
        alt: 'FirstHomeGuide.ca',
        replacesTitle: true,
      },
      favicon: '/favicon/favicon.svg',
      components: {
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
      components: {
        Head: './src/components/starlight/Head.astro',
      },
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-light', 'github-dark'],
      },
    }),
    mdx(),
    sitemap(),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
