import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  HelpCircle, 
  BookOpen, 
  Volume2, 
  Headphones, 
  Pause, 
  Play, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Sparkles
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { fetchWordDefinition, getAudioTtsUrl } from '../../core/services/exerciseService'

import { useState, useEffect, useRef } from 'react'

export const ExerciseSentence = ({
  exerciseData,
  isLoading,
  isError,
  userAnswer,
  setUserAnswer,
  evaluationStatus,
  evaluateMutation,
  handleNext,
  getTargetWord,
  isInputWrong,
  inputRef,
  handleExplain,
  explanation,
  isExplaining
}) => {
  const [showSyntax, setShowSyntax] = useState(false)
  const [wordDef, setWordDef] = useState(null)
  const [isFetchingDef, setIsFetchingDef] = useState(false)
  
  // Audio con Piper TTS
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [hideContextText, setHideContextText] = useState(false)
  const audioRef = useRef(null)

  const isAudioCompletion = exerciseData?.exercise?.type === "AUDIO_COMPLETION"
  const isMultipleChoice = exerciseData?.exercise?.type === "MULTIPLE_CHOICE"

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlayingAudio(false)
  }

  const playPiperAudio = (text, speed = playbackSpeed) => {
    if (!text) return
    stopAudio()
    
    setIsPlayingAudio(true)
    const url = getAudioTtsUrl(text)
    const audio = new Audio(url)
    audio.playbackRate = speed
    audio.onended = () => setIsPlayingAudio(false)
    audio.onerror = () => {
      setIsPlayingAudio(false)
      toast.error('Error al reproducir audio neuronal de Piper.')
    }
    audioRef.current = audio
    audio.play().catch(e => {
      console.warn('Audio play error:', e)
      setIsPlayingAudio(false)
    })
  }

  // Reproducir oración completa actual
  const handlePlaySentenceAudio = (speed = playbackSpeed) => {
    if (!exerciseData) return
    const sentence = exerciseData.exercise?.original_sentence || exerciseData.original_sentence
    if (sentence) {
      playPiperAudio(sentence, speed)
    }
  }

  // Reproducir solo la palabra objetivo
  const handlePlayTargetWord = (speed = playbackSpeed) => {
    const target = getTargetWord()
    if (target) {
      playPiperAudio(target, speed)
    }
  }

  // Desactivar sintaxis y auto-reproducir audio al cambiar de ejercicio
  useEffect(() => {
    setShowSyntax(false)
    setWordDef(null)
    setIsFetchingDef(false)
    stopAudio()

    if (isAudioCompletion && exerciseData) {
      const sentence = exerciseData.exercise?.original_sentence || exerciseData.original_sentence
      if (sentence) {
        const timer = setTimeout(() => {
          handlePlaySentenceAudio(playbackSpeed)
        }, 300)
        return () => clearTimeout(timer)
      }
    }
  }, [exerciseData?.id_sentence, isAudioCompletion])

  // Limpieza al desmontar
  useEffect(() => {
    return () => stopAudio()
  }, [])

  if (isLoading) return <p className="animate-pulse text-slate-500 dark:text-slate-400 font-medium">Cargando ejercicio...</p>
  if (isError || !exerciseData?.exercise) return <p className="text-error font-medium">Error al cargar. Asegúrate de tener FastAPI corriendo.</p>

  const { exercise } = exerciseData
  const maskedSentence = exercise.masked_sentence || ""
  const originalSentence = exercise.original_sentence || exerciseData.original_sentence || ""
  const parts = maskedSentence.split('___')

  const handleHint = () => {
    if (!exercise?.hints) return
    if (exercise.hints.length > 0) {
      toast('Pista: ' + exercise.hints.join(', '), { icon: '💡', style: { background: '#3b82f6', color: '#fff' } })
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (evaluationStatus !== null) {
      handleNext()
      return
    }
    if (!userAnswer.trim()) return

    evaluateMutation.mutate({
      user_answer: userAnswer,
      target_word: getTargetWord()
    })
  }

  const handleOptionSelect = (option) => {
    if (evaluationStatus !== null) return
    setUserAnswer(option)
    evaluateMutation.mutate({
      user_answer: option,
      target_word: getTargetWord()
    })
  }

  const inputColorClass = () => {
    if (evaluationStatus === 'correct') return 'text-green-500 border-green-500 bg-green-50 dark:bg-green-900/20'
    if (evaluationStatus === 'incorrect') return 'text-red-500 border-red-500 bg-red-50 dark:bg-red-900/20'
    return isInputWrong() ? 'text-error border-error focus:border-error' : (userAnswer ? 'text-primary border-primary' : 'text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:border-primary')
  }

  const getPosColor = (pos) => {
    const colors = {
      VERB: 'text-blue-500 border-blue-500',
      AUX: 'text-blue-400 border-blue-400',
      NOUN: 'text-orange-500 border-orange-500',
      PRON: 'text-purple-500 border-purple-500',
      ADJ: 'text-green-500 border-green-500',
      ADV: 'text-pink-500 border-pink-500',
      ADP: 'text-teal-500 border-teal-500',
      DET: 'text-yellow-500 border-yellow-500',
      SCONJ: 'text-indigo-500 border-indigo-500',
      CCONJ: 'text-indigo-500 border-indigo-500',
    }
    return colors[pos] || 'text-slate-400 border-slate-400'
  }

  const onToggleSyntax = () => {
    if (!explanation && !isExplaining) {
      handleExplain()
    }
    setShowSyntax(!showSyntax)
  }

  const handleExplainWord = async () => {
    if (wordDef) {
      setWordDef(null)
      return
    }
    
    setIsFetchingDef(true)
    const target = getTargetWord()
    const cleanTarget = target.replace(/[^a-zA-Z0-9]/g, '')
    
    const def = await fetchWordDefinition(cleanTarget)
    if (def) {
      setWordDef(def)
    } else {
      toast.error('No se encontró definición para esta palabra.')
    }
    setIsFetchingDef(false)
  }

  const playExternalAudio = (audioUrl) => {
    if (!audioUrl) return
    const audio = new Audio(audioUrl)
    audio.play()
  }

  // Calcular rangos objetivos (maneja single target, múltiple targets y fallback por texto)
  const targetWord = (getTargetWord() || '').trim()
  let targetRanges = []

  if (exercise?.targets && Array.isArray(exercise.targets) && exercise.targets.length > 0) {
    targetRanges = exercise.targets.map(t => ({
      start: t.start_char,
      end: t.end_char,
      word: t.target_word
    }))
  } else if (exercise?.start_char !== undefined && exercise?.end_char !== undefined) {
    targetRanges = [{
      start: exercise.start_char,
      end: exercise.end_char,
      word: exercise.target_word || targetWord
    }]
  } else if (targetWord && originalSentence) {
    const idx = originalSentence.toLowerCase().indexOf(targetWord.toLowerCase())
    if (idx !== -1) {
      targetRanges = [{
        start: idx,
        end: idx + targetWord.length,
        word: targetWord
      }]
    }
  }

  const isTokenInTarget = (token) => {
    if (!token) return false

    // 1. Verificación por solapamiento de intervalos de caracteres [start_char, end_char]
    if (token.start_char !== undefined && token.end_char !== undefined && targetRanges.length > 0) {
      for (const range of targetRanges) {
        if (range.start !== undefined && range.end !== undefined) {
          if (Math.max(token.start_char, range.start) < Math.min(token.end_char, range.end)) {
            return true
          }
        }
      }
    }

    // 2. Fallback por coincidencia exacta de palabra limpia
    const cleanTok = (token.word || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    if (!cleanTok) return false

    for (const range of targetRanges) {
      const cleanRange = (range.word || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      if (cleanRange && cleanRange === cleanTok) {
        return true
      }
    }

    if (targetWord) {
      const cleanTarget = targetWord.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      if (cleanTarget && cleanTarget === cleanTok) {
        return true
      }
    }

    return false
  }

  // Agrupar tokens de explicación para no partir contracciones ni revelar palabras en el desglose sintáctico
  const getSyntaxItems = () => {
    if (!explanation || !Array.isArray(explanation)) return []

    const items = []
    let i = 0

    while (i < explanation.length) {
      const token = explanation[i]
      if (isTokenInTarget(token)) {
        // Absorber todos los tokens contiguos que formen parte de la palabra objetivo (ej: "ca" + "n't")
        const targetTokens = [token]
        let j = i + 1
        while (j < explanation.length && isTokenInTarget(explanation[j])) {
          targetTokens.push(explanation[j])
          j++
        }

        const posLabels = targetTokens.map(t => t.pos_es).filter(Boolean).join(' / ') || 'Objetivo'
        const primaryPos = targetTokens[0]?.pos

        items.push({
          id: `target-${i}`,
          isTarget: true,
          pos_es: posLabels,
          pos: primaryPos
        })
        i = j
      } else {
        items.push({
          id: `token-${i}`,
          isTarget: false,
          word: token.word,
          pos_es: token.pos_es,
          pos: token.pos
        })
        i++
      }
    }

    return items
  }

  // Componente interno para renderizar el input o la respuesta
  const InputElement = () => (
    isMultipleChoice ? (
      evaluationStatus !== null ? (
        <span className={`inline-block min-w-[100px] border-b-4 font-bold px-3 py-1 text-center rounded mx-2 ${inputColorClass()}`}>
          {getTargetWord()}
        </span>
      ) : (
        <span className="inline-block min-w-[100px] border-b-4 border-slate-300 dark:border-slate-700 mx-2"></span>
      )
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        autoFocus
        disabled={evaluationStatus !== null || evaluateMutation.isPending}
        placeholder="escribe aquí..."
        className={`w-40 md:w-48 px-3 py-1 mx-2 text-center bg-slate-100 dark:bg-slate-800 border-b-4 rounded outline-none transition-colors font-black align-middle ${inputColorClass()}`}
      />
    )
  )

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* ================= BARRA SUPERIOR DE HERRAMIENTAS ================= */}
      <div className="w-full flex items-center justify-between gap-3">
        {/* Controles de Audio Piper TTS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => isPlayingAudio ? stopAudio() : handlePlaySentenceAudio(playbackSpeed)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              isPlayingAudio 
                ? 'bg-indigo-600 text-white animate-pulse' 
                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
            }`}
            title="Escuchar oración completa con voz neuronal Piper TTS"
          >
            {isPlayingAudio ? <Pause size={14} /> : <Volume2 size={14} />}
            <span>{isPlayingAudio ? 'Pausar' : 'Escuchar'}</span>
          </button>

          {/* Toggle de velocidad de audio (1.0x vs 0.75x) */}
          <button
            type="button"
            onClick={() => {
              const newSpeed = playbackSpeed === 1.0 ? 0.75 : 1.0
              setPlaybackSpeed(newSpeed)
              if (isPlayingAudio) handlePlaySentenceAudio(newSpeed)
            }}
            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs transition-colors border ${
              playbackSpeed === 0.75
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Velocidad de reproducción"
          >
            {playbackSpeed}x
          </button>

          {/* En modo listening: Botón para ocultar/mostrar texto circundante */}
          {isAudioCompletion && evaluationStatus === null && (
            <button
              type="button"
              onClick={() => setHideContextText(!hideContextText)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Ocultar o mostrar texto para mayor desafío auditivo"
            >
              {hideContextText ? <Eye size={14} /> : <EyeOff size={14} />}
              <span className="hidden sm:inline">{hideContextText ? 'Mostrar texto' : 'Solo audio'}</span>
            </button>
          )}
        </div>

        {/* Botón de Sintaxis */}
        <button
          type="button"
          onClick={onToggleSyntax}
          disabled={isExplaining && !explanation}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
            showSyntax 
              ? 'bg-indigo-500 text-white shadow-md' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span>{isExplaining && !explanation ? 'Analizando...' : 'Sintaxis 🧠'}</span>
        </button>
      </div>

      {/* ================= BANNER DESTACADO PARA MODO LISTENING ================= */}
      {isAudioCompletion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-800/80"
        >
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isPlayingAudio ? 'bg-indigo-600 text-white animate-bounce' : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'}`}>
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                Ejercicio de Escucha (Listening)
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">Piper TTS</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isPlayingAudio 
                  ? 'Reproduciendo pronunciación...' 
                  : 'Escucha con atención y escribe la palabra faltante.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handlePlaySentenceAudio(playbackSpeed)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <RotateCcw size={14} />
            <span>Repetir Audio</span>
          </button>
        </motion.div>
      )}

      {/* ================= ZONA DE LA ORACIÓN O DESGLOSE ================= */}
      {!showSyntax || !explanation ? (
        <form onSubmit={handleSubmit} className="text-xl md:text-2xl font-medium leading-[3.5rem] text-center text-slate-800 dark:text-slate-100 w-full py-2">
          {hideContextText && isAudioCompletion && evaluationStatus === null ? (
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                🎧 Escucha el audio y escribe la palabra que falta:
              </span>
              <div className="flex items-center justify-center gap-3">
                <InputElement />
                <button
                  type="submit"
                  disabled={evaluateMutation.isPending || !userAnswer.trim()}
                  className="p-3 bg-primary hover:bg-primary-hover text-white rounded-2xl transition-all shadow-md disabled:opacity-50 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              {parts.map((part, index) => (
                <span key={index}>
                  {part}
                  {index === 0 && parts.length > 1 && <InputElement />}
                </span>
              ))}

              {!isMultipleChoice && evaluationStatus === null && (
                <div className="inline-flex gap-2 ml-4 align-middle">
                  <button
                    type="button"
                    onClick={handleHint}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors shadow-xs"
                    title="Pedir pista"
                  >
                    <HelpCircle size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={evaluateMutation.isPending || !userAnswer.trim()}
                    className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all shadow-md disabled:opacity-50 active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap gap-x-4 gap-y-6 justify-center items-end w-full py-2"
        >
          {getSyntaxItems().map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              {item.isTarget ? (
                <InputElement />
              ) : (
                <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                  {item.word}
                </span>
              )}
              <span className={`text-[10px] md:text-xs uppercase font-bold mt-1 border-t-2 pt-1 ${getPosColor(item.pos)}`}>
                {item.pos_es}
              </span>
            </div>
          ))}

          {!isMultipleChoice && evaluationStatus === null && (
            <div className="flex items-center gap-2 mb-1 ml-2">
              <button
                type="button"
                onClick={handleHint}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors shadow-xs"
                title="Pedir pista"
              >
                <HelpCircle size={18} />
              </button>
              <button
                type="submit"
                disabled={evaluateMutation.isPending || !userAnswer.trim()}
                className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all shadow-md disabled:opacity-50 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          )}
          <button type="submit" className="hidden" />
        </motion.form>
      )}

      {/* Opciones en modo Múltiple Opción */}
      {isMultipleChoice && exercise.options && evaluationStatus === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-2">
          {exercise.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              disabled={evaluateMutation.isPending}
              className="py-3 px-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-2xl font-bold text-slate-700 dark:text-slate-200 transition-all active:scale-95 disabled:opacity-50 shadow-xs"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* ================= ESTADO POST-EVALUACIÓN ================= */}
      {evaluationStatus !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 mt-2 w-full"
        >
          <div className="flex items-center gap-3">
            {evaluationStatus === 'correct' ? (
              <span className="px-4 py-1.5 rounded-full bg-green-500/15 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800 font-black text-sm uppercase tracking-wide">
                ✓ ¡Respuesta Correcta!
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full bg-red-500/15 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 font-black text-sm uppercase tracking-wide">
                ✕ Respuesta Incorrecta
              </span>
            )}

            {/* Botón para escuchar solo la palabra correcta con Piper */}
            <button
              type="button"
              onClick={() => handlePlayTargetWord(playbackSpeed)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              title="Escuchar pronunciación de la palabra objetivo"
            >
              <Volume2 size={14} />
              <span>Pronunciar "{getTargetWord()}"</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleExplainWord}
              type="button"
              className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-2xl transition-all shadow-xs active:scale-95 flex items-center gap-2"
            >
              {isFetchingDef ? 'Buscando...' : <><BookOpen size={18} /> Ver Definición</>}
            </button>
            
            <button
              onClick={handleNext}
              autoFocus
              className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-black text-sm rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              Siguiente (Enter) →
            </button>
          </div>
        </motion.div>
      )}

      {/* ================= TARJETA DE DEFINICIÓN Y FONÉTICA ================= */}
      <AnimatePresence>
        {wordDef && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-left mt-2"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white capitalize">{wordDef.word}</h3>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-base">{wordDef.phonetic}</span>
                {wordDef.phonetics?.find(p => p.audio) && (
                  <button 
                    onClick={() => playExternalAudio(wordDef.phonetics.find(p => p.audio).audio)}
                    className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                    title="Audio humano de diccionario"
                  >
                    <Volume2 size={20} />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {wordDef.meanings.slice(0, 2).map((meaning, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-indigo-500 italic mb-1.5 text-sm">{meaning.partOfSpeech}</p>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-300 text-sm">
                      {meaning.definitions.slice(0, 2).map((def, dIdx) => (
                        <li key={dIdx} className="leading-relaxed">
                          <span>{def.definition}</span>
                          {def.example && (
                            <p className="text-slate-500 dark:text-slate-400 italic mt-1 ml-6 border-l-2 border-slate-200 dark:border-slate-700 pl-3 text-xs">
                              "{def.example}"
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                    
                    {(meaning.synonyms?.length > 0 || meaning.antonyms?.length > 0) && (
                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs ml-2">
                        {meaning.synonyms?.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-500">Sinónimos: </span>
                            <span className="text-indigo-600 dark:text-indigo-400">{meaning.synonyms.slice(0, 4).join(', ')}</span>
                          </div>
                        )}
                        {meaning.antonyms?.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-500">Antónimos: </span>
                            <span className="text-rose-500 dark:text-rose-400">{meaning.antonyms.slice(0, 4).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
