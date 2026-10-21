import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Bandeja } from './Bandeja'
import { Canal, CanalVacio } from './Canal'
import { Relampago } from './Motivo'
import { CANALES_MINIMOS, PROYECTOS, type Proyecto } from './proyectos'
import { sonido } from './sonido'
import { Vista } from './Vista'

const TITULO = 'Emprendimiento'

/** En el celular, con dos columnas, basta con tres filas de canales. */
function useCanalesMinimos() {
  const consulta = '(max-width: 600px)'
  const [chico, setChico] = useState(() => window.matchMedia(consulta).matches)
  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const cambio = () => setChico(mq.matches)
    mq.addEventListener('change', cambio)
    return () => mq.removeEventListener('change', cambio)
  }, [])
  return chico ? CANALES_MINIMOS / 2 : CANALES_MINIMOS
}

export default function App() {
  const [enfocado, setEnfocado] = useState<number | null>(null)
  const [abierto, setAbierto] = useState<Proyecto | null>(null)
  const rejilla = useRef<HTMLDivElement>(null)

  const vacios = Math.max(0, useCanalesMinimos() - PROYECTOS.length)
  const conColor = enfocado !== null ? PROYECTOS[enfocado] : null

  const enfocar = (i: number) => {
    if (i !== enfocado) sonido.pasar()
    setEnfocado(i)
  }

  const elegir = (p: Proyecto) => {
    sonido.elegir()
    setAbierto(p)
  }

  // El audio solo puede arrancar tras un gesto.
  useEffect(() => {
    const despertar = () => sonido.despertar()
    window.addEventListener('pointerdown', despertar, { once: true })
    window.addEventListener('keydown', despertar, { once: true })
    return () => {
      window.removeEventListener('pointerdown', despertar)
      window.removeEventListener('keydown', despertar)
    }
  }, [])

  // Flechas para moverse por la rejilla, Enter para abrir.
  useEffect(() => {
    if (abierto) return
    const tecla = (e: KeyboardEvent) => {
      const columnas = rejilla.current ? getComputedStyle(rejilla.current).gridTemplateColumns.split(' ').length : 4
      const pasos: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columnas, ArrowUp: -columnas }
      const paso = pasos[e.key]
      if (paso !== undefined) {
        e.preventDefault()
        const siguiente = enfocado === null ? 0 : enfocado + paso
        if (siguiente >= 0 && siguiente < PROYECTOS.length) {
          enfocar(siguiente)
          rejilla.current?.querySelector<HTMLElement>(`[data-canal="${siguiente}"]`)?.focus()
        }
      } else if (e.key === 'Enter' && enfocado !== null && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault()
        elegir(PROYECTOS[enfocado])
      }
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  // Al cerrar la vista, el foco vuelve a su canal.
  const cerrar = () => {
    const i = abierto ? PROYECTOS.indexOf(abierto) : -1
    setAbierto(null)
    window.setTimeout(() => rejilla.current?.querySelector<HTMLElement>(`[data-canal="${i}"]`)?.focus({ preventScroll: true }), 50)
  }

  return (
    <div className="menu" style={{ '--ambiente': conColor?.fondo ?? 'var(--color-cielo)' } as CSSProperties}>
      <div className="menu-ambiente" aria-hidden />

      <header className="relative z-10 flex flex-col items-center px-4 pt-[clamp(1.5rem,5vh,3.5rem)] text-center">
        <motion.p
          className="mb-3 font-mono text-[11px] font-semibold tracking-[0.28em] text-tec uppercase"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tec de Monterrey · Proyectos del área
        </motion.p>
        <h1 className="titulo" aria-label="Emprendimiento Hub">
          <motion.svg
            viewBox="0 0 100 100"
            className="titulo-rayo"
            initial={{ opacity: 0, rotate: -25, scale: 0.4 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.05 }}
            aria-hidden
          >
            <Relampago arriba="#3634c4" abajo="#16169a" opacidadAbajo={1} />
          </motion.svg>
          <span className="titulo-palabra" aria-hidden>
            {TITULO.split('').map((letra, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: '0.5em' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.1 + i * 0.035 }}
              >
                {letra}
              </motion.span>
            ))}
          </span>
          <motion.span
            className="titulo-hub"
            initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 13, delay: 0.1 + TITULO.length * 0.035 }}
            aria-hidden
          >
            Hub
          </motion.span>
        </h1>
      </header>

      <main className="relative z-10 flex flex-1 items-start justify-center px-4 pt-[clamp(1.25rem,4vh,2.75rem)] pb-40">
        <div ref={rejilla} className="rejilla" onPointerLeave={() => setEnfocado(null)}>
          {PROYECTOS.map((p, i) => (
            <Canal
              key={p.id}
              proyecto={p}
              indice={i}
              enfocado={enfocado === i && !abierto}
              onEnfocar={() => enfocar(i)}
              onElegir={() => elegir(p)}
            />
          ))}
          {Array.from({ length: vacios }, (_, i) => (
            <CanalVacio key={`vacio-${i}`} indice={PROYECTOS.length + i} />
          ))}
        </div>
      </main>

      <Bandeja total={PROYECTOS.length} />

      <AnimatePresence>
        {abierto && (
          <>
            <motion.div
              key="velo"
              className="fixed inset-0 z-30 bg-white/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <Vista key={abierto.id} proyecto={abierto} onCerrar={cerrar} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
