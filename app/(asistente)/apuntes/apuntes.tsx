'use client';
import { useEffect, useState } from 'react';
import { DIAS } from '@/lib/convencion';
import { toast } from '../../cliente';

// Los apuntes viven SOLO en este dispositivo (localStorage). Nunca se mandan al servidor.
const KEY = 'cc-apuntes';
type Notas = Record<string, string>;

export function Apuntes({ dia, nombre }: { dia: string; nombre: string }) {
  const [notas, setNotas] = useState<Notas>({});
  const [guardado, setGuardado] = useState('Se guarda solo mientras escribís.');

  useEffect(() => { try { setNotas(JSON.parse(localStorage.getItem(KEY) || '{}')) } catch {} }, []);

  function escribir(texto: string) {
    const n = { ...notas, [dia]: texto };
    setNotas(n);
    try { localStorage.setItem(KEY, JSON.stringify(n)); setGuardado(`Guardado en este dispositivo ${new Date().toTimeString().slice(0, 5)} h.`) }
    catch { setGuardado('No se pudo guardar en este navegador.') }
  }

  // Para no perderlos al cambiar de celular: se mandan por WhatsApp o mail, sin pasar por el servidor.
  async function compartir() {
    const texto = DIAS.filter((d) => notas[d.id]?.trim()).map((d) => `${d.nombre} ${d.texto}\n${notas[d.id].trim()}`).join('\n\n');
    if (!texto) return toast('Todavía no escribiste apuntes');
    const todo = `Mis apuntes · Convención Regional Cuyo 2026\n\n${texto}`;
    if (navigator.share) return navigator.share({ text: todo }).catch(() => {});
    navigator.clipboard.writeText(todo).then(() => toast('Apuntes copiados'), () => toast('No se pudieron copiar'));
  }

  return (
    <>
      <label className="lbl movil" htmlFor="apunte">Apuntes del {nombre}</label>
      <textarea className="apunte" id="apunte" aria-label={`Apuntes del ${nombre}`} placeholder="Versículos, ideas de la prédica, lo que Dios te habló..."
        value={notas[dia] || ''} onChange={(e) => escribir(e.target.value)} />
      <div className="wrapgap" style={{ justifyContent: 'space-between', maxWidth: 820 }}>
        <p className="note">{guardado}</p>
        <button className="btn sec" type="button" onClick={compartir}>Compartir mis apuntes</button>
      </div>
    </>
  );
}
