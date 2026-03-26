import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const setting = await prisma.setting.findFirst();
  return NextResponse.json(setting);
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const data = await request.json();
  const setting = await prisma.setting.findFirst();
  if (!setting) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.setting.update({
    where: { id: setting.id },
    data: {
      geoAllowBots:   data.geoAllowBots   ?? setting.geoAllowBots,
      geoOrgDesc:     data.geoOrgDesc     ?? setting.geoOrgDesc,
      geoOrgFounded:  data.geoOrgFounded  ?? setting.geoOrgFounded,
      geoOrgIndustry: data.geoOrgIndustry ?? setting.geoOrgIndustry,
      faqJson:        data.faqJson        ?? setting.faqJson,
      llmsCustom:     data.llmsCustom     ?? setting.llmsCustom,
    },
  });

  return NextResponse.json(updated);
}
