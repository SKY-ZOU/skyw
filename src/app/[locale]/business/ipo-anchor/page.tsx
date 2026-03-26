import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getDivisionBySlug } from '@/lib/data'
import BusinessDetailDB from '@/components/business/BusinessDetailDB'

function loc(obj: any, field: string, locale: string) {
  if (locale === 'zh-TW') return obj[field + 'ZhTW'] || obj[field + 'ZhCN'] || ''
  if (locale === 'en') return obj[field + 'En'] || ''
  return obj[field + 'ZhCN'] || ''
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const div = await getDivisionBySlug('ipo-anchor')
  if (!div) return {}

  const title = loc(div, 'title', locale)
  const description = loc(div, 'shortDesc', locale)
  const ogImage = div.coverImage || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage, width: 1920, height: 1080 }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function IpoPage() {
  const locale = await getLocale()
  const div = await getDivisionBySlug('ipo-anchor')
  if (!div) notFound()

  return (
    <BusinessDetailDB
      slug={div.slug}
      title={loc(div, 'title', locale)}
      shortDesc={loc(div, 'shortDesc', locale)}
      body={locale === 'en' ? div.bodyEn : locale === 'zh-TW' ? div.bodyZhTW : div.bodyZhCN}
      coverImage={div.coverImage || ''}
    />
  )
}
