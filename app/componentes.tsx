'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Nav({ links }: { links: [string, string][] }) {
  const path = usePathname();
  return (
    <nav className="pnav">
      {links.map(([href, t]) => (
        <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>{t}</Link>
      ))}
    </nav>
  );
}

// El menú puede cambiar en el día: se vuelve a pedir cada minuto y al volver a la pestaña.
export function Refrescar() {
  const router = useRouter();
  useEffect(() => {
    const r = () => document.visibilityState === 'visible' && router.refresh();
    const t = setInterval(r, 60_000);
    document.addEventListener('visibilitychange', r);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', r) };
  }, [router]);
  return null;
}

let avisar: (m: string) => void = () => {};
export const toast = (m: string) => avisar(m);
export function Toast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    avisar = (m) => { setMsg(m); clearTimeout(t); t = setTimeout(() => setMsg(''), 2600) };
  }, []);
  return msg ? <div className="toast" role="status">{msg}</div> : null;
}

export function Copiar({ texto }: { texto: string }) {
  return (
    <button className="mini" onClick={() => navigator.clipboard.writeText(texto).then(() => toast('Clave copiada'), () => toast('Mantené apretada la clave para copiarla'))}>
      Copiar
    </button>
  );
}

export const iniciales = (n: string) =>
  n.split(/\s+y\s+/).map((x) => x.trim()[0] || '').join('').toUpperCase().slice(0, 2) || '?';
