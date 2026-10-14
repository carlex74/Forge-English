import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Volume2,
  Pause,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  KeyRound,
  FileQuestion,
} from 'lucide-react'
import {
  getTopicById,
  getTopicExercises,
  getAdjacentTopics,
  CATEGORY_METADATA,
} from '../core/services/curriculumService'
import { SentenceColorBreakdown } from '../components/quick-learn/SentenceColorBreakdown'
import { getAudioTtsUrl } from '../core/services/exerciseService'

export const QuickLearnTopicPage = () => {
  const { topicId, subtopicId } = useParams()
  const navigate = useNavigate()
  const activeId = subtopicId || topicId

  const [topic, setTopic] = useState(null)
  const [exercises, setExercises] = useState([])
  const [adjacent, setAdjacent] = useState({ prevTopic: null, nextTopic: null })
  const [loading, setLoading] = useState(true)

  // Estados interactivos para actividades y respuestas
  const [revealedAnswers, setRevealedAnswers] = useState({})
  const [playingAudioText, setPlayingAudioText] = useState(null)
  const audioRef = useRef(null)

  // Cargar datos de la ficha cuando cambie el ID de la ruta
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    Promise.all([
      getTopicById(activeId),
      getTopicExercises(activeId),
      getAdjacentTopics(activeId),
    ]).then(([topicData, exercisesData, adjacentData]) => {
      if (isMounted) {
        setTopic(topicData)
        setExercises(exercisesData)
        setAdjacent(adjacentData)
        setRevealedAnswers({})
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [activeId])

  // Reproducción de audio con Piper TTS neuronal
  const handlePlayAudio = (text) => {
    if (!text) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (playingAudioText === text) {
      setPlayingAudioText(null)
      return
    }

    setPlayingAudioText(text)
    const url = getAudioTtsUrl(text)
    const audio = new Audio(url)
    audio.onended = () => setPlayingAudioText(null)
    audio.onerror = () => setPlayingAudioText(null)
    audioRef.current = audio
    audio.play().catch(() => setPlayingAudioText(null))
  }

  const toggleRevealAnswer = (exerciseId) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 max-w-xl text-center">
        <Sparkles className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Cargando ficha curricular...
        </h2>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-xl text-center">
        <BookOpen className="w-14 h-14 text-slate-300 dark:text-slate-600 mb-3" />
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
          Tópico no encontrado
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          El tema solicitado no existe o su identificador ha cambiado.
        </p>
        <button
          onClick={() => navigate('/quick-learn')}
          className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow-md hover:bg-amber-600 transition-colors cursor-pointer"
        >
          Volver a Quick Learn
        </button>
      </div>
    )
  }

  const catMeta = CATEGORY_METADATA[topic.category] || {
    label: topic.category,
    color: 'amber',
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 py-4 space-y-8 text-left">
      {/* ================= BARRA SUPERIOR DE NAVEGACIÓN ================= */}
      <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => navigate('/quick-learn')}
            className="hover:text-amber-500 transition-colors cursor-pointer"
          >
            Quick Learn
          </button>
          <span>/</span>
          <span className="text-slate-500">{topic.level}</span>
          <span>/</span>
          <span className="text-slate-500">{catMeta.label}</span>
          <span>/</span>
          <span className="text-amber-500">{topic.title_en}</span>
        </div>

        <button
          onClick={() => navigate('/quick-learn')}
          className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* ================= ENCABEZADO HERO DEL TÓPICO ================= */}
      <div className="w-full p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        {/* Badges superiores */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
              Nivel {topic.level}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {catMeta.label}
            </span>
          </div>

          {topic.estimated_reading_minutes && (
            <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
              <Clock size={13} />
              <span>~{topic.estimated_reading_minutes} min de lectura</span>
            </div>
          )}
        </div>

        {/* Títulos */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
          {topic.title_en}
        </h1>
        <p className="text-base md:text-lg font-bold text-amber-600 dark:text-amber-400 mb-4">
          {topic.title_es}
        </p>

        {/* Resumen pedagógico */}
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6 max-w-3xl">
          {topic.summary_es}
        </p>

        {/* Fórmula o Regla Esencial en caja destacada */}
        {topic.formula && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 shrink-0 flex items-center gap-1.5">
              <KeyRound size={14} /> Regla / Fórmula:
            </span>
            <span className="font-mono font-bold text-sm md:text-base break-words">
              {topic.formula}
            </span>
          </div>
        )}
      </div>

      {/* ================= TEORÍA Y USOS COMUNICATIVOS ================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna A: Fundamentos Teóricos */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-start">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-blue-500" />
            <span>Explicación y Fundamentos</span>
          </h2>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            {topic.theory_es?.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Columna B: Usos Reales en la Vida Cotidiana */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-start">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>¿Cuándo y cómo se utiliza?</span>
          </h2>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
            {topic.uses_es?.map((useCase, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= FORMAS DE CONSTRUCCIÓN (AFIRMATIVA, NEGATIVA, PREGUNTA) ================= */}
      {topic.constructions && (
        <div className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Tag size={16} className="text-purple-500" />
            <span>Estructuras de Construcción Oracional</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Afirmativa */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                🟢 Forma Afirmativa
              </span>
              <p className="font-mono font-bold text-xs md:text-sm text-emerald-900 dark:text-emerald-200 mt-1">
                {topic.constructions.affirmative}
              </p>
            </div>

            {/* Negativa */}
            <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
                🔴 Forma Negativa
              </span>
              <p className="font-mono font-bold text-xs md:text-sm text-rose-900 dark:text-rose-200 mt-1">
                {topic.constructions.negative}
              </p>
            </div>

            {/* Interrogativa */}
            <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">
                🔵 Pregunta / Interrogativa
              </span>
              <p className="font-mono font-bold text-xs md:text-sm text-blue-900 dark:text-blue-200 mt-1">
                {topic.constructions.question}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SEÑALES / PALABRAS CLAVE (SIGNALS) ================= */}
      {topic.signals && topic.signals.length > 0 && (
        <div className="w-full p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Marcadores Clave y Palabras de Señal (Signals)
          </h2>
          <div className="flex flex-wrap gap-2">
            {topic.signals.map((signal, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs border border-slate-200 dark:border-slate-700"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ================= DESGLOSE CROMÁTICO DE ORACIONES MODELO ================= */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <span>Composición Oracional con Roles y Colores</span>
          </h2>
          <span className="text-[11px] font-medium text-slate-400">
            Haz clic en el altavoz para escuchar con Piper TTS
          </span>
        </div>

        <div className="space-y-4">
          {topic.examples?.map((example, idx) => (
            <SentenceColorBreakdown
              key={idx}
              sentence={example}
              onPlayAudio={handlePlayAudio}
              isPlaying={playingAudioText === example.en}
            />
          ))}
        </div>
      </div>

      {/* ================= ERRORES FRECUENTES Y CONTRASTES (PITFALLS) ================= */}
      {topic.pitfalls && topic.pitfalls.length > 0 && (
        <div className="w-full p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-800/80 space-y-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Contrastes Clave y Errores Habituales
            </h2>
          </div>

          <div className="space-y-4">
            {topic.pitfalls.map((pitfall, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 space-y-3"
              >
                {/* Frase incorrecta vs correcta */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold text-xs shrink-0">
                      ❌ Incorrecto o confuso
                    </span>
                    <span className="font-mono font-medium text-slate-600 dark:text-slate-400 line-through text-sm">
                      {pitfall.incorrect}
                    </span>
                  </div>

                  {pitfall.correct && (
                    <div className="flex items-start gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs shrink-0">
                        ✔️ Estándar
                      </span>
                      <div className="flex-1">
                        <SentenceColorBreakdown
                          sentence={pitfall.correct}
                          onPlayAudio={handlePlayAudio}
                          isPlaying={playingAudioText === pitfall.correct.en}
                          showLabel={false}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Explicación pedagógica */}
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  💡 {pitfall.explanation_es}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ACTIVIDADES INTERACTIVAS DE REPASO ================= */}
      {exercises && exercises.length > 0 && (
        <div className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Actividades Rápidas de Repaso ({exercises.length})
            </h2>
          </div>

          <div className="space-y-4">
            {exercises.map((ex) => {
              const isRevealed = revealedAnswers[ex.id]

              return (
                <div
                  key={ex.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {ex.prompt_es}
                  </p>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-700 dark:text-slate-300">
                    👉 {ex.input}
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleRevealAnswer(ex.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {isRevealed ? (
                        <>
                          <ChevronUp size={14} /> Ocultar Respuesta Modelo
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} /> Ver Respuesta Modelo y Explicación
                        </>
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2 overflow-hidden"
                      >
                        {ex.model_answer && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              Respuesta sugerida:
                            </span>
                            <SentenceColorBreakdown
                              sentence={ex.model_answer}
                              onPlayAudio={handlePlayAudio}
                              isPlaying={playingAudioText === ex.model_answer.en}
                              showLabel={false}
                            />
                          </div>
                        )}

                        {ex.feedback_es && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pl-3 border-l-2 border-indigo-500">
                            {ex.feedback_es}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= TAREA DE TRANSFERENCIA PERSONAL (PRACTICE) ================= */}
      {topic.practice_es && (
        <div className="w-full p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/80 space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <Sparkles size={14} />
            <span>Práctica Personal de Transferencia</span>
          </h2>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {topic.practice_es}
          </p>
        </div>
      )}

      {/* ================= NAVEGACIÓN ANTERIOR / SIGUIENTE ================= */}
      <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        {adjacent.prevTopic ? (
          <button
            onClick={() => navigate(`/quick-learn/${adjacent.prevTopic.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer group text-left"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">
                Tema Anterior
              </span>
              <span className="group-hover:text-amber-500 transition-colors">
                {adjacent.prevTopic.title_en}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {adjacent.nextTopic ? (
          <button
            onClick={() => navigate(`/quick-learn/${adjacent.nextTopic.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer group text-right"
          >
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">
                Tema Siguiente
              </span>
              <span className="group-hover:text-amber-500 transition-colors">
                {adjacent.nextTopic.title_en}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
