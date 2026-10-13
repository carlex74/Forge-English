import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  X, 
  Volume2, 
  RotateCcw, 
  Flame, 
  BookOpen, 
  Tag as TagIcon, 
  Layers,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { getTags, getWords } from '../core/services/dictionaryService';
import { TagBadge } from '../components/ui/TagBadge';
import { WordDetailModal } from '../components/ui/WordDetailModal';
import { getTagInfo } from '../core/utils/tagStyles';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const DictionaryPage = () => {
  const [words, setWords] = useState([]);
  const [tags, setTags] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados de Búsqueda y Filtros
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchMode, setSearchMode] = useState('starts'); // 'starts', 'contains', 'exact'
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrammar, setSelectedGrammar] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedUsage, setSelectedUsage] = useState('');
  const [extraTagIds, setExtraTagIds] = useState([]); // Tags cliqueados individualmente

  // Paginación
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(48);

  // Modal de Detalle
  const [selectedWordForModal, setSelectedWordForModal] = useState(null);

  // Debounce para búsqueda en vivo
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Cargar lista completa de tags al inicio
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const t = await getTags();
        setTags(t);
      } catch (e) {
        console.error("Error fetching tags", e);
      }
    };
    fetchTags();
  }, []);

  // Agrupar tags por tipo para los selectores
  const { grammarTags, levelTags, frequencyTags, topicTags, usageTags } = useMemo(() => {
    return {
      grammarTags: tags.filter(t => t.type === 'GRAMMAR'),
      levelTags: tags.filter(t => t.type === 'LEVEL'),
      frequencyTags: tags.filter(t => t.type === 'FREQUENCY'),
      topicTags: tags.filter(t => t.type === 'TOPIC'),
      usageTags: tags.filter(t => t.type === 'USAGE'),
    };
  }, [tags]);

  // Calcular lista unificada de tag_ids activos
  const activeTagIds = useMemo(() => {
    const ids = [];
    if (selectedLevel) ids.push(Number(selectedLevel));
    if (selectedGrammar) ids.push(Number(selectedGrammar));
    if (selectedFrequency) ids.push(Number(selectedFrequency));
    if (selectedTopic) ids.push(Number(selectedTopic));
    if (selectedUsage) ids.push(Number(selectedUsage));
    extraTagIds.forEach(id => {
      if (!ids.includes(id)) ids.push(id);
    });
    return ids;
  }, [selectedLevel, selectedGrammar, selectedFrequency, selectedTopic, selectedUsage, extraTagIds]);

  // Obtener palabras del backend según filtros
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const data = await getWords(
          page * limit, 
          limit, 
          debouncedSearch, 
          '', 
          activeTagIds, 
          searchMode
        );
        setWords(data.items || []);
        setTotal(data.total || 0);
      } catch (e) {
        console.error("Error fetching words", e);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, [debouncedSearch, activeTagIds, page, limit, searchMode]);

  // Pronunciar palabra con Web Speech API
  const handlePlayAudio = (e, wordStr) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordStr);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Click en tag dentro de tarjeta o modal para agregarlo o removerlo como filtro
  const handleTagClick = (tag) => {
    if (tag.type === 'LEVEL') {
      setSelectedLevel(prev => (prev === String(tag.id) ? '' : String(tag.id)));
    } else if (tag.type === 'GRAMMAR') {
      setSelectedGrammar(prev => (prev === String(tag.id) ? '' : String(tag.id)));
    } else if (tag.type === 'FREQUENCY') {
      setSelectedFrequency(prev => (prev === String(tag.id) ? '' : String(tag.id)));
    } else if (tag.type === 'TOPIC') {
      setSelectedTopic(prev => (prev === String(tag.id) ? '' : String(tag.id)));
    } else if (tag.type === 'USAGE') {
      setSelectedUsage(prev => (prev === String(tag.id) ? '' : String(tag.id)));
    } else {
      setExtraTagIds(prev => 
        prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
      );
    }
    setPage(0);
  };

  // Limpiar todos los filtros
  const handleClearAllFilters = () => {
    setSearch('');
    setSelectedLevel('');
    setSelectedGrammar('');
    setSelectedFrequency('');
    setSelectedTopic('');
    setSelectedUsage('');
    setExtraTagIds([]);
    setPage(0);
  };

  const hasActiveFilters = Boolean(
    search || selectedLevel || selectedGrammar || selectedFrequency || selectedTopic || selectedUsage || extraTagIds.length > 0
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col w-full max-w-7xl mx-auto h-[88vh] px-2 sm:px-4"
    >
      {/* ================= BARRA SUPERIOR: TÍTULO Y BÚSQUEDA ================= */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Word Explorer
              </h1>
              <span className="text-sm font-bold bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                {total.toLocaleString()} palabras
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explora más de un millón de palabras en inglés con gramática, frecuencia y niveles CEFR
            </p>
          </div>

          {/* Buscador inteligente */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar palabra (ej. play, water, run)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Modo de búsqueda */}
            <select
              value={searchMode}
              onChange={(e) => {
                setSearchMode(e.target.value);
                setPage(0);
              }}
              title="Modo de coincidencia"
              className="px-3 py-2.5 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="starts">Empieza con...</option>
              <option value="contains">Contiene...</option>
              <option value="exact">Exacta</option>
            </select>
          </div>
        </div>

        {/* ================= BARRA DE FILTROS RÁPIDOS POR CATEGORÍA ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
          {/* Quick CEFR Level Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Nivel:</span>
            <button
              onClick={() => { setSelectedLevel(''); setPage(0); }}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all border ${
                selectedLevel === ''
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Todos
            </button>
            {CEFR_LEVELS.map(lvl => {
              const tagObj = levelTags.find(t => t.description === lvl);
              if (!tagObj) return null;
              const isSelected = selectedLevel === String(tagObj.id);
              const info = getTagInfo(tagObj);

              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(isSelected ? '' : String(tagObj.id));
                    setPage(0);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-xl font-black transition-all border ${
                    isSelected
                      ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-900 ' + info.classes
                      : 'opacity-70 hover:opacity-100 ' + info.classes
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Selectores desplegables para Gramática, Frecuencia, Temas y Uso */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Gramática */}
            <select
              value={selectedGrammar}
              onChange={(e) => { setSelectedGrammar(e.target.value); setPage(0); }}
              className="text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="">Gramática: Todas</option>
              {grammarTags.map(t => (
                <option key={t.id} value={t.id}>{t.description}</option>
              ))}
            </select>

            {/* Frecuencia */}
            <select
              value={selectedFrequency}
              onChange={(e) => { setSelectedFrequency(e.target.value); setPage(0); }}
              className="text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="">Frecuencia: Todas</option>
              {frequencyTags.map(t => {
                const info = getTagInfo(t);
                return (
                  <option key={t.id} value={t.id}>
                    {info.label || t.description}
                  </option>
                );
              })}
            </select>

            {/* Temas / Topics */}
            {topicTags.length > 0 && (
              <select
                value={selectedTopic}
                onChange={(e) => { setSelectedTopic(e.target.value); setPage(0); }}
                className="text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                <option value="">Tema ({topicTags.length}): Todos</option>
                {topicTags.map(t => (
                  <option key={t.id} value={t.id}>{t.description}</option>
                ))}
              </select>
            )}

            {/* Uso / Registro */}
            {usageTags.length > 0 && (
              <select
                value={selectedUsage}
                onChange={(e) => { setSelectedUsage(e.target.value); setPage(0); }}
                className="text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option value="">Uso: Todos</option>
                {usageTags.map(t => (
                  <option key={t.id} value={t.id}>{t.description}</option>
                ))}
              </select>
            )}

            {/* Botón Reset */}
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Limpiar todos los filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        {activeTagIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filtros activos:</span>
            {activeTagIds.map(tid => {
              const tagObj = tags.find(t => t.id === tid);
              if (!tagObj) return null;
              return (
                <span
                  key={tid}
                  className="inline-flex items-center gap-1 text-xs font-bold pl-2.5 pr-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                >
                  <span className="text-[10px] text-slate-400">{tagObj.type}:</span>
                  {tagObj.description}
                  <button
                    onClick={() => handleTagClick(tagObj)}
                    className="p-0.5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= GRILLA DE PALABRAS ================= */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary border-t-transparent"></div>
            <p className="text-sm font-semibold text-slate-500">Cargando vocabulario...</p>
          </div>
        ) : words.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 text-center text-slate-500 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <Sparkles className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
              No se encontraron palabras
            </p>
            <p className="text-sm text-slate-500 max-w-md mb-4">
              {search 
                ? `No hay coincidencias para "${search}" con los filtros seleccionados.` 
                : 'Intenta relajar los filtros de nivel o gramática.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {words.map((w) => {
              // Separar tags para layout armónico en la tarjeta
              const levelTag = w.tags.find(t => t.type === 'LEVEL');
              const freqTag = w.tags.find(t => t.type === 'FREQUENCY');
              const grammarTagsList = w.tags.filter(t => t.type === 'GRAMMAR');
              const usageTagsList = w.tags.filter(t => t.type === 'USAGE');
              const topicTagsList = w.tags.filter(t => t.type === 'TOPIC');

              return (
                <motion.div 
                  key={w.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSelectedWordForModal(w)}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-4 rounded-3xl shadow-xs hover:shadow-lg hover:border-primary/40 dark:hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between gap-3 overflow-hidden"
                >
                  {/* Fila Superior: Badges de Nivel y Frecuencia */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      {levelTag && (
                        <TagBadge 
                          tag={levelTag} 
                          size="xs" 
                          isSelected={activeTagIds.includes(levelTag.id)}
                          onClick={handleTagClick}
                        />
                      )}
                      {freqTag && (
                        <TagBadge 
                          tag={freqTag} 
                          size="xs" 
                          isSelected={activeTagIds.includes(freqTag.id)}
                          onClick={handleTagClick}
                        />
                      )}
                    </div>

                    {/* Botón de Audio directo */}
                    <button
                      onClick={(e) => handlePlayAudio(e, w.word)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                      title="Escuchar pronunciación"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Palabra */}
                  <div className="my-1">
                    <span 
                      className="text-base font-black text-slate-900 dark:text-white truncate block tracking-tight group-hover:text-primary transition-colors"
                      title={w.word}
                    >
                      {w.word}
                    </span>
                    {w.traduction && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                        {w.traduction}
                      </span>
                    )}
                  </div>

                  {/* Fila Inferior: Tags Gramaticales y Temas */}
                  <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    {grammarTagsList.slice(0, 2).map(tag => (
                      <TagBadge 
                        key={tag.id} 
                        tag={tag} 
                        size="xs" 
                        isSelected={activeTagIds.includes(tag.id)}
                        onClick={handleTagClick}
                      />
                    ))}

                    {usageTagsList.slice(0, 1).map(tag => (
                      <TagBadge 
                        key={tag.id} 
                        tag={tag} 
                        size="xs" 
                        isSelected={activeTagIds.includes(tag.id)}
                        onClick={handleTagClick}
                      />
                    ))}

                    {topicTagsList.length > 0 && (
                      <span 
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        title={topicTagsList.map(t => t.description).join(', ')}
                      >
                        +{topicTagsList.length} temas
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= FOOTER: PAGINACIÓN Y CONTROL ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 mt-auto border-t border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>
            Mostrando {total === 0 ? 0 : page * limit + 1} - {Math.min(total, (page + 1) * limit)} de {total.toLocaleString()}
          </span>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span>Por página:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(0); }}
              className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold focus:outline-none"
            >
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        </div>

        {/* Controles de página */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold mr-2">
            Pág {page + 1} de {Math.max(1, totalPages)}
          </span>

          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * limit >= total || loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            title="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= MODAL DE DETALLE DE PALABRA ================= */}
      <WordDetailModal
        word={selectedWordForModal}
        onClose={() => setSelectedWordForModal(null)}
        onTagClick={(tag) => {
          handleTagClick(tag);
          setSelectedWordForModal(null);
        }}
        activeTagIds={activeTagIds}
      />
    </motion.div>
  );
};
