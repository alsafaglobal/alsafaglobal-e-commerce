'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/app/home/components/Footer';

export default function GlobalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <Footer />;
}
