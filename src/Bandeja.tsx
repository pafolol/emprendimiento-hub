import { useEffect, useState } from 'react'
import { Relampago } from './Motivo'
import { sonido } from './sonido'

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

function useAhora() {
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setAhora(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return ahora
}

/** La bandeja de abajo: botones redondos en las esquinas, la hora y la fecha al centro. */
export function Bandeja({ total }: { total: number }) {
  const ahora = useAhora()
  const [silencio, setSilencio] = useState(sonido.silencio)

  const h = ahora.getHours()
  const m = String(ahora.getMinutes()).padStart(2, '0')
  const fecha = `${DIAS[ahora.getDay()]} ${ahora.getDate()}/${ahora.getMonth() + 1}`

  return (
    <footer className="bandeja">
      <div className="bandeja-reloj" aria-label={`${h}:${m}`}>
        <span>{h % 12 || 12}</span>
        <span className="bandeja-dospuntos">:</span>
        <span>{m}</span>
        <span className="bandeja-ampm">{h < 12 ? 'AM' : 'PM'}</span>
      </div>

      <svg className="bandeja-forma" viewBox="0 0 1000 130" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="bandeja-relleno" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-bandeja-alta)" />
            <stop offset="1" stopColor="var(--color-bandeja-baja)" />
          </linearGradient>
        </defs>
        <path d="M0 130 V18 H70 C120 18 120 52 170 52 H830 C880 52 880 18 930 18 H1000 V130 Z" fill="url(#bandeja-relleno)" />
        <path d="M0 18 H70 C120 18 120 52 170 52 H830 C880 52 880 18 930 18 H1000" fill="none" stroke="var(--color-tec)" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
        <path d="M0 22 H70 C118 22 118 56 170 56 H830 C882 56 882 22 930 22 H1000" fill="none" stroke="white" strokeOpacity={0.9} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="bandeja-fecha">{fecha}</div>

      <div className="bandeja-boton izquierda" title="Emprendimiento Tec">
        <svg viewBox="0 0 100 100" className="h-[52%] w-[52%]" aria-hidden>
          <Relampago arriba="#3634c4" abajo="#16169a" opacidadAbajo={1} />
        </svg>
      </div>

      <button
        type="button"
        className="bandeja-boton derecha"
        onClick={() => setSilencio(sonido.alternar())}
        onPointerEnter={() => sonido.pasar()}
        aria-label={silencio ? 'Activar sonido' : 'Silenciar'}
        title={silencio ? 'Activar sonido' : 'Silenciar'}
      >
        <svg viewBox="0 0 24 24" className="h-[44%] w-[44%]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" />
          {silencio ? (
            <path d="m22 9-6 6M16 9l6 6" />
          ) : (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M19 5a10 10 0 0 1 0 14" />
            </>
          )}
        </svg>
        <span className="bandeja-cuenta" title={`${total} proyectos`}>
          {total}
        </span>
      </button>
    </footer>
  )
}
