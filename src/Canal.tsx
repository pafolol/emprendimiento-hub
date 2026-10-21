import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { Motivo } from './Motivo'
import type { Proyecto } from './proyectos'

type Props = {
  proyecto: Proyecto
  indice: number
  enfocado: boolean
  onEnfocar: () => void
  onElegir: () => void
}

/** Un canal: un campo del color del proyecto con su nombre en grande. */
export function Canal({ proyecto, indice, enfocado, onEnfocar, onElegir }: Props) {
  const estilo = {
    '--fondo': proyecto.fondo,
    '--tinta': proyecto.tinta,
    '--acento': proyecto.acento,
  } as CSSProperties

  return (
    <motion.button
      type="button"
      data-canal={indice}
      data-enfocado={enfocado}
      className="canal"
      style={estilo}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35 + indice * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
      onPointerEnter={onEnfocar}
      onFocus={onEnfocar}
      onClick={onElegir}
      aria-label={`${proyecto.nombre}: ${proyecto.subtitulo}`}
    >
      <span className="canal-marco" />
      <motion.span layoutId={`pantalla-${proyecto.id}`} className="canal-pantalla" transition={{ type: 'spring', stiffness: 220, damping: 30 }}>
        <span className="canal-rayas" />
        {proyecto.imagen ? (
          <span className="canal-foto">
            <img src={proyecto.imagen} alt="" draggable={false} />
          </span>
        ) : (
          <span className="canal-motivo">
            <Motivo tipo={proyecto.motivo} />
          </span>
        )}
        <motion.span layoutId={`nombre-${proyecto.id}`} className="canal-nombre" transition={{ type: 'spring', stiffness: 220, damping: 30 }}>
          {proyecto.nombre}
        </motion.span>
        <span className="canal-brillo" />
      </motion.span>
    </motion.button>
  )
}

/** Un lugar libre de la rejilla, esperando el siguiente proyecto. */
export function CanalVacio({ indice }: { indice: number }) {
  return (
    <motion.div
      className="canal canal-vacio"
      aria-hidden
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35 + indice * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
    >
      <span className="canal-marco" />
      <span className="canal-pantalla">
        <span className="canal-rayas" />
      </span>
    </motion.div>
  )
}
