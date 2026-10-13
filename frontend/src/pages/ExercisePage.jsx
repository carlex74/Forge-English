import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchExercise, evaluateExercise, explainSentence } from '../core/services/exerciseService'
import { ExerciseSentence } from '../components/exercise/ExerciseSentence'

export const ExercisePage = () => {
  const { difficulty, mode } = useParams()
  const queryClient = useQueryClient()
  const inputRef = useRef(null)

  const [userAnswer, setUserAnswer] = useState('')
  const [evaluationStatus, setEvaluationStatus] = useState(null)
  const [exerciseCount, setExerciseCount] = useState(0)
  const [explanation, setExplanation] = useState(null)

  const prefetchedCountRef = useRef(-1)
  const isTransitioningRef = useRef(false)

  // Fetching de la oración actual con staleTime: Infinity para evitar refetch automático de endpoints aleatorios
  const { data: exerciseData, isLoading, isError } = useQuery({
    queryKey: ['exercise', difficulty, mode, exerciseCount],
    queryFn: fetchExercise,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // Prefetch de la SIGUIENTE oración en segundo plano (exactamente una vez por ejercicio)
  useEffect(() => {
    if (exerciseData && prefetchedCountRef.current !== exerciseCount) {
      prefetchedCountRef.current = exerciseCount
      queryClient.prefetchQuery({
        queryKey: ['exercise', difficulty, mode, exerciseCount + 1],
        queryFn: fetchExercise,
        staleTime: Infinity,
      })
    }
  }, [exerciseData, difficulty, mode, exerciseCount, queryClient])

  // Reset del contador de prefetch si cambia la dificultad o modo
  useEffect(() => {
    prefetchedCountRef.current = -1
    setExerciseCount(0)
  }, [difficulty, mode])

  const getTargetWord = () => {
    if (!exerciseData?.exercise) return ""
    return exerciseData.exercise.targets ? exerciseData.exercise.targets[0] : exerciseData.exercise.target_word
  }

  // React Query: Mutación para evaluar la respuesta
  const evaluateMutation = useMutation({
    mutationFn: evaluateExercise,
    onSuccess: (data) => {
      if (data.is_correct) {
        setEvaluationStatus('correct')
      } else {
        setEvaluationStatus('incorrect')
      }
      setUserAnswer(getTargetWord()) // Mostrar palabra completa o correcta
    }
  })

  const isInputWrong = () => {
    const target = getTargetWord().toLowerCase()
    const input = userAnswer.toLowerCase()
    if (!input) return false
    return !target.startsWith(input)
  }

  const explainMutation = useMutation({
    mutationFn: explainSentence,
    onSuccess: (data) => {
      setExplanation(data.breakdown)
    }
  })

  const handleExplain = () => {
    if (!exerciseData?.exercise) return
    const originalText = exerciseData.exercise.original_sentence || exerciseData.original_sentence
    explainMutation.mutate(originalText || exerciseData.exercise.original_sentence)
  }

  const handleNext = () => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setEvaluationStatus(null)
    setUserAnswer('')
    setExplanation(null)
    setExerciseCount(c => c + 1)
    setTimeout(() => {
      isTransitioningRef.current = false
    }, 300)
  }

  // Permite avanzar con Enter cuando ya está evaluado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && evaluationStatus !== null) {
        e.preventDefault()
        e.stopPropagation()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [evaluationStatus])

  // Forzar foco en el input al cargar una nueva oración o al continuar
  useEffect(() => {
    if (evaluationStatus === null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [exerciseData, evaluationStatus])

  return (
    <motion.div 
      key="exercise"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center max-w-3xl w-full gap-8"
    >
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-3xl shadow-sm min-h-[200px] flex items-center justify-center">
        <ExerciseSentence 
          exerciseData={exerciseData}
          isLoading={isLoading}
          isError={isError}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          evaluationStatus={evaluationStatus}
          evaluateMutation={evaluateMutation}
          handleNext={handleNext}
          getTargetWord={getTargetWord}
          isInputWrong={isInputWrong}
          inputRef={inputRef}
          handleExplain={handleExplain}
          explanation={explanation}
          isExplaining={explainMutation.isPending}
        />
      </div>

      {exerciseData?.exercise && !isLoading && !isError && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800"
        >
          <p className="text-slate-400 dark:text-slate-500 font-bold tracking-widest text-xs uppercase mb-2">Traducción</p>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 font-medium">
            {exerciseData.exercise.traduced_sentence || exerciseData.traduced_sentence}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
