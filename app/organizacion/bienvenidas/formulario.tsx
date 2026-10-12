'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MAX_MENSAJE } from '@/lib/convencion';
import type { Pastor } from '@/lib/db';
import { toast } from '../../cliente';
import { Camara, TarjetaPastor } from '../../pantalla';
import { eliminarPastor, guardarPastor, quitarFoto, subirFoto } from '../acciones';

const LISTA = '/organizacion/bienvenidas';

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

// Foto: undefined = sin cambios; null = quitarla; Blob = nueva (todavía sin subir).
export function Formulario({ p }: { p: Pastor | null }) {
  const router = useRouter();
  const [nombres, setNombres] = useState(p?.nombres ?? '');
  const [iglesia, setIglesia] = useState(p?.iglesia ?? '');
  const [mensaje, setMensaje] = useState(p?.mensaje ?? '');
  const [foto, setFoto] = useState<Blob | null | undefined>(undefined);
  const [vista, setVista] = useState(p?.foto_url ?? null);
  const [errores, setErrores] = useState<{ nombres?: boolean; iglesia?: boolean }>({});
  const [guardando, setGuardando] = useState(false);
  const [borrar, setBorrar] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const refNombres = useRef<HTMLInputElement>(null), refIglesia = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (vista?.startsWith('blob:')) URL.revokeObjectURL(vista) }, [vista]);

  async function elegir(file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type) || file.size > 10e6) return toast('Usá una foto JPG o PNG de menos de 10 MB');
    try { const b = await recortar(file); setFoto(b); setVista(URL.createObjectURL(b)) }
    catch { toast('No se pudo leer esa foto. Probá con otra.') }
  }

  async function guardar() {
    const e = { nombres: !nombres.trim(), iglesia: !iglesia.trim() };
    setErrores(e);
    if (e.nombres) return refNombres.current?.focus();
    if (e.iglesia) return refIglesia.current?.focus();
    setGuardando(true);
    try {
      const id = await guardarPastor(p?.id ?? null, { nombres, iglesia, mensaje });
      if (foto) { const f = new FormData(); f.append('foto', new File([foto], 'foto.jpg', { type: 'image/jpeg' })); await subirFoto(id, f) }
      else if (foto === null) await quitarFoto(id);
      toast(mensaje.trim() ? 'Bienvenida publicada' : 'Guardado. Falta el mensaje para publicarlo.');
      router.push(LISTA);
    } catch { toast('No se pudo guardar. Revisá la conexión y probá de nuevo.'); setGuardando(false) }
  }

  async function eliminar() {
    if (!borrar) return setBorrar(true);
    try { await eliminarPastor(p!.id); toast('Matrimonio eliminado'); router.push(LISTA) }
    catch { toast('No se pudo eliminar. Probá de nuevo.') }
  }

  const archivo = (capture?: 'user' | 'environment') => (
    <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" capture={capture} hidden
      onChange={(e) => { elegir(e.target.files?.[0]); e.target.value = '' }} />
  );

  return (
    <div className="b-edit">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="field">
          <span className="t">Foto del matrimonio</span>
          <div className="wrapgap" style={{ gap: 16 }}>
            <label className={`zona-foto${vista ? ' llena' : ''}${arrastrando ? ' arrastrando' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }} onDragLeave={() => setArrastrando(false)}
              onDrop={(e) => { e.preventDefault(); setArrastrando(false); elegir(e.dataTransfer.files[0]) }}>
              {vista ? <img src={vista} alt="Foto recortada" /> : <><Camara /><span className="escritorio">Tocá o arrastrá una foto</span></>}
              {archivo()}
            </label>
            {vista ? (
              <div className="wrapgap" style={{ gap: 8 }}>
                <label className="mini">Cambiar{archivo()}</label>
                <button className="mini" type="button" onClick={() => { setFoto(null); setVista(null) }}>Quitar</button>
              </div>
            ) : (
              <>
                <div className="movil" style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <label className="btn">Sacar foto{archivo('environment')}</label>
                  <label className="btn sec">Elegir de la galería{archivo()}</label>
                </div>
                <div className="escritorio" style={{ flexDirection: 'column', gap: 4 }}>
                  <label className="btn sec">Elegir foto{archivo()}</label>
                  <p className="note" style={{ marginTop: 4 }}>JPG o PNG. Se recorta cuadrada.</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="cols2">
          <div className="field">
            <label htmlFor="bn">Nombres del matrimonio</label>
            <input ref={refNombres} id="bn" className={`input${errores.nombres ? ' error' : ''}`} maxLength={120} placeholder="Ej.: Hugo y Silvia Ortiz"
              value={nombres} onChange={(e) => { setNombres(e.target.value); setErrores((x) => ({ ...x, nombres: false })) }} aria-invalid={errores.nombres} />
            {errores.nombres && <span className="err" role="alert">Escribí los nombres del matrimonio.</span>}
          </div>
          <div className="field">
            <label htmlFor="bi">Iglesia</label>
            <input ref={refIglesia} id="bi" className={`input${errores.iglesia ? ' error' : ''}`} maxLength={120} placeholder="Ej.: Iglesia de Las Heras"
              value={iglesia} onChange={(e) => { setIglesia(e.target.value); setErrores((x) => ({ ...x, iglesia: false })) }} aria-invalid={errores.iglesia} />
            {errores.iglesia && <span className="err" role="alert">Escribí la iglesia.</span>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="bm">Mensaje de bienvenida</label>
          <textarea id="bm" className="apunte" style={{ minHeight: 160 }} maxLength={MAX_MENSAJE} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
          <span className="note" style={{ alignSelf: 'flex-end' }}>{mensaje.length} / {MAX_MENSAJE}</span>
        </div>
        <div className="wrapgap" style={{ justifyContent: 'space-between' }}>
          <div className="wrapgap">
            <button className="btn" type="button" disabled={guardando} onClick={guardar}>{guardando ? 'Guardando…' : 'Guardar y publicar'}</button>
            <button className="btn sec" type="button" onClick={() => router.push(LISTA)}>Cancelar</button>
          </div>
          {p && (
            <button className="mini peligro" type="button" onClick={eliminar} onBlur={() => setBorrar(false)}>
              {borrar ? '¿Seguro? Tocá de nuevo para eliminar' : 'Eliminar matrimonio'}
            </button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="lbl">Así lo ve el asistente</span>
        <TarjetaPastor p={{ nombres, iglesia, mensaje, foto_url: vista }} />
      </div>
    </div>
  );
}
