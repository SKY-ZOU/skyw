'use client';

import { useState, type ReactNode } from 'react';

type Lang = 'zhCN' | 'zhTW' | 'en';

const tabs: { key: Lang; label: string }[] = [
  { key: 'zhCN', label: '简体中文' },
  { key: 'zhTW', label: '繁體中文' },
  { key: 'en', label: 'English' },
];

interface TrilingualTabsProps {
  children: (lang: Lang) => ReactNode;
}

export default function TrilingualTabs({ children }: TrilingualTabsProps) {
  const [active, setActive] = useState<Lang>('zhCN');

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-lg bg-[#f0f0f0] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`flex-1 rounded-md px-3 py-1.5 text-body-sm font-medium transition-colors ${
              active === tab.key
                ? 'bg-white text-[#1a1a2e] shadow-sm'
                : 'text-[#6c757d] hover:text-[#1a1a2e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}

export type { Lang };
