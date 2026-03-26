'use client';

import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ImageUrlGuideProps {
  /** 图片用途，影响推荐尺寸 */
  type: 'article-cover' | 'business-hero' | 'office' | 'general';
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  inputClass?: string;
}

const specs: Record<ImageUrlGuideProps['type'], {
  title: string;
  size: string;
  ratio: string;
  formats: string;
  maxSize: string;
  tip: string;
  example: string;
  exampleDesc: string;
}> = {
  'article-cover': {
    title: '文章封面图',
    size: '1200 × 630 px（推荐）',
    ratio: '16:9 或 1.91:1',
    formats: 'JPG / PNG / WebP',
    maxSize: '建议 ≤ 500 KB',
    tip: '图片会显示在新闻列表卡片和文章详情页顶部。请使用高清、清晰的横向图片，避免文字过多。',
    example: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    exampleDesc: '金融/商业类配图示例（Unsplash）',
  },
  'business-hero': {
    title: '业务板块详情页背景图',
    size: '1920 × 1080 px（推荐最低 1440 × 810）',
    ratio: '16:9 宽屏（严格要求）',
    formats: 'JPG / PNG / WebP',
    maxSize: '建议 ≤ 1 MB，加载速度优先',
    tip: '图片将铺满业务详情页顶部 Hero 区域全宽，并叠加深色渐变遮罩（底部 70% 透明度）。选图建议：① 选择偏向暗色调、有景深感的图片；② 主要视觉元素应在画面左侧或下方，文字叠加在右上区域；③ 避免人脸特写和大面积纯白背景；④ 金融/城市/科技类题材最佳。此图同时作为该业务页面在 LinkedIn、微信等社媒分享时的 OG 预览图。',
    example: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80',
    exampleDesc: '城市金融地标（推荐风格）',
  },
  'office': {
    title: '办公室图片',
    size: '800 × 600 px（推荐）',
    ratio: '4:3',
    formats: 'JPG / PNG / WebP',
    maxSize: '建议 ≤ 300 KB',
    tip: '用于展示办公室环境，建议使用实景照片。',
    example: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    exampleDesc: '办公室环境示例（Unsplash）',
  },
  'general': {
    title: '图片',
    size: '1200 × 800 px（推荐）',
    ratio: '3:2',
    formats: 'JPG / PNG / WebP',
    maxSize: '建议 ≤ 500 KB',
    tip: '请使用高质量图片，确保 URL 可公开访问。',
    example: '',
    exampleDesc: '',
  },
};

export default function ImageUrlGuide({ type, value, onChange, placeholder, inputClass }: ImageUrlGuideProps) {
  const [open, setOpen] = useState(false);
  const spec = specs[type];

  const defaultInputClass =
    'w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-[14px] outline-none focus:border-[#070B14] focus:ring-1 focus:ring-[#070B14]';
  const cls = inputClass ?? defaultInputClass;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          className={cls}
          placeholder={placeholder ?? 'https://example.com/image.jpg'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 flex items-center gap-1 rounded-lg border border-[#e5e7eb] px-2.5 py-2 text-[12px] text-[#6c757d] hover:bg-[#f8f9fa] transition-colors"
          title="查看图片规格要求"
        >
          <Info className="h-3.5 w-3.5" />
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {open && (
        <div className="rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] p-4 text-[13px]">
          <p className="font-semibold text-[#1a1a2e]">{spec.title} · 规格要求</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <span className="text-[#6c757d]">推荐尺寸：</span>
              <span className="font-medium text-[#1a1a2e]">{spec.size}</span>
            </div>
            <div>
              <span className="text-[#6c757d]">宽高比：</span>
              <span className="font-medium text-[#1a1a2e]">{spec.ratio}</span>
            </div>
            <div>
              <span className="text-[#6c757d]">支持格式：</span>
              <span className="font-medium text-[#1a1a2e]">{spec.formats}</span>
            </div>
            <div>
              <span className="text-[#6c757d]">文件大小：</span>
              <span className="font-medium text-[#1a1a2e]">{spec.maxSize}</span>
            </div>
          </div>
          <p className="mt-3 text-[#6c757d] leading-relaxed">{spec.tip}</p>

          {spec.example && (
            <div className="mt-3 border-t border-[#e5e7eb] pt-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[#6c757d]">示例：{spec.exampleDesc}</p>
                <button
                  type="button"
                  onClick={() => onChange(spec.example)}
                  className="shrink-0 rounded-md bg-[#070B14] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#1A2A4A]"
                >
                  使用此示例
                </button>
              </div>
              <img
                src={spec.example}
                alt="示例图片"
                className="mt-2 h-24 w-full rounded-lg object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}

          <p className="mt-3 text-[11px] text-[#adb5bd]">
            💡 推荐使用 <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline">Unsplash</a>、
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline">Pexels</a>
            等免费高清图库，或将图片上传至 CDN 后填入链接。
          </p>
        </div>
      )}

      {value && (
        <img
          src={value}
          alt="图片预览"
          className="h-32 w-full rounded-lg object-cover border border-[#e5e7eb]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}
