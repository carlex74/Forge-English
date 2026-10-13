/**
 * tagStyles.js
 * Sistema de colores y estilos para todas las categorías de tags:
 * - LEVEL (CEFR: A1, A2, B1, B2, C1, C2)
 * - GRAMMAR (noun, verb, adjective, adverb, pronoun, preposition, conjunction, determiner, modal verb, etc.)
 * - FREQUENCY (Top 1k, Top 5k, Top 10k, Top 50k, Top 100k, Rare)
 * - USAGE (slang, informal, archaic, obsolete, offensive, vulgar)
 * - TOPIC (Temas diversos con paleta armónica pastel)
 * - DOMAIN & MORPHOLOGY
 */

// Colores por Nivel CEFR
export const LEVEL_COLORS = {
  'A1': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 font-black',
  'A2': 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700/60 font-black',
  'B1': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 font-black',
  'B2': 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700/60 font-black',
  'C1': 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/60 font-black',
  'C2': 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/60 font-black',
};

// Colores por Clase Gramatical
export const GRAMMAR_COLORS = {
  'noun': 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700/60',
  'proper noun': 'bg-blue-600/15 text-blue-800 dark:text-blue-200 border-blue-400 dark:border-blue-600',
  'compound': 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700/60',
  'verb': 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/60',
  'phrasal verb': 'bg-indigo-600/15 text-indigo-800 dark:text-indigo-200 border-indigo-400 dark:border-indigo-600',
  'irregular verb': 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700/60',
  'auxiliary verb': 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/60',
  'modal verb': 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
  'adjective': 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700/60',
  'adverb': 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/60',
  'pronoun': 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700/60',
  'preposition': 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700/60',
  'prepositional phrase': 'bg-stone-600/15 text-stone-800 dark:text-stone-200 border-stone-400 dark:border-stone-600',
  'conjunction': 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/60',
  'complementizer': 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/60',
  'determiner': 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700/60',
  'article': 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700/60',
  'interjection': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
  'contraction': 'bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-300 dark:border-lime-700/60',
  'phrase': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
  'proverb': 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700/60',
  'numeral': 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/60',
  'abbreviation': 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700/60',
  'particle': 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/60',
  'prefix': 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
  'suffix': 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
  'symbol': 'bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700/60',
  'infinitive marker': 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/60',
};

// Colores por Frecuencia
export const FREQUENCY_STYLES = {
  'top 1,000': {
    label: 'Top 1k',
    icon: '🔥',
    classes: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-800 dark:text-amber-200 border-amber-400 dark:border-amber-600 font-bold shadow-sm',
  },
  'top 5,000': {
    label: 'Top 5k',
    icon: '⚡',
    classes: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700/60 font-semibold',
  },
  'top 10,000': {
    label: 'Top 10k',
    icon: '✨',
    classes: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/60',
  },
  'top 50,000': {
    label: 'Top 50k',
    icon: null,
    classes: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700/60',
  },
  'top 100,000': {
    label: 'Top 100k',
    icon: null,
    classes: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/60',
  },
  'outside top 100,000': {
    label: 'Rare',
    icon: null,
    classes: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
};

// Colores por Uso / Registro
export const USAGE_COLORS = {
  'slang': 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700/80 font-semibold',
  'informal': 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700/60',
  'archaic': 'bg-stone-500/20 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700/60 italic',
  'obsolete': 'bg-stone-600/20 text-stone-800 dark:text-stone-200 border-stone-400 dark:border-stone-600 italic',
  'offensive': 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/80 font-bold',
  'vulgar': 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/80 font-bold',
};

// Colores pastel dinámicos para los temas (Topics)
const TOPIC_PALETTES = [
  'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
];

function getHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Obtiene la clase CSS y label amigable para un tag.
 */
export function getTagInfo(tag) {
  if (!tag) {
    return {
      classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
      label: '',
      icon: null,
      type: 'OTHER'
    };
  }

  const desc = tag.description || '';
  const descLower = desc.toLowerCase();
  const type = (tag.type || '').toUpperCase();

  // 1. LEVEL
  if (type === 'LEVEL' || LEVEL_COLORS[desc]) {
    return {
      classes: LEVEL_COLORS[desc] || LEVEL_COLORS['A1'],
      label: desc,
      icon: '🎯',
      type: 'LEVEL'
    };
  }

  // 2. FREQUENCY
  if (type === 'FREQUENCY') {
    for (const [key, val] of Object.entries(FREQUENCY_STYLES)) {
      if (descLower.includes(key)) {
        return {
          classes: val.classes,
          label: val.label,
          fullDescription: desc,
          icon: val.icon,
          type: 'FREQUENCY'
        };
      }
    }
  }

  // 3. GRAMMAR
  if (type === 'GRAMMAR') {
    const classes = GRAMMAR_COLORS[descLower] || 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    return {
      classes,
      label: desc,
      icon: null,
      type: 'GRAMMAR'
    };
  }

  // 4. USAGE
  if (type === 'USAGE') {
    const classes = USAGE_COLORS[descLower] || 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-300';
    return {
      classes,
      label: desc,
      icon: '💬',
      type: 'USAGE'
    };
  }

  // 5. DOMAIN / MORPHOLOGY
  if (type === 'DOMAIN') {
    return {
      classes: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700',
      label: desc.replace('MeSH ', ''),
      icon: '🔬',
      type: 'DOMAIN'
    };
  }

  if (type === 'MORPHOLOGY') {
    return {
      classes: 'bg-fuchsia-500/15 text-fuchsia-800 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-700',
      label: desc,
      icon: '⚡',
      type: 'MORPHOLOGY'
    };
  }

  // 6. TOPIC
  if (type === 'TOPIC') {
    const paletteIndex = getHash(desc) % TOPIC_PALETTES.length;
    return {
      classes: TOPIC_PALETTES[paletteIndex],
      label: desc,
      icon: '🏷️',
      type: 'TOPIC'
    };
  }

  // Fallback
  return {
    classes: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    label: desc,
    icon: null,
    type: 'OTHER'
  };
}
