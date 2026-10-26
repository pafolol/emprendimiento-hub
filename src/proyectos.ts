/**
 * Los canales del hub. Para agregar un proyecto, añade un objeto aquí:
 * el orden de la lista es el orden en la rejilla.
 *
 * - fondo / tinta: el color del canal y el de sus letras (usa la paleta del proyecto).
 * - imagen: opcional, una foto en public/proyectos/ (p. ej. "/proyectos/coworking.jpg").
 *   Sin foto, el canal muestra su motivo animado.
 */
export type Motivo = 'coworking' | 'radar' | 'calendario' | 'rayo'

export type Proyecto = {
  id: string
  nombre: string
  subtitulo: string
  descripcion: string
  url: string
  fondo: string
  tinta: string
  acento: string
  imagen?: string
  motivo: Motivo
}

export const PROYECTOS: Proyecto[] = [
  {
    id: 'coworking',
    nombre: 'Coworking',
    subtitulo: 'Coworking GDL',
    descripcion:
      '33 espacios fijos que se ganan y se conservan con uso real. Solicitudes, check-ins con QR, corte semanal y mensajes en un solo panel.',
    url: 'https://coworking.emprendimientohub.com',
    fondo: '#c6f23a',
    tinta: '#0a3dba',
    acento: '#06123a',
    motivo: 'coworking',
  },
  {
    id: 'hackathonfinder',
    nombre: 'Hackathon Finder',
    subtitulo: 'Buscador de oportunidades',
    descripcion:
      'Busca en la web hackathones, convocatorias, competencias, aceleradoras y fondos, y los cruza con los proyectos del área.',
    url: 'https://hackathon.emprendimientohub.com',
    fondo: '#d6e4ff',
    tinta: '#0039a6',
    acento: '#1f5fe0',
    motivo: 'radar',
  },
  {
    id: 'booking',
    nombre: 'Reservas',
    subtitulo: 'Reserva de espacios',
    descripcion:
      'Calendario de disponibilidad para reservar salas: las de uso común se confirman al instante y las especiales o de fin de semana pasan por aprobación, con aviso por correo.',
    url: 'https://booking.emprendimientohub.com',
    fondo: '#171717',
    tinta: '#ffffff',
    acento: '#3b6ef5',
    motivo: 'calendario',
  },
]

/** La rejilla siempre muestra al menos tantos canales; los que sobran quedan vacíos, como en el Wii. */
export const CANALES_MINIMOS = 12
