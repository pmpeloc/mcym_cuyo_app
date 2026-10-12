import type { NextConfig } from 'next';

// La raíz es este repo (hay otro package-lock.json más arriba, en la carpeta del usuario).
const config: NextConfig = { turbopack: { root: __dirname } };
export default config;
