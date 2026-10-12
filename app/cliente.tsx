'use client';
// Piezas que necesitan el navegador. Nada de acá se llama desde el servidor: solo se renderiza.
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export type Enlace = [href: string, texto: string, corto?: string];

export function Nav({ links, pill }: { links: Enlace[]; pill?: boolean }) {
  const path = usePathname();
  const activa = useRef<HTMLAnchorElement>(null);
  // Píldoras (celular): la sección elegida queda primera a la izquierda de la barra.
  useEffect(() => {
    const a = activa.current, barra = a?.parentElement;
    if (!pill || !a || !barra) return;
    const destino = a.offsetLeft - barra.offsetLeft - 14;
    // Las últimas no llegan a la izquierda: se agrega solo el espacio que les falta al final.
    barra.style.paddingRight = '';
    const falta = destino + barra.clientWidth - barra.scrollWidth;
    if (falta > 0) barra.style.paddingRight = `${14 + falta}px`;
    barra.scrollTo({ left: destino, behavior: 'smooth' });
  }, [pill, path]);
  return links.map(([href, t, corto]) => {
    const on = path === href;
    return (
      <Link key={href} href={href} ref={on ? activa : undefined} className={`${pill ? 'pill' : ''}${on ? ' on' : ''}`} aria-current={on ? 'page' : undefined}>
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
