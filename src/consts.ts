// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'FirstHomeGuide.ca — Your Free Step-by-Step Guide to Buying Your First Home in Canada';
export const SITE_DESCRIPTION =
  'The most comprehensive free resource for first-time home buyers in Canada. Learn about FHSA, RRSP Home Buyers\' Plan, mortgage basics, government programs by province, closing costs, and everything you need to buy your first home with confidence.';

export const SITE_METADATA = {
  title: {
    default: SITE_TITLE,
    template: '%s | FirstHomeGuide.ca',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'first time home buyer canada',
    'FHSA',
    'first home savings account',
    'RRSP home buyers plan',
    'mortgage calculator canada',
    'down payment canada',
    'closing costs canada',
    'home buying guide canada',
    'CMHC mortgage insurance',
    'government programs home buyers',
    'first time home buyer programs',
    'canadian real estate guide',
  ],
  authors: [{ name: 'FirstHomeGuide.ca Team' }],
  creator: 'FirstHomeGuide.ca',
  publisher: 'FirstHomeGuide.ca',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'FirstHomeGuide.ca',
    images: [
      {
        url: '/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'FirstHomeGuide.ca — Your Free Step-by-Step Guide to Buying Your First Home in Canada',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/og-image.webp'],
    creator: '@FirstHomeGuideCA',
  },
};
