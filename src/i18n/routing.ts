import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh-CN', 'zh-TW', 'en'],
  defaultLocale: 'en',
  // Disable browser-language auto-detection so the site always opens in English.
  // Users can still manually switch via the language selector.
  localeDetection: false,
});
