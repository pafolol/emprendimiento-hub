/** Los "clics" del menú, sintetizados: nada que descargar. */
let ctx: AudioContext | null = null
let silencio = false

try {
  silencio = localStorage.getItem('hub:silencio') === '1'
} catch {
  // Sin almacenamiento: con sonido.
}

/** El navegador solo deja crear audio tras un gesto del usuario: solo `despertar` lo crea. */
function audio(crear = false) {
  if (silencio) return null
  if (!ctx) {
    if (!crear) return null
    try {
      ctx = new AudioContext()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tono(frecuencia: number, inicio: number, duracion: number, volumen: number, tipo: OscillatorType = 'sine') {
  const a = audio()
  if (!a || a.state !== 'running') return
  const t = a.currentTime + inicio
  const osc = a.createOscillator()
  const gan = a.createGain()
  osc.type = tipo
  osc.frequency.setValueAtTime(frecuencia, t)
  gan.gain.setValueAtTime(0, t)
  gan.gain.linearRampToValueAtTime(volumen, t + 0.006)
  gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion)
  osc.connect(gan).connect(a.destination)
  osc.start(t)
  osc.stop(t + duracion + 0.02)
}

export const sonido = {
  despertar() {
    audio(true)
  },
  pasar() {
    tono(1760, 0, 0.05, 0.035)
  },
  elegir() {
    tono(880, 0, 0.09, 0.06, 'triangle')
    tono(1318.5, 0.07, 0.14, 0.05, 'triangle')
  },
  volver() {
    tono(1318.5, 0, 0.08, 0.05, 'triangle')
    tono(880, 0.06, 0.12, 0.04, 'triangle')
  },
  abrir() {
    ;[659.25, 880, 1108.7, 1318.5].forEach((f, i) => tono(f, i * 0.07, 0.32, 0.045, 'triangle'))
  },
  get silencio() {
    return silencio
  },
  alternar() {
    silencio = !silencio
    try {
      localStorage.setItem('hub:silencio', silencio ? '1' : '0')
    } catch {
      // Se queda solo en esta visita.
    }
    if (!silencio) {
      audio(true)
      sonido.elegir()
    }
    return silencio
  },
}
