// Días, comidas y horarios fijos de la convención. Cambian poco: se editan acá.
export const DIAS = [
  { id: 'jue', nombre: 'Jueves', fecha: '2026-11-12', texto: '12 de noviembre' },
  { id: 'vie', nombre: 'Viernes', fecha: '2026-11-13', texto: '13 de noviembre' },
  { id: 'sab', nombre: 'Sábado', fecha: '2026-11-14', texto: '14 de noviembre' },
  { id: 'dom', nombre: 'Domingo', fecha: '2026-11-15', texto: '15 de noviembre' },
] as const;
export type DiaId = (typeof DIAS)[number]['id'];

export const COMIDAS = DIAS.flatMap((d) => [
  { id: `${d.id}-almuerzo`, dia: d.id as DiaId, nombre: 'Almuerzo', hora: '13:00' },
  { id: `${d.id}-cena`, dia: d.id as DiaId, nombre: 'Cena', hora: d.id === 'dom' ? '21:00' : '21:30' },
]);

export const MAX_MENSAJE = 400;
const TZ = 'America/Argentina/Mendoza';

// AHORA_SIMULADO (ej. 2026-11-13T12:00:00-03:00) permite probar antes del evento.
export const ahora = () => (process.env.AHORA_SIMULADO ? new Date(process.env.AHORA_SIMULADO) : new Date());

export function hoy(): DiaId | 'antes' | 'despues' {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(ahora()); // AAAA-MM-DD
  if (f < DIAS[0].fecha) return 'antes';
  return DIAS.find((d) => d.fecha === f)?.id ?? 'despues';
}

// Cada día se confirma hasta las 20:00 del día anterior (Argentina no tiene horario de verano: UTC-3 fijo).
export function cierre(dia: DiaId) {
  const c = new Date(`${DIAS.find((d) => d.id === dia)!.fecha}T20:00:00-03:00`);
  c.setUTCDate(c.getUTCDate() - 1);
  return c;
}
export const abierta = (dia: DiaId) => ahora() < cierre(dia);

export const hora = (d: string | Date) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(d));
