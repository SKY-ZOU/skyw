'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Building2,
  Briefcase,
  Settings,
  ExternalLink,
  Inbox,
  SearchCheck,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: '控制台', icon: LayoutDashboard },
  { href: '/admin/articles', label: '文章管理', icon: FileText },
  { href: '/admin/inbox', label: '收件箱', icon: Inbox },
  { href: '/admin/offices', label: '办公室', icon: Building2 },
  { href: '/admin/business', label: '业务板块', icon: Briefcase },
  { href: '/admin/seo', label: 'SEO / GEO 优化', icon: SearchCheck },
  { href: '/admin/settings', label: '网站设置', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col bg-[#070B14]">
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold tracking-[0.15em] text-white">
          SKYW
        </span>
        <span className="ml-2 rounded bg-gold-400/20 px-1.5 py-0.5 text-micro font-semibold uppercase tracking-wider text-gold-400">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <ExternalLink className="h-4 w-4" />
          查看前台网站
        </Link>
      </div>
    </aside>
  );
}
