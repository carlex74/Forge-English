import { motion } from 'framer-motion'
import { Send, HelpCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

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
  inputRef
}) => {
  if (isLoading) return <p className="animate-pulse text-slate-500 dark:text-slate-400">Cargando ejercicio...</p>
  if (isError || !exerciseData?.exercise) return <p className="text-error">Error al cargar. Asegúrate de tener FastAPI corriendo.</p>
  
  const { exercise } = exerciseData
  const maskedSentence = exercise.masked_sentence || ""
  const isMultipleChoice = exercise.type === "MULTIPLE_CHOICE"
  
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

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl font-medium leading-loose text-center text-slate-800 dark:text-slate-100">
        {parts.map((part, index) => (
          <span key={index} className="flex items-center gap-2">
            {part}
            {index === 0 && parts.length > 1 && (
              isMultipleChoice ? (
                evaluationStatus !== null ? (
                  <span className={`inline-block min-w-[100px] border-b-4 font-bold px-3 py-1 text-center rounded ${inputColorClass()}`}>
                    {getTargetWord()}
                  </span>
                ) : (
                  <span className="inline-block min-w-[100px] border-b-4 border-slate-300 dark:border-slate-700"></span>
                )
              ) : (
                <input 
                  ref={inputRef}
                  type="text" 
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  autoFocus
                  disabled={evaluationStatus !== null || evaluateMutation.isPending}
                  className={`w-36 md:w-40 px-3 py-1 text-center bg-slate-100 dark:bg-slate-800 border-b-4 rounded outline-none transition-colors font-bold ${inputColorClass()}`}
                />
              )
            )}
          </span>
        ))}
        
        {!isMultipleChoice && evaluationStatus === null && (
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
        )}
      </form>

      {isMultipleChoice && exercise.options && evaluationStatus === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-4">
          {exercise.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              disabled={evaluateMutation.isPending}
              className="py-3 px-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {evaluationStatus !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 mt-4"
        >
          {evaluationStatus === 'correct' ? (
            <p className="text-green-500 font-bold text-lg">¡Correcto!</p>
          ) : (
            <p className="text-red-500 font-bold text-lg">Incorrecto</p>
          )}
          <button 
            onClick={handleNext}
            autoFocus
            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            Siguiente (Enter)
          </button>
        </motion.div>
      )}
    </div>
  )
}
