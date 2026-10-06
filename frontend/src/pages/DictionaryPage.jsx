import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTags, getWords } from '../core/services/dictionaryService'
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

const tagColorMap = {
  // Levels
  'A1': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  'A2': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'B1': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  'B2': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'C1': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
  'C2': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  
  // Grammar
  'noun': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'verb': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'adjective': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  'adverb': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  'pronoun': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  'preposition': 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300 border-stone-200 dark:border-stone-800',
  'conjunction': 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800',
  'determiner': 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800',
}

const defaultTagColor = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'

export const DictionaryPage = () => {
  const [words, setWords] = useState([])
  const [tags, setTags] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [page, setPage] = useState(0)
  const limit = 48
  
  // Search debounce
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0) // reset page on search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const t = await getTags()
        setTags(t)
      } catch (e) {
        console.error("Error fetching tags", e)
      }
    }
    fetchTags()
  }, [])

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true)
      try {
        const data = await getWords(page * limit, limit, debouncedSearch, selectedTag)
        setWords(data.items)
        setTotal(data.total)
      } catch (e) {
        console.error("Error fetching words", e)
      } finally {
        setLoading(false)
      }
    }
    fetchWords()
  }, [debouncedSearch, selectedTag, page])

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value)
    setPage(0)
  }

  const grammarTags = tags.filter(t => t.type === 'GRAMMAR')
  const levelTags = tags.filter(t => t.type === 'LEVEL')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col w-full max-w-6xl mx-auto h-[85vh]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Word Explorer <span className="text-primary text-xl font-bold bg-primary/10 px-3 py-1 rounded-full">{total}</span>
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar palabra..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
          
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={selectedTag} 
              onChange={handleTagChange}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Todos los filtros</option>
              <optgroup label="CEFR Levels">
                {levelTags.map(t => (
                  <option key={t.id} value={t.id}>{t.description} ({t.type})</option>
                ))}
              </optgroup>
              <optgroup label="Grammar">
                {grammarTags.map(t => (
                  <option key={t.id} value={t.id}>{t.description} ({t.type})</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : words.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p className="text-xl font-semibold mb-2">No se encontraron palabras</p>
            <p>Intenta cambiar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {words.map((w) => (
              <motion.div 
                key={w.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                <div className="text-lg font-bold text-slate-900 dark:text-white truncate" title={w.word}>
                  {w.word}
                </div>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {w.tags.map(tag => {
                    const colorClass = tagColorMap[tag.description] || defaultTagColor
                    return (
                      <span 
                        key={tag.id} 
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${colorClass}`}
                      >
                        {tag.description}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <span className="text-sm text-slate-500 font-medium">
          Mostrando {Math.min(total, page * limit + 1)} - {Math.min(total, (page + 1) * limit)} de {total}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * limit >= total || loading}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
