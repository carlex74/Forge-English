import { Volume2, Pause } from 'lucide-react'

// Paleta de estilos de colores semánticos para roles sintácticos y gramaticales
const COLOR_STYLES = {
  blue: {
    bg: 'bg-blue-500/15 dark:bg-blue-500/25',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
    pillBg: 'bg-blue-600 text-white',
  },
  emerald: {
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/25',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-700',
    pillBg: 'bg-emerald-600 text-white',
  },
  amber: {
    bg: 'bg-amber-500/15 dark:bg-amber-500/25',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    pillBg: 'bg-amber-600 text-white',
  },
  purple: {
    bg: 'bg-purple-500/15 dark:bg-purple-500/25',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
    pillBg: 'bg-purple-600 text-white',
  },
  rose: {
    bg: 'bg-rose-500/15 dark:bg-rose-500/25',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-700',
    pillBg: 'bg-rose-600 text-white',
  },
  teal: {
    bg: 'bg-teal-500/15 dark:bg-teal-500/25',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-300 dark:border-teal-700',
    pillBg: 'bg-teal-600 text-white',
  },
  cyan: {
    bg: 'bg-cyan-500/15 dark:bg-cyan-500/25',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-300 dark:border-cyan-700',
    pillBg: 'bg-cyan-600 text-white',
  },
  indigo: {
    bg: 'bg-indigo-500/15 dark:bg-indigo-500/25',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-700',
    pillBg: 'bg-indigo-600 text-white',
  },
  slate: {
    bg: 'bg-slate-200/60 dark:bg-slate-700/60',
    text: 'text-slate-800 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-600',
    pillBg: 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900',
  },
}

// Etiquetas abreviadas y legibles en español para cada rol gramatical
const ROLE_LABELS = {
  subject: 'Sujeto',
  verb: 'Verbo',
  auxiliary: 'Auxiliar',
  object: 'Objeto',
  complement: 'Complemento',
  adjunct: 'Circunstancial',
  determiner: 'Determinante',
  modifier: 'Modificador',
  noun: 'Sustantivo',
  connector: 'Conector',
  negation: 'Negación',
  question: 'Interrogativo',
  particle: 'Partícula',
  preposition: 'Preposición',
  focus: 'Foco',
  relative: 'Relativo',
  clause: 'Proposición',
  phrase: 'Frase en bloque',
  punctuation: 'Puntuación',
}

export const SentenceColorBreakdown = ({
  sentence,
  onPlayAudio,
  isPlaying = false,
  showLabel = true,
}) => {
  if (!sentence) return null

  const tokens = sentence.tokens || []

  return (
    <div className="flex flex-col gap-3 p-4 md:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-left">
      {/* Contenedor principal de tokens y botón TTS */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-end gap-x-1 gap-y-3 pt-1">
          {tokens.map((token, idx) => {
            // Manejo de espacios en blanco
            if (token.role === 'punctuation' && token.text.trim() === '') {
              return (
                <span key={idx} className="inline-block w-1.5 md:w-2 select-none">
                  {' '}
                </span>
              )
            }

            // Manejo de signos de puntuación (puntos, comas, etc.)
            if (token.role === 'punctuation' || (!token.color && !token.role)) {
              return (
                <span
                  key={idx}
                  className="text-base md:text-lg font-bold text-slate-500 dark:text-slate-400 self-center px-0.5"
                >
                  {token.text}
                </span>
              )
            }

            const styles = COLOR_STYLES[token.color] || COLOR_STYLES.slate
            const roleLabel = ROLE_LABELS[token.role] || token.role

            return (
              <div key={idx} className="flex flex-col items-center">
                <span
                  className={`px-2.5 py-0.5 rounded-xl border font-bold text-base md:text-lg transition-transform hover:scale-105 select-text ${styles.bg} ${styles.text} ${styles.border}`}
                >
                  {token.text}
                </span>
                {showLabel && roleLabel && (
                  <span
                    className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded-md mt-1 tracking-wider shadow-2xs ${styles.pillBg}`}
                    title={roleLabel}
                  >
                    {roleLabel}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Botón de reproducción de audio con Piper TTS */}
        {onPlayAudio && sentence.en && (
          <button
            type="button"
            onClick={() => onPlayAudio(sentence.en)}
            className={`p-2.5 rounded-xl font-bold transition-all shrink-0 shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700 hover:text-amber-600'
            }`}
            title="Escuchar pronunciación con Piper TTS"
            aria-label="Escuchar pronunciación"
          >
            {isPlaying ? <Pause size={16} /> : <Volume2 size={16} />}
          </button>
        )}
      </div>

      {/* Traducción al español */}
      {sentence.es && (
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium pl-2 border-l-2 border-amber-400 dark:border-amber-500">
          {sentence.es}
        </p>
      )}
    </div>
  )
}
