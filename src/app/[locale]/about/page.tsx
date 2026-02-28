import { getOffices } from '@/lib/data';
import AboutClient from './AboutClient';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const offices = await getOffices();
  return <AboutClient offices={offices} />;
}
