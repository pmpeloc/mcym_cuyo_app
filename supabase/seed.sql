-- Datos FICTICIOS para probar. Reemplazar desde el panel de organización.

insert into dias (id, aviso) values
  ('jue', ''),
  ('vie', 'El almuerzo se sirve en el salón B por el ensayo del coro.'),
  ('sab', ''),
  ('dom', '');

insert into config (wifi_red, wifi_clave) values ('Convencion-Cuyo', 'creciendo2026');

insert into perdidos (que, donde, cuando) values
  ('Campera azul talle M', 'Salón principal, fila 8', 'Jueves 21:45'),
  ('Biblia de tapa marrón con nombre "Ana"', 'Comedor', 'Viernes 14:10');

insert into menu_items (comida, tipo, valor, original, orden) values
  ('jue-almuerzo', 'Plato principal', 'Pollo al horno con hierbas', 'Pollo al horno con hierbas', 1),
  ('jue-almuerzo', 'Guarnición', 'Papas rústicas', 'Papas rústicas', 2),
  ('jue-almuerzo', 'Postre', 'Ensalada de frutas', 'Ensalada de frutas', 3),
  ('jue-almuerzo', 'Bebida', 'Agua y jugo', 'Agua y jugo', 4),
  ('jue-cena', 'Plato principal', 'Fideos con salsa bolognesa', 'Fideos con salsa bolognesa', 1),
  ('jue-cena', 'Acompañamiento', 'Pan casero', 'Pan casero', 2),
  ('jue-cena', 'Postre', 'Flan con dulce de leche', 'Flan con dulce de leche', 3),
  ('jue-cena', 'Bebida', 'Agua y gaseosa', 'Agua y gaseosa', 4),
  ('vie-almuerzo', 'Plato principal', 'Carne al horno', 'Carne al horno', 1),
  ('vie-almuerzo', 'Guarnición', 'Arroz primavera', 'Puré mixto', 2),
  ('vie-almuerzo', 'Postre', 'Duraznos en almíbar', 'Duraznos en almíbar', 3),
  ('vie-almuerzo', 'Bebida', 'Agua y jugo', 'Agua y jugo', 4),
  ('vie-cena', 'Plato principal', 'Empanadas mendocinas (3 por persona)', 'Empanadas mendocinas (3 por persona)', 1),
  ('vie-cena', 'Guarnición', 'Ensalada criolla', 'Ensalada criolla', 2),
  ('vie-cena', 'Postre', 'Pastelitos de membrillo', 'Pastelitos de membrillo', 3),
  ('vie-cena', 'Bebida', 'Agua y gaseosa', 'Agua y gaseosa', 4),
  ('vie-cena', 'Extra', 'Opción sin TACC: tarta de verduras', null, 5),
  ('sab-almuerzo', 'Plato principal', 'Milanesas al horno', 'Milanesas al horno', 1),
  ('sab-almuerzo', 'Guarnición', 'Papas al natural', 'Papas al natural', 2),
  ('sab-almuerzo', 'Postre', 'Budín de pan', 'Budín de pan', 3),
  ('sab-almuerzo', 'Bebida', 'Agua y jugo', 'Agua y jugo', 4),
  ('sab-cena', 'Plato principal', 'Pastel de papas', 'Pastel de papas', 1),
  ('sab-cena', 'Guarnición', 'Ensalada verde', 'Ensalada verde', 2),
  ('sab-cena', 'Postre', 'Arroz con leche', 'Arroz con leche', 3),
  ('sab-cena', 'Bebida', 'Agua y gaseosa', 'Agua y gaseosa', 4),
  ('dom-almuerzo', 'Plato principal', 'Asado de despedida', 'Asado de despedida', 1),
  ('dom-almuerzo', 'Guarnición', 'Ensalada mixta', 'Ensalada mixta', 2),
  ('dom-almuerzo', 'Postre', 'Helado', 'Helado', 3),
  ('dom-almuerzo', 'Bebida', 'Agua y gaseosa', 'Agua y gaseosa', 4),
  ('dom-cena', 'Plato principal', 'Pizzas caseras', 'Pizzas caseras', 1),
  ('dom-cena', 'Postre', 'Frutas de estación', 'Frutas de estación', 2),
  ('dom-cena', 'Bebida', 'Agua y jugo', 'Agua y jugo', 3);

