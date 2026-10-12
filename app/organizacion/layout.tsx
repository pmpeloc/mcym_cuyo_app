import type { Metadata } from 'next';
import { Toast } from '../cliente';

export const metadata: Metadata = { title: 'Organización', robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}<Toast /></>;
}
