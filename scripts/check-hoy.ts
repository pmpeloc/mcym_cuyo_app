// node scripts/check-hoy.ts — verifica el "día de hoy" en horario de Argentina.
import assert from 'node:assert';
import { hoy } from '../lib/convencion.ts';

const en = (iso: string) => (process.env.AHORA_SIMULADO = iso);
en('2026-11-11T23:59:00-03:00'); assert.equal(hoy(), 'antes');
en('2026-11-13T00:30:00-03:00'); assert.equal(hoy(), 'vie');
en('2026-11-12T23:30:00-03:00'); assert.equal(hoy(), 'jue'); // en UTC ya es viernes
en('2026-11-16T10:00:00-03:00'); assert.equal(hoy(), 'despues');
console.log('ok');
