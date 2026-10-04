import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { Moon, Sun, ArrowLeft, Send, HelpCircle } from 'lucide-react'

// Utilidad base para hacer fetching
const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [theme, setTheme] = useState('dark')
  const [screen, setScreen] = useState('menu') // 'menu' | 'exercise'
  const [difficulty, setDifficulty] = useState('sencilla')
  const [userAnswer, setUserAnswer] = useState('')
  const [exerciseCount, setExerciseCount] = useState(0) // Usado para el prefetching
  
  const queryClient = useQueryClient()

  // Manejo de tema (Dark Mode)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // Fetching de la oración actual
  const { data: exerciseData, isLoading, isError } = useQuery({
    queryKey: ['exercise', difficulty, exerciseCount],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/exercise/random?difficulty=${difficulty}&t=${Date.now()}`)
      if (!res.ok) throw new Error('Network error')
      return res.json()
    },
    enabled: screen === 'exercise',
  })

  // Prefetch de la SIGUIENTE oración en segundo plano
  useEffect(() => {
    if (screen === 'exercise' && exerciseData) {
      queryClient.prefetchQuery({
        queryKey: ['exercise', difficulty, exerciseCount + 1],
        queryFn: async () => {
          const res = await fetch(`${API_URL}/exercise/random?difficulty=${difficulty}&t=${Date.now()}`)
          if (!res.ok) throw new Error('Network error')
          return res.json()
        },
      })
    }
  }, [exerciseData, screen, difficulty, exerciseCount, queryClient])

  // React Query: Mutación para evaluar la respuesta
  const evaluateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/exercise/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Error al evaluar')
      return res.json()
    },
    onSuccess: (data) => {
      if (data.is_correct) {
        setUserAnswer('')
        setExerciseCount(c => c + 1)
      } else {
        toast.error('Incorrecto, inténtalo de nuevo.', { style: { background: '#f43f5e', color: '#fff' }})
      }
    }
  })

  const startExercise = (diff) => {
    setDifficulty(diff)
    setScreen('exercise')
    setUserAnswer('')
    setExerciseCount(0)
  }

  const getTargetWord = () => {
    if (!exerciseData?.exercise) return ""
    return exerciseData.exercise.targets ? exerciseData.exercise.targets[0] : exerciseData.exercise.target_word
  }

  const isInputWrong = () => {
    const target = getTargetWord().toLowerCase()
    const input = userAnswer.toLowerCase()
    if (!input) return false
    return !target.startsWith(input)
  }

  const handleHint = () => {
    if (!exerciseData?.exercise?.hints) return
    const hints = exerciseData.exercise.hints
    if (hints.length > 0) {
      toast('Pista: ' + hints.join(', '), { icon: '💡', style: { background: '#3b82f6', color: '#fff' } })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!userAnswer.trim() || !exerciseData) return

    evaluateMutation.mutate({
      user_answer: userAnswer,
      target_word: getTargetWord()
    })
  }

  // Desglosar la oración ocultando la palabra para mostrar el input en su lugar
  const renderSentenceWithInput = () => {
    if (isLoading) return <p className="animate-pulse text-slate-500 dark:text-slate-400">Cargando ejercicio...</p>
    if (isError || !exerciseData?.exercise) return <p className="text-error">Error al cargar. Asegúrate de tener FastAPI corriendo.</p>
    
    const { exercise } = exerciseData
    const maskedSentence = exercise.masked_sentence || ""
    
    const parts = maskedSentence.split('___')

    const inputColorClass = isInputWrong() ? 'text-error border-error focus:border-error' : (userAnswer ? 'text-primary border-primary' : 'text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:border-primary')

    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl font-medium leading-loose text-center text-slate-800 dark:text-slate-100">
        {parts.map((part, index) => (
          <span key={index} className="flex items-center gap-2">
            {part}
            {index === 0 && parts.length > 1 && (
              <input 
                type="text" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                autoFocus
                className={`w-36 md:w-40 px-3 py-1 text-center bg-slate-100 dark:bg-slate-800 border-b-4 rounded outline-none transition-colors font-bold ${inputColorClass}`}
              />
            )}
          </span>
        ))}
        
        <div className="flex gap-2 ml-4">
          <button 
            type="button"
            onClick={handleHint}
            className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
            title="Pedir pista"
          >
            <HelpCircle size={20} />
          </button>
          <button 
            type="submit" 
            disabled={evaluateMutation.isPending}
            className="p-2 bg-primary hover:bg-primary-hover text-white rounded-full transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative font-sans">
      <Toaster position="bottom-center" />

      {/* Header flotante */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div>
          {screen === 'exercise' && (
            <button 
              onClick={() => setScreen('menu')}
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-medium">Volver</span>
            </button>
          )}
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors border border-slate-300 dark:border-slate-700"
          title="Alternar entre blanco y negro"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Contenido principal animado */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {screen === 'menu' ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center max-w-2xl w-full"
            >
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-12">
                FORGE <span className="text-primary">ENGLISH</span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">
                Selecciona una dificultad
              </p>

              <div className="flex flex-col sm:flex-row gap-6 w-full px-4 justify-center">
                <button 
                  onClick={() => startExercise('sencilla')}
                  className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-primary dark:hover:border-primary transition-all group flex flex-col items-center justify-center text-center gap-2 min-h-[140px]"
                >
                  <span className="text-xl font-bold group-hover:text-primary transition-colors text-slate-800 dark:text-slate-100">Sencilla</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">(oculta una palabra al azar)</span>
                </button>

                <button 
                  onClick={() => startExercise('dificil')}
                  className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-primary dark:hover:border-primary transition-all group flex flex-col items-center justify-center text-center gap-2 min-h-[140px]"
                >
                  <span className="text-xl font-bold group-hover:text-primary transition-colors text-slate-800 dark:text-slate-100">Difícil</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">(oculta la palabra más rara)</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="exercise"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center max-w-3xl w-full gap-8"
            >
              <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-3xl shadow-sm min-h-[200px] flex items-center justify-center">
                {renderSentenceWithInput()}
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
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
