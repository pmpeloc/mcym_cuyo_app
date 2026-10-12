'use client';
import { useState } from 'react';
import { MAX_MENSAJE } from '@/lib/convencion';
import type { Pastor } from '@/lib/db';
import { iniciales, toast } from '../../componentes';
import { agregarPastor, editar, eliminarPastor, moverPastor, quitarFoto, subirFoto } from '../acciones';
import { Campo, correr } from '../campo';

// Recorta al centro y achica a 600×600 JPEG antes de subir (~80 KB, carga rápido con mala señal).
function recortar(file: File): Promise<Blob> {
  return new Promise((ok, mal) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height), c = document.createElement('canvas');
      c.width = c.height = 600;
      c.getContext('2d')!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 600, 600);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? ok(b) : mal()), 'image/jpeg', 0.8);
    };
    img.onerror = () => { URL.revokeObjectURL(url); mal() };
    img.src = url;
  });
}

function estado(p: Pastor): [string, string] {
  if (!p.nombres.trim()) return ['falta', 'Faltan nombres'];
  if (!p.mensaje.trim()) return ['falta', 'Falta mensaje'];
  return p.foto_url ? ['abierta', 'Publicado'] : ['falta', 'Falta foto'];
}

export function EditorBienvenidas({ pastores }: { pastores: Pastor[] }) {
  const [borrar, setBorrar] = useState('');
  const [largo, setLargo] = useState<Record<string, number>>({});

  async function foto(p: Pastor, file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 15e6) return toast('Usá una foto JPG o PNG de menos de 15 MB');
    try {
      const f = new FormData();
      f.append('foto', new File([await recortar(file)], 'foto.jpg', { type: 'image/jpeg' }));
      await correr(() => subirFoto(p.id, f), 'Foto cargada');
    } catch { toast('No se pudo leer esa foto. Probá con otra.') }
  }

  return (
    <>
      {pastores.map((p, i) => {
        const [cls, txt] = estado(p);
        return (
          <div className="card b-card" key={p.id}>
            <div className="b-fotobox">
              <div className="foto big">{p.foto_url ? <img src={p.foto_url} alt={`Foto de ${p.nombres}`} /> : iniciales(p.nombres)}</div>
              <label className="mini">
                {p.foto_url ? 'Cambiar foto' : 'Elegir foto'}
                <input type="file" accept="image/*" hidden onChange={(e) => { foto(p, e.target.files?.[0]); e.target.value = '' }} />
              </label>
              {p.foto_url && <button className="mini" onClick={() => correr(() => quitarFoto(p.id), 'Foto quitada')}>Quitar foto</button>}
            </div>
            <div className="b-campos">
              <div className="grid2">
                <div className="field"><label htmlFor={`n-${p.id}`}>Nombres del matrimonio</label>
                  <Campo id={`n-${p.id}`} placeholder="Ej.: Hugo y Silvia Ortiz" valor={p.nombres} guardar={(v) => editar('pastores', p.id, 'nombres', v)} /></div>
                <div className="field"><label htmlFor={`i-${p.id}`}>Iglesia</label>
                  <Campo id={`i-${p.id}`} placeholder="Ej.: Iglesia de Las Heras" valor={p.iglesia} guardar={(v) => editar('pastores', p.id, 'iglesia', v)} /></div>
              </div>
              <div className="field"><label htmlFor={`m-${p.id}`}>Mensaje de bienvenida</label>
                <Campo id={`m-${p.id}`} multilinea rows={4} maxLength={MAX_MENSAJE} valor={p.mensaje}
                  onChange={(e) => setLargo((l) => ({ ...l, [p.id]: e.target.value.length }))}
                  guardar={(v) => editar('pastores', p.id, 'mensaje', v)} />
                <small className="note" style={{ justifySelf: 'end' }}>{largo[p.id] ?? p.mensaje.length} / {MAX_MENSAJE}</small></div>
              <div className="acts">
                <span className={`estado ${cls}`}>{txt}</span>
                <div className="chips">
                  <button aria-label="Subir" disabled={i === 0} onClick={() => correr(() => moverPastor(p.id, -1), 'Orden guardado')}>↑</button>
                  <button aria-label="Bajar" disabled={i === pastores.length - 1} onClick={() => correr(() => moverPastor(p.id, 1), 'Orden guardado')}>↓</button>
                  <button className="peligro" onClick={() => borrar === p.id ? correr(() => eliminarPastor(p.id), 'Matrimonio eliminado') : setBorrar(p.id)}>
                    {borrar === p.id ? '¿Seguro? Tocá de nuevo' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <button className="btn" style={{ justifySelf: 'start' }} onClick={() => correr(agregarPastor, 'Agregado al final de la lista')}>+ Agregar matrimonio</button>
      <p className="note">Sin foto se publica con las iniciales. Sin nombres o sin mensaje no se muestra al asistente.</p>
    </>
  );
}
