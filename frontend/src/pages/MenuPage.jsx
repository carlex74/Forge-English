import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export const MenuPage = () => {
  const navigate = useNavigate()

  const startExercise = (diff, mode) => {
    navigate(`/exercise/${diff}/${mode}`)
  }

  return (
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
        Selecciona una modalidad y dificultad
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4 justify-center">
        <button 
          onClick={() => startExercise('sencilla', 'fill')}
          className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-primary dark:hover:border-primary transition-all group flex flex-col items-center justify-center text-center gap-2 min-h-[120px]"
        >
          <span className="text-xl font-bold group-hover:text-primary transition-colors text-slate-800 dark:text-slate-100">Sencilla (Escribir)</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">Oculta una palabra al azar</span>
        </button>

        <button 
          onClick={() => startExercise('dificil', 'fill')}
          className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-primary dark:hover:border-primary transition-all group flex flex-col items-center justify-center text-center gap-2 min-h-[120px]"
        >
          <span className="text-xl font-bold group-hover:text-primary transition-colors text-slate-800 dark:text-slate-100">Difícil (Escribir)</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">Oculta la palabra más rara</span>
        </button>

        <button 
          onClick={() => startExercise('sencilla', 'choice')}
          className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-primary dark:hover:border-primary transition-all group flex flex-col items-center justify-center text-center gap-2 min-h-[120px]"
        >
          <span className="text-xl font-bold group-hover:text-primary transition-colors text-slate-800 dark:text-slate-100">Sencilla (Opciones)</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">Múltiple opción - aleatorio</span>
        </button>

        <button 
          onClick={() => startExercise('dificil', 'choice')}
          className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:border-primary dark:hover:border-primary transition-all group flex flex-col items-center justify-center text-center gap-2 min-h-[120px]"
        >
          <span className="text-xl font-bold group-hover:text-primary transition-colors text-slate-800 dark:text-slate-100">Difícil (Opciones)</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">Múltiple opción - palabra rara</span>
        </button>
        
        <div className="col-span-1 sm:col-span-2 pt-4">
          <button 
            onClick={() => navigate('/dictionary')}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:border-primary hover:bg-primary/5 dark:hover:border-primary dark:hover:bg-primary/5 transition-all group flex flex-col items-center justify-center text-center gap-2"
          >
            <span className="text-xl font-bold group-hover:text-primary transition-colors text-slate-800 dark:text-slate-100">Explorar Diccionario</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Busca y filtra más de 77.000 palabras por nivel y gramática</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
