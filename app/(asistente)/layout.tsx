import { Toast } from '../componentes';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="app">{children}<Toast /></div>;
}
