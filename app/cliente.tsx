'use client';
// Piezas que necesitan el navegador. Nada de acá se llama desde el servidor: solo se renderiza.
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type Enlace = [href: string, texto: string, corto?: string];

export function Nav({ links, pill }: { links: Enlace[]; pill?: boolean }) {
  const path = usePathname();
  return links.map(([href, t, corto]) => {
    const on = path === href;
    return (
      <Link key={href} href={href} className={`${pill ? 'pill' : ''}${on ? ' on' : ''}`} aria-current={on ? 'page' : undefined}>
        {pill && corto ? corto : t}
      </Link>
    );
  });
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
    <button className="mini" type="button"
      onClick={() => navigator.clipboard.writeText(texto).then(() => toast('Clave copiada'), () => toast('Mantené apretada la clave para copiarla'))}>
      Copiar
    </button>
  );
}
