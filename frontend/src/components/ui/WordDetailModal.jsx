import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Sparkles, BookOpen, Layers, Tag as TagIcon, Flame, MessageSquare } from 'lucide-react';
import { TagBadge } from './TagBadge';

export const WordDetailModal = ({ word, onClose, onTagClick, activeTagIds = [] }) => {
  if (!word) return null;

  const playPronunciation = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Clasificar tags por tipo
  const levelTags = word.tags.filter(t => t.type === 'LEVEL');
  const freqTags = word.tags.filter(t => t.type === 'FREQUENCY');
  const grammarTags = word.tags.filter(t => t.type === 'GRAMMAR');
  const usageTags = word.tags.filter(t => t.type === 'USAGE');
  const topicTags = word.tags.filter(t => t.type === 'TOPIC');
  const otherTags = word.tags.filter(t => !['LEVEL', 'FREQUENCY', 'GRAMMAR', 'USAGE', 'TOPIC'].includes(t.type));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white capitalize tracking-tight">
                  {word.word}
                </h2>
                <button
                  onClick={playPronunciation}
                  className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all active:scale-90"
                  title="Escuchar pronunciación"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <span className="text-xs text-slate-400 font-mono">ID: #{word.id}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body con Scroll */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Traducción y Explicación si existe */}
            {word.traduction && (
              <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Traducción</span>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{word.traduction}</p>
                {word.examples && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic mt-1">"{word.examples}"</p>
                )}
              </div>
            )}

            {/* Niveles y Frecuencia */}
            {(levelTags.length > 0 || freqTags.length > 0) && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Nivel y Frecuencia
                </h3>
                <div className="flex flex-wrap gap-2">
                  {levelTags.map(t => (
                    <TagBadge
                      key={t.id}
                      tag={t}
                      size="md"
                      showIcon
                      isSelected={activeTagIds.includes(t.id)}
                      onClick={onTagClick}
                    />
                  ))}
                  {freqTags.map(t => (
                    <TagBadge
                      key={t.id}
                      tag={t}
                      size="md"
                      showIcon
                      isSelected={activeTagIds.includes(t.id)}
                      onClick={onTagClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Gramática */}
            {grammarTags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Clasificación Gramatical
                </h3>
                <div className="flex flex-wrap gap-2">
                  {grammarTags.map(t => (
                    <TagBadge
                      key={t.id}
                      tag={t}
                      size="md"
                      isSelected={activeTagIds.includes(t.id)}
                      onClick={onTagClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Uso y Registro */}
            {usageTags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-orange-500" /> Registro y Uso
                </h3>
                <div className="flex flex-wrap gap-2">
                  {usageTags.map(t => (
                    <TagBadge
                      key={t.id}
                      tag={t}
                      size="md"
                      showIcon
                      isSelected={activeTagIds.includes(t.id)}
                      onClick={onTagClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Temas / Vocabulario */}
            {topicTags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5 text-purple-500" /> Temas Relacionados ({topicTags.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topicTags.map(t => (
                    <TagBadge
                      key={t.id}
                      tag={t}
                      size="sm"
                      isSelected={activeTagIds.includes(t.id)}
                      onClick={onTagClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Otros Tags */}
            {otherTags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" /> Información Adicional
                </h3>
                <div className="flex flex-wrap gap-2">
                  {otherTags.map(t => (
                    <TagBadge
                      key={t.id}
                      tag={t}
                      size="sm"
                      isSelected={activeTagIds.includes(t.id)}
                      onClick={onTagClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
            <span>Tip: Haz clic en cualquier tag para filtrar el explorador</span>
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