insert into pastores (nombres, iglesia, mensaje, orden) values
  ('Daniel y Romina Quiroga', 'Iglesia de Godoy Cruz', 'Qué alegría tenerlos en Mendoza. Oramos durante meses por cada uno de ustedes. Que estos días sean de descanso, de encuentro y de una palabra fresca de parte de Dios.', 1),
  ('Marcelo y Andrea Funes', 'Iglesia de Guaymallén', 'Bienvenidos a casa. Sabemos el esfuerzo que hicieron para llegar. Nuestro deseo es que vuelvan a sus iglesias renovados y con el corazón encendido.', 2),
  ('Hugo y Silvia Ortiz', 'Iglesia de Las Heras', 'Desde Las Heras les damos un abrazo grande. Pedimos al Señor que cada reunión sea un tiempo de reencuentro con Él y entre hermanos.', 3),
  ('Gustavo y Carina Lucero', 'Iglesia de Maipú', 'Esta es tierra de viñedos y de cosecha. Que la convención sea también un tiempo de cosecha para sus vidas y sus familias.', 4),
  ('Sergio y Mónica Videla', 'Iglesia de Luján de Cuyo', 'Bienvenidos, hermanos. Cualquier cosa que necesiten durante estos días, cuenten con nosotros. Estamos para servirles.', 5),
  ('Raúl y Patricia Correa', 'Iglesia de San Martín', 'Queremos que se sientan en familia. Los esperamos en cada reunión con expectativa por lo que Dios va a hacer.', 6),
  ('Javier y Lorena Pérez', 'Iglesia de Rivadavia', 'Gracias por venir desde tan lejos. Que el Señor bendiga cada kilómetro que recorrieron para estar acá.', 7),
  ('Oscar y Beatriz Gómez', 'Iglesia de Junín', 'Nos alegra recibirlos. Oramos para que se lleven amistades nuevas y una fe fortalecida.', 8),
  ('Fernando y Natalia Arce', 'Iglesia de Tunuyán', 'Desde el Valle de Uco les mandamos nuestra bienvenida. Que la presencia de Dios llene cada encuentro.', 9),
  ('Ricardo y Gabriela Sosa', 'Iglesia de Tupungato', 'Hace tiempo esperábamos este momento. Bienvenidos a la convención: disfruten, descansen y escuchen a Dios.', 10),
  ('Luis y Verónica Molina', 'Iglesia de San Carlos', 'Con mucho cariño los recibimos. Que estos días sean un refugio para el alma y un impulso para el ministerio.', 11),
  ('Alberto y Claudia Díaz', 'Iglesia de San Rafael', 'Desde el sur mendocino, bienvenidos. Que vuelvan a casa con nuevas fuerzas y una visión clara.', 12),
  ('Martín y Paola Herrera', 'Iglesia de General Alvear', 'Es un honor compartir estos días con ustedes. Oramos por cada iglesia representada en esta convención.', 13),
  ('Rubén y Elena Castro', 'Iglesia de Malargüe', 'Bienvenidos, hermanos. Que el frío de la montaña nunca alcance al fuego que Dios quiere encender en estos días.', 14),
  ('Diego y Soledad Ríos', 'Iglesia de Lavalle', 'Gracias por sumarse. Creemos que Dios tiene algo preparado para cada uno de ustedes.', 15),
  ('Pablo y Mariela Navarro', 'Iglesia de Santa Rosa', 'Los recibimos con los brazos abiertos. Que encuentren en Mendoza un hogar durante estos días.', 16),
  ('Walter y Susana Aguilar', 'Iglesia de La Paz', 'Bienvenidos a la convención. Que la paz de Dios los acompañe en cada reunión y en el viaje de regreso.', 17),
  ('Carlos y Laura Rivero', 'Iglesia de Ciudad de Mendoza', 'Qué bueno es estar juntos otra vez. Bienvenidos, y gracias por traer a sus iglesias en el corazón.', 18);
