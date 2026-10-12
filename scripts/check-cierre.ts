// node scripts/check-cierre.ts — verifica cierre de confirmaciones y "día de hoy".
import assert from 'node:assert';
import { abierta, hoy } from '../lib/convencion.ts';

const en = (iso: string) => (process.env.AHORA_SIMULADO = iso);
en('2026-11-11T19:59:00-03:00'); assert.equal(abierta('jue'), true); assert.equal(hoy(), 'antes');
en('2026-11-11T20:00:00-03:00'); assert.equal(abierta('jue'), false); assert.equal(abierta('vie'), true);
en('2026-11-13T00:30:00-03:00'); assert.equal(hoy(), 'vie');
en('2026-11-12T23:30:00-03:00'); assert.equal(hoy(), 'jue'); // en UTC ya es viernes assert.equal(abierta('vie'), false); assert.equal(abierta('sab'), true);
en('2026-11-16T10:00:00-03:00'); assert.equal(hoy(), 'despues');
console.log('ok');
