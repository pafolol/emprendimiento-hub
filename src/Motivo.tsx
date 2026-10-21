import type { Motivo as TipoMotivo } from './proyectos'

/** La ilustración animada de cada canal. Dibuja con currentColor y --acento del canal. */
export function Motivo({ tipo, grande = false }: { tipo: TipoMotivo; grande?: boolean }) {
  if (tipo === 'coworking') return <Escritorios grande={grande} />
  if (tipo === 'radar') return <Radar />
  if (tipo === 'calendario') return <Calendario grande={grande} />
  return <Rayo />
}

/** Una semana de horarios: los huecos se van apartando en azul, como en el calendario de reservas. */
function Calendario({ grande }: { grande: boolean }) {
  const dias = grande ? 5 : 3
  const horas = grande ? 4 : 3
  return (
    <svg viewBox={`0 0 ${dias * 12} ${horas * 8 + 6}`} className="h-full w-full overflow-visible" aria-hidden>
      {Array.from({ length: dias }, (_, d) => (
        <rect key={`dia-${d}`} x={d * 12 + 1} y={0} width={10} height={3} rx={1.5} fill="currentColor" opacity={0.55} />
      ))}
      {Array.from({ length: dias * horas }, (_, i) => {
        const d = i % dias
        const h = Math.floor(i / dias)
        return (
          <rect
            key={i}
            x={d * 12 + 1}
            y={h * 8 + 6}
            width={10}
            height={6}
            rx={1.8}
            className="hueco"
            style={{ animationDelay: `${((i * 5) % (dias * horas)) * 0.42}s` }}
          />
        )
      })}
    </svg>
  )
}

/** Un plano de lugares: los escritorios se van ocupando, como en el panel del coworking. */
function Escritorios({ grande }: { grande: boolean }) {
  const lado = grande ? 5 : 3
  return (
    <svg viewBox={`0 0 ${lado * 10} ${lado * 10}`} className="h-full w-full overflow-visible" aria-hidden>
      {Array.from({ length: lado * lado }, (_, i) => {
        const x = (i % lado) * 10
        const y = Math.floor(i / lado) * 10
        return (
          <rect
            key={i}
            x={x + 1}
            y={y + 1}
            width={8}
            height={8}
            rx={2.2}
            className="escritorio"
            style={{ animationDelay: `${((i * 7) % (lado * lado)) * 0.38}s` }}
          />
        )
      })}
    </svg>
  )
}

/** Un radar que barre y encuentra oportunidades. */
function Radar() {
  const puntos = [
    { x: 64, y: 30, d: 0 },
    { x: 28, y: 58, d: 1.3 },
    { x: 70, y: 70, d: 2.4 },
  ]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="barrido" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {[46, 32, 18].map((r) => (
        <circle key={r} cx={50} cy={50} r={r} fill="none" stroke="currentColor" strokeOpacity={0.28} strokeWidth={1.6} />
      ))}
      <g className="radar-barrido">
        <path d="M50 50 L96 50 A46 46 0 0 0 82.5 17.5 Z" fill="url(#barrido)" />
        <line x1={50} y1={50} x2={96} y2={50} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </g>
      {puntos.map((p) => (
        <g key={`${p.x}-${p.y}`}>
          <circle cx={p.x} cy={p.y} r={3.4} fill="var(--acento)" className="radar-punto" style={{ animationDelay: `${p.d}s` }} />
          <circle cx={p.x} cy={p.y} r={3.4} fill="none" stroke="var(--acento)" strokeWidth={1.4} className="radar-onda" style={{ animationDelay: `${p.d}s` }} />
        </g>
      ))}
      <circle cx={50} cy={50} r={3} fill="currentColor" />
    </svg>
  )
}

/** El rayo de Emprendimiento, para los proyectos que todavía no tienen ilustración propia. */
function Rayo() {
  return (
    <svg viewBox="0 0 100 100" className="rayo-flota h-full w-full overflow-visible" aria-hidden>
      <Relampago />
    </svg>
  )
}

/** El rayo en dos tonos del logotipo. Ocupa un cuadro de 100×100. */
export function Relampago({ arriba = 'currentColor', abajo = 'currentColor', opacidadAbajo = 0.62 }: { arriba?: string; abajo?: string; opacidadAbajo?: number }) {
  return (
    <>
      <path d="M58.6 8.7c2.6-3 7.4-.2 6 3.5L56.4 33.5c-.8 2.1.3 4.4 2.4 5.1l19.4 6.4c3.1 1 3.7 4.4 2.6 6.6L20.7 54.5c-2.6-1.2-3.2-4.7-1.2-7z" fill={arriba} />
      <path d="M80.8 51.6c-.3.6-.7 1.2-1.2 1.7L45.2 92.4c-2.6 3-7.4.2-6-3.5l8.2-21.3c.8-2.1-.3-4.4-2.4-5.1l-21.4-6.8c-1.3-.4-2.3-1.3-2.9-2.3z" fill={abajo} opacity={opacidadAbajo} />
    </>
  )
}
