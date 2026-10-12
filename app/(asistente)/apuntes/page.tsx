import { Cabecera } from '../cabecera';
import { Apuntes } from './apuntes';

export default function Page() {
  return (
    <>
      <Cabecera titulo="Mis apuntes" />
      <Apuntes />
      <div className="foot" />
    </>
  );
}
