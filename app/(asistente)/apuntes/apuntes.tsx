'use client';
import { useEffect, useState } from 'react';
import { DIAS } from '@/lib/convencion';
import { toast } from '../../componentes';

// Los apuntes viven SOLO en este celular (localStorage). Nunca se mandan al servidor.
const KEY = 'cc-apuntes';
type Notas = Record<string, string>;

export function Apuntes() {
  const [notas, setNotas] = useState<Notas>({});
  const [dia, setDia] = useState<string>(DIAS[0].id);
  const [guardado, setGuardado] = useState('Se guarda solo mientras escribís.');

  useEffect(() => {
    try { setNotas(JSON.parse(localStorage.getItem(KEY) || '{}')) } catch {}
    const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Mendoza' }).format(new Date());
    const d = DIAS.find((x) => x.fecha === f);
    if (d) setDia(d.id);
  }, []);

  function escribir(texto: string) {
    const n = { ...notas, [dia]: texto };
    setNotas(n);
    try { localStorage.setItem(KEY, JSON.stringify(n)); setGuardado(`Guardado en este celular ${new Date().toTimeString().slice(0, 5)} h.`) }
    catch { setGuardado('No se pudo guardar en este navegador.') }
  }

  async function compartir() {
    const texto = DIAS.filter((d) => notas[d.id]?.trim()).map((d) => `${d.nombre} ${d.texto}\n${notas[d.id].trim()}`).join('\n\n');
    if (!texto) return toast('Todavía no escribiste apuntes');
    const todo = `Mis apuntes · Convención Regional Cuyo 2026\n\n${texto}`;
    if (navigator.share) return navigator.share({ text: todo }).catch(() => {});
    navigator.clipboard.writeText(todo).then(() => toast('Apuntes copiados'), () => toast('No se pudieron copiar'));
  }

  const nombre = DIAS.find((d) => d.id === dia)!.nombre.toLowerCase();
  return (
    <div className="stack">
      <div className="candado">
        Tus apuntes se guardan <b>solo en este celular</b>. Nadie más los ve, ni los organizadores. Si borrás los datos del navegador o cambiás de celular, se pierden: usá “Compartir” para mandártelos por WhatsApp o mail.
      </div>
      <div className="chips">
        {DIAS.map((d) => <button key={d.id} aria-pressed={dia === d.id} onClick={() => setDia(d.id)}>{d.nombre}</button>)}
      </div>
      <label className="lbl" htmlFor="apunte">Apuntes del {nombre}</label>
      <textarea className="apunte" id="apunte" placeholder="Versículos, ideas de la prédica, lo que Dios te habló..."
        value={notas[dia] || ''} onChange={(e) => escribir(e.target.value)} />
      <div className="acts">
        <p className="note">{guardado}</p>
        <button className="btn" onClick={compartir}>Compartir mis apuntes</button>
      </div>
    </div>
  );
}
