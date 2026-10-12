import { Toast } from '../cliente';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}<Toast /></>;
}
