import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Headphones, PenTool, CheckSquare, BookOpen, Sparkles } from 'lucide-react'

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
      className="flex flex-col items-center max-w-4xl w-full px-4"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          FORGE <span className="text-primary">ENGLISH</span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
          Entrena tu inglés con ejercicios generados por NLP y audio neuronal local
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Modalidad 1: Escuchar / Listening (NUEVA FASE 3) */}
        <div className="flex flex-col gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500 text-white shadow-xs">
              Neural Audio
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-1">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Listening</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Escucha y completa</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Entrena el oído con pronunciación humana de Piper TTS y escribe la palabra que falta.
          </p>

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => startExercise('sencilla', 'listen')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all active:scale-98 text-left flex justify-between items-center"
            >
              <span>Sencilla (Aleatoria)</span>
              <span className="text-[10px] opacity-70">A1 - B1</span>
            </button>
            <button
              onClick={() => startExercise('dificil', 'listen')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xs active:scale-98 text-left flex justify-between items-center"
            >
              <span>Difícil (Palabra clave)</span>
              <span className="text-[10px] opacity-90">B2 - C2</span>
            </button>
          </div>
        </div>

        {/* Modalidad 2: Escribir (Fill in the Blank) */}
        <div className="flex flex-col gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 text-primary mb-1">
            <div className="p-2.5 rounded-2xl bg-primary/10 dark:bg-primary/20">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Escribir</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Rellenar huecos</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Lee la oración con la palabra oculta y deduce la respuesta según el contexto sintáctico.
          </p>

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => startExercise('sencilla', 'fill')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-98 text-left flex justify-between items-center"
            >
              <span>Sencilla</span>
              <span className="text-[10px] text-slate-400">Palabra al azar</span>
            </button>
            <button
              onClick={() => startExercise('dificil', 'fill')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary-hover transition-all shadow-xs active:scale-98 text-left flex justify-between items-center"
            >
              <span>Difícil</span>
              <span className="text-[10px] opacity-90">Palabra más rara</span>
            </button>
          </div>
        </div>

        {/* Modalidad 3: Múltiple Opción */}
        <div className="flex flex-col gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-1">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Opciones</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Múltiple elección</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Elige la opción correcta entre distractores inteligentes generados por vectores spaCy.
          </p>

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => startExercise('sencilla', 'choice')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-98 text-left flex justify-between items-center"
            >
              <span>Sencilla</span>
              <span className="text-[10px] text-slate-400">Palabra al azar</span>
            </button>
            <button
              onClick={() => startExercise('dificil', 'choice')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs active:scale-98 text-left flex justify-between items-center"
            >
              <span>Difícil</span>
              <span className="text-[10px] opacity-90">Distractores cercanos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Botón Diccionario */}
      <div className="w-full mt-6">
        <button 
          onClick={() => navigate('/dictionary')}
          className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 p-5 rounded-3xl shadow-xs hover:border-primary hover:bg-primary/5 dark:hover:border-primary dark:hover:bg-primary/5 transition-all group flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors block">
                Explorar Diccionario (Master Data)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Filtra más de 1,000,000 de palabras por CEFR, clases gramaticales, temas y frecuencia
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-primary px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
            Abrir →
          </span>
        </button>
      </div>
    </motion.div>
  )
}
