import { prisma } from '@/lib/db';
import { FileText, Building2, Briefcase, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [articleCount, officeCount, divisionCount, setting] = await Promise.all([
    prisma.article.count(),
    prisma.office.count(),
    prisma.businessDivision.count(),
    prisma.setting.findFirst(),
  ]);

  const stats = [
    { label: '文章数量', value: articleCount, icon: FileText },
    { label: '办公室', value: officeCount, icon: Building2 },
    { label: '业务板块', value: divisionCount, icon: Briefcase },
    { label: '首页指标', value: 4, icon: BarChart3 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">控制台</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">
        欢迎使用 {setting?.companyName ?? 'SKYW'} 管理后台。
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#070B14]/5">
                  <Icon className="h-5 w-5 text-[#070B14]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#1a1a2e]">{stat.value}</p>
                  <p className="text-[13px] text-[#6c757d]">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#1a1a2e]">快速操作</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/admin/articles/new"
            className="rounded-lg bg-[#070B14] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1A2A4A]"
          >
            + 发布新文章
          </a>
          <a
            href="/admin/articles"
            className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#6c757d] hover:bg-[#f8f9fa]"
          >
            管理文章
          </a>
          <a
            href="/admin/inbox"
            className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#6c757d] hover:bg-[#f8f9fa]"
          >
            查看收件箱
          </a>
          <a
            href="/admin/business"
            className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#6c757d] hover:bg-[#f8f9fa]"
          >
            编辑业务板块
          </a>
        </div>
      </div>
    </div>
  );
}
