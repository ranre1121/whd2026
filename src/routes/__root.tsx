import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { useTranslation } from 'react-i18next';

import i18n from '@/i18n';
import appCss from '@/styles.css?url';

/** The locale is read from a cookie so the server renders the right language. */
const getServerLocale = createServerFn({ method: 'GET' }).handler(async () => {
  return getCookie('locale') || 'en';
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async () => {
    const locale = await getServerLocale();
    if (i18n.language !== locale) {
      await i18n.changeLanguage(locale);
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' },
      { title: 'Women’s Hack Day' },
      {
        name: 'description',
        content:
          'Official website of Women’s Hack Day — an annual 3-round team competition in mathematics, competitive programming and product design, organized by the NU ACM-W Student Chapter.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Women’s Hack Day' },
      { property: 'og:title', content: 'Women’s Hack Day' },
      {
        property: 'og:description',
        content: 'Join Women’s Hack Day — an empowering event for women in tech.',
      },
      { property: 'og:url', content: 'https://whd.nuacmw.kz' },
      { property: 'og:image', content: '/WHDlogo.svg' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/WHDlogo.svg' },
      { rel: 'canonical', href: 'https://whd.nuacmw.kz' },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  return (
    <html lang={i18n.language || 'en'}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
