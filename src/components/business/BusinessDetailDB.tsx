'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import RelatedBusinesses from './RelatedBusinesses';

/* ─── Types ─────────────────────────────────────────────── */
type Section =
  | { type: 'highlight'; title: string; content: string }
  | { type: 'text'; title: string; content: string }
  | { type: 'bullets'; title: string; items: string[] }
  | { type: 'features'; title?: string; items: { title: string; desc: string }[] };

interface DivisionBody {
  subtitle: string;
  intro: string[];
  sections: Section[];
}

interface Props {
  slug: string;
  title: string;
  shortDesc: string;
  body: string; // JSON string
  coverImage?: string; // 来自数据库，优先使用
}

/* ─── Background image fallback map ────────────────────── */
const bgMap: Record<string, string> = {
  gold:             '/images/business/gold-bg.png',
  'ipo-anchor':     '/images/business/ipo-bg.png',
  'china-innovation':'/images/business/china-innovation-bg.png',
  'digital-trade':  '/images/business/digital-trade-bg.png',
  energy:           '/images/business/energy-bg.png',
  'web3-finance':   '/images/business/web3-bg.png',
};

/* ─── Section renderers ─────────────────────────────────── */
function HighlightSection({ section }: { section: Extract<Section, { type: 'highlight' }> }) {
  return (
    <div className="border-l-2 border-[#D4AF37] bg-[#070B14]/[0.03] px-8 py-7">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">
        {section.title}
      </p>
      <p className="text-[15px] leading-relaxed text-[#344054]">{section.content}</p>
    </div>
  );
}

function TextSection({ section }: { section: Extract<Section, { type: 'text' }> }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c757d]">
        {section.title}
      </p>
      <p className="text-[15px] leading-relaxed text-[#344054]">{section.content}</p>
    </div>
  );
}

function BulletsSection({ section }: { section: Extract<Section, { type: 'bullets' }> }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c757d]">
        {section.title}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {section.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
            <span className="text-[15px] leading-relaxed text-[#344054]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturesSection({ section }: { section: Extract<Section, { type: 'features' }> }) {
  return (
    <div>
      {section.title && (
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#6c757d]">
          {section.title}
        </p>
      )}
      <div className="grid gap-px bg-[#e5e7eb] sm:grid-cols-3">
        {section.items.map((item, i) => (
          <div key={i} className="bg-white p-6">
            <div className="mb-3 h-[2px] w-6 bg-[#D4AF37]" />
            <p className="mb-2 text-sm font-semibold text-[#1a1a2e]">{item.title}</p>
            <p className="text-[13px] leading-relaxed text-[#6c757d]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export default function BusinessDetailDB({ slug, title, shortDesc, body, coverImage }: Props) {
  let parsed: DivisionBody | null = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    // fallback to shortDesc only
  }

  // 优先使用后台设置的图片，其次使用本地静态图
  const bg = coverImage || bgMap[slug];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[56vh] items-end overflow-hidden bg-[#070B14]">
        {bg && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${bg})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 lg:px-8">
          {/* Back link */}
          <Link
            href="/business"
            className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            核心业务
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-white lg:text-5xl"
          >
            {title}
          </motion.h1>

          {parsed?.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-4 text-base font-light text-[#D4AF37] lg:text-lg"
            >
              {parsed.subtitle}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── Body ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-8 lg:py-28">

          {/* Intro */}
          {(parsed?.intro ?? [shortDesc]).map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`max-w-3xl text-lg font-light leading-relaxed text-[#344054] ${i > 0 ? 'mt-5' : ''}`}
            >
              {p}
            </motion.p>
          ))}

          {/* Divider */}
          <div className="my-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e5e7eb]" />
            <div className="h-1.5 w-8 bg-[#D4AF37]" />
            <div className="h-px flex-1 bg-[#e5e7eb]" />
          </div>

          {/* Sections */}
          {parsed?.sections && (
            <div className="space-y-12">
              {parsed.sections.map((sec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {sec.type === 'highlight' && <HighlightSection section={sec} />}
                  {sec.type === 'text'      && <TextSection      section={sec} />}
                  {sec.type === 'bullets'   && <BulletsSection   section={sec} />}
                  {sec.type === 'features'  && <FeaturesSection  section={sec} />}
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20 flex flex-col items-start gap-4 border-t border-[#e5e7eb] pt-12 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-[#6c757d]">
              了解更多或洽谈合作机会
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#D4AF37] px-6 py-3 text-sm font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#b8972e]"
            >
              联系我们
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <RelatedBusinesses currentSlug={slug} />
    </>
  );
}
