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
    { label: 'Articles', value: articleCount, icon: FileText },
    { label: 'Offices', value: officeCount, icon: Building2 },
    { label: 'Divisions', value: divisionCount, icon: Briefcase },
    { label: 'Metrics', value: 4, icon: BarChart3 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e]">Dashboard</h1>
      <p className="mt-1 text-[14px] text-[#6c757d]">
        Welcome to {setting?.companyName ?? 'SKYW'} admin panel.
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
    </div>
  );
}
