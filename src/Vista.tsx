import { motion } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'
import { Motivo } from './Motivo'
import type { Proyecto } from './proyectos'
import { sonido } from './sonido'

/** La vista previa del canal: crece desde la rejilla hasta llenar la pantalla. "Abrir" lleva al proyecto. */
export function Vista({ proyecto, onCerrar }: { proyecto: Proyecto; onCerrar: () => void }) {
  const [saliendo, setSaliendo] = useState(false)

  const abrir = () => {
    if (saliendo) return
    sonido.abrir()
    setSaliendo(true)
    window.setTimeout(() => window.location.assign(proyecto.url), 650)
  }

  const cerrar = () => {
    if (saliendo) return
    sonido.volver()
    onCerrar()
  }

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault()
        cerrar()
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        abrir()
      }
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  // Al volver con "Atrás" del navegador, la página puede salir de la caché ya en blanco.
  useEffect(() => {
    const volver = (e: PageTransitionEvent) => e.persisted && setSaliendo(false)
    window.addEventListener('pageshow', volver)
    return () => window.removeEventListener('pageshow', volver)
  }, [])

  const estilo = {
    '--fondo': proyecto.fondo,
    '--tinta': proyecto.tinta,
    '--acento': proyecto.acento,
  } as CSSProperties
  const dominio = proyecto.url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className="fixed inset-0 z-40" style={estilo} role="dialog" aria-modal aria-label={proyecto.nombre}>
      <motion.div layoutId={`pantalla-${proyecto.id}`} className="vista-pantalla" transition={{ type: 'spring', stiffness: 220, damping: 30 }}>
        <span className="canal-rayas" />

        <motion.div
          className="vista-arte"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 20 }}
        >
          {proyecto.imagen ? (
            <span className="vista-foto">
              <img src={proyecto.imagen} alt="" draggable={false} />
            </span>
          ) : (
            <Motivo tipo={proyecto.motivo} grande />
          )}
        </motion.div>

        <div className="vista-texto">
          <motion.p
            className="vista-subtitulo"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.22 }}
          >
            {proyecto.subtitulo}
          </motion.p>
          <motion.h2 layoutId={`nombre-${proyecto.id}`} className="vista-nombre" transition={{ type: 'spring', stiffness: 220, damping: 30 }}>
            {proyecto.nombre}
          </motion.h2>
          <motion.p
            className="vista-descripcion"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {proyecto.descripcion}
          </motion.p>
          <motion.p className="vista-url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.38 }}>
            {dominio}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="vista-barra"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.1 }}
      >
        <button type="button" className="boton-capsula" onClick={cerrar} onPointerEnter={() => sonido.pasar()}>
          Menú
        </button>
        <button type="button" className="boton-capsula boton-capsula-principal" onClick={abrir} onPointerEnter={() => sonido.pasar()} autoFocus>
          Abrir
        </button>
      </motion.div>

      {/* Fundido a blanco antes de saltar al proyecto, como al arrancar un canal. */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 bg-white"
        initial={false}
        animate={{ opacity: saliendo ? 1 : 0 }}
        transition={{ duration: 0.55, ease: 'easeIn' }}
      />
    </div>
  )
}
