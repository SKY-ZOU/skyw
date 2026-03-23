import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getDivisionBySlug } from '@/lib/data'
import BusinessDetailDB from '@/components/business/BusinessDetailDB'

function loc(obj: any, field: string, locale: string) {
  if (locale === 'zh-TW') return obj[field + 'ZhTW'] || obj[field + 'ZhCN'] || ''
  if (locale === 'en') return obj[field + 'En'] || ''
  return obj[field + 'ZhCN'] || ''
}

export default async function GoldPage() {
  const locale = await getLocale()
  const div = await getDivisionBySlug('gold')
  if (!div) notFound()

  return (
    <BusinessDetailDB
      slug={div.slug}
      title={loc(div, 'title', locale)}
      shortDesc={loc(div, 'shortDesc', locale)}
      body={locale === 'en' ? div.bodyEn : locale === 'zh-TW' ? div.bodyZhTW : div.bodyZhCN}
    />
  )
}
