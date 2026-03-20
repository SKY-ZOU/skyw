import { getOffices } from '@/lib/data';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const offices = await getOffices();
  return <ContactClient offices={offices} />;
}
