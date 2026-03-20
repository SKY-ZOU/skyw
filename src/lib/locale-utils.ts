// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loc(item: any, field: string, locale: string): string {
  if (locale === 'zh-TW') return item[`${field}ZhTW`];
  if (locale === 'en') return item[`${field}En`];
  return item[`${field}ZhCN`];
}
