import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Layout,
  Clock,
  Palette,
  Users,
  Compass,
  Link as LinkIcon,
  Search,
  X,
  BookOpen,
  ArrowRight,
  GitFork,
  MessageSquare,
  Layers,
  FileText,
  Mic,
  BookMarked,
  Volume2,
  Award,
  HelpCircle,
  Headphones,
  CheckCircle2,
  Share2,
  Globe,
  GraduationCap,
} from 'lucide-react'
import {
  getAllTopics,
  CATEGORY_METADATA,
  LEVEL_METADATA,
} from '../core/services/curriculumService'

const CATEGORY_ICONS = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Layout: <Layout className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  GitFork: <GitFork className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Link: <LinkIcon className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Mic: <Mic className="w-4 h-4" />,
  BookMarked: <BookMarked className="w-4 h-4" />,
  Volume2: <Volume2 className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  Share2: <Share2 className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
}

export const QuickLearnPage = () => {
  const navigate = useNavigate()
  const [allTopics, setAllTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Carga asíncrona del catálogo de tópicos
  useEffect(() => {
    let isMounted = true
    getAllTopics().then((topics) => {
      if (isMounted) {
        setAllTopics(topics)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Agrupación y conteos por nivel
  const levelCounts = useMemo(() => {
    const counts = { all: allTopics.length }
    allTopics.forEach((t) => {
      counts[t.level] = (counts[t.level] || 0) + 1
    })
    return counts
  }, [allTopics])

  // Agrupación y conteos por categoría
  const categoryCounts = useMemo(() => {
    const counts = { all: allTopics.length }
    allTopics.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return counts
  }, [allTopics])

  // Filtrado reactivo en tiempo real
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return allTopics.filter((topic) => {
      const matchesLevel = selectedLevel === 'all' || topic.level === selectedLevel
      const matchesCategory =
        selectedCategory === 'all' || topic.category === selectedCategory

      if (!query) return matchesLevel && matchesCategory

      const matchesQuery =
        topic.title_en?.toLowerCase().includes(query) ||
        topic.title_es?.toLowerCase().includes(query) ||
        topic.formula?.toLowerCase().includes(query) ||
        topic.summary_es?.toLowerCase().includes(query) ||
        topic.signals?.some((sig) => sig.toLowerCase().includes(query)) ||
        topic.search_terms?.some((st) => st.toLowerCase().includes(query)) ||
        topic.examples?.some(
          (ex) =>
            ex.en?.toLowerCase().includes(query) ||
            ex.es?.toLowerCase().includes(query)
        )

      return matchesLevel && matchesCategory && matchesQuery
    })
  }, [allTopics, selectedLevel, selectedCategory, searchQuery])

  // Lista de categorías disponibles según los datos
  const availableCategories = useMemo(() => {
    const cats = ['all', ...Object.keys(CATEGORY_METADATA).filter((k) => k !== 'all')]
    return cats.filter((cat) => cat === 'all' || (categoryCounts[cat] || 0) > 0)
  }, [categoryCounts])

  const getLevelBadgeColor = (level) => {
    const colors = {
      A1: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
      A2: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800',
      B1: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800',
      B2: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800',
      C1: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800',
      C2: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800',
    }
    return colors[level] || 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl px-4 py-4">
      {/* ================= ENCABEZADO PRINCIPAL ================= */}
      <div className="text-center mb-8 w-full max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-xs mb-3 border border-amber-300 dark:border-amber-800/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Base de Conocimiento Curricular Completa • 100 Tópicos</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          QUICK <span className="text-amber-500">LEARN</span> ⚡
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
          Aprende inglés de forma visual y pedagógica con desgloses oracionales por colores, guías de tiempos verbales, orden de adjetivos, voz pasiva y audios integrados con Piper TTS.
        </p>
      </div>

      {/* ================= BARRA DE BÚSQUEDA Y FILTROS ================= */}
      <div className="w-full flex flex-col gap-5 mb-8">
        {/* Input de Búsqueda */}
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por tiempo, fórmula (ej. S-V-O, OSASCOMP), regla o ejemplo..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-amber-500 dark:focus:border-amber-500 outline-none text-slate-900 dark:text-white font-medium text-sm transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selector de Niveles MCER (A1 a C2) */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Filtrar por Nivel MCER
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.keys(LEVEL_METADATA).map((lvlKey) => {
              const lvl = LEVEL_METADATA[lvlKey]
              const count = levelCounts[lvlKey] || 0
              const isSelected = selectedLevel === lvlKey

              return (
                <button
                  key={lvlKey}
                  onClick={() => setSelectedLevel(lvlKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{lvl.badge}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Categorías Temáticas */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Categorías Gramaticales y Habilidades
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
            {availableCategories.map((catKey) => {
              const meta = CATEGORY_METADATA[catKey] || {
                label: catKey,
                icon: 'BookOpen',
              }
              const isSelected = selectedCategory === catKey
              const count = categoryCounts[catKey] || 0

              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {CATEGORY_ICONS[meta.icon] || <BookOpen className="w-3.5 h-3.5" />}
                  <span>{meta.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ================= CONTADOR DE RESULTADOS ================= */}
      <div className="w-full flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 px-2">
        <span>
          Mostrando{' '}
          <strong className="text-amber-600 dark:text-amber-400">
            {filteredTopics.length}
          </strong>{' '}
          de {allTopics.length} temas
        </span>
        {(selectedLevel !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedLevel('all')
              setSelectedCategory('all')
              setSearchQuery('')
            }}
            className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Restablecer filtros
          </button>
        )}
      </div>

      {/* ================= LISTA DE TARJETAS DE TÓPICOS ================= */}
      {loading ? (
        <div className="w-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Sparkles className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Cargando base pedagógica de 100 tópicos...
          </h3>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="w-full text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">
            No se encontraron guías
          </h3>
          <p className="text-xs text-slate-500">
            Intenta con otra palabra clave o selecciona otro nivel o categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <AnimatePresence>
            {filteredTopics.map((topic, index) => {
              const catMeta = CATEGORY_METADATA[topic.category] || {
                label: topic.category,
              }

              return (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  onClick={() => navigate(`/quick-learn/${topic.id}`)}
                  className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden text-left"
                >
                  {/* Badges superiores: Nivel y Categoría */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getLevelBadgeColor(
                          topic.level
                        )}`}
                      >
                        {topic.level}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {catMeta.label}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-400 group-hover:text-amber-500 transition-colors flex items-center gap-1">
                      Abrir{' '}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Título en Inglés y Subtítulo en Español */}
                  <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors mb-1">
                    {topic.title_en}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    {topic.title_es}
                  </p>

                  {/* Resumen pedagógico */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {topic.summary_es}
                  </p>

                  {/* Fórmula / Regla sintética */}
                  {topic.formula && (
                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 truncate">
                        <span className="shrink-0">🔑</span>
                        <span className="truncate">{topic.formula}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
