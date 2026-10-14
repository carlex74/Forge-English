// Servicio de acceso a la base curricular de Quick Learn (100 fichas pedagógicas completas)
// Soporta carga diferida (dynamic import) para optimizar el bundle de Vite

let curriculumCache = null

export const CATEGORY_METADATA = {
  all: { label: 'Todos los Temas', icon: 'Sparkles', color: 'amber' },
  verbs: { label: 'Tiempos y Verbos', icon: 'Clock', color: 'emerald' },
  sentences: { label: 'Estructura Oracional', icon: 'Layout', color: 'blue' },
  adjectives: { label: 'Adjetivos y Orden', icon: 'Palette', color: 'rose' },
  conditionals: { label: 'Condicionales', icon: 'GitFork', color: 'purple' },
  passive_reported: { label: 'Voz Pasiva y Relatada', icon: 'MessageSquare', color: 'indigo' },
  prepositions: { label: 'Preposiciones', icon: 'Compass', color: 'teal' },
  pronouns: { label: 'Pronombres', icon: 'Users', color: 'cyan' },
  connectors: { label: 'Conectores', icon: 'Link', color: 'amber' },
  nouns: { label: 'Sustantivos y Artículos', icon: 'Layers', color: 'blue' },
  vocabulary: { label: 'Vocabulario', icon: 'BookOpen', color: 'emerald' },
  writing: { label: 'Redacción y Ensayos', icon: 'FileText', color: 'purple' },
  speaking: { label: 'Expresión Oral', icon: 'Mic', color: 'rose' },
  reading: { label: 'Lectura Crítica', icon: 'BookMarked', color: 'indigo' },
  pronunciation: { label: 'Pronunciación', icon: 'Volume2', color: 'amber' },
  pragmatics: { label: 'Pragmática y Cortesía', icon: 'Award', color: 'teal' },
  semantics: { label: 'Semántica y Matices', icon: 'HelpCircle', color: 'cyan' },
  listening: { label: 'Comprensión Auditiva', icon: 'Headphones', color: 'emerald' },
  literacy: { label: 'Alfabetización', icon: 'CheckCircle2', color: 'blue' },
  mediation: { label: 'Mediación', icon: 'Share2', color: 'purple' },
  sociolinguistics: { label: 'Sociolingüística', icon: 'Globe', color: 'indigo' },
  learning: { label: 'Estrategias de Aprendizaje', icon: 'GraduationCap', color: 'amber' },
}

export const LEVEL_METADATA = {
  all: { id: 'all', label: 'Todos los Niveles', badge: 'A1 - C2' },
  A1: { id: 'A1', label: 'A1 - Principiante', badge: 'A1', desc: 'Presentación personal y estructuras inmediatas' },
  A2: { id: 'A2', label: 'A2 - Básico', badge: 'A2', desc: 'Intercambios cotidianos, pasado simple y planes' },
  B1: { id: 'B1', label: 'B1 - Pre-intermedio', badge: 'B1', desc: 'Experiencias pasadas conectadas y razones' },
  B2: { id: 'B2', label: 'B2 - Intermedio Alto', badge: 'B2', desc: 'Posturas, contrastes de tiempo y modalidad' },
  C1: { id: 'C1', label: 'C1 - Avanzado', badge: 'C1', desc: 'Registro formal, flexibilidad y matices sutiles' },
  C2: { id: 'C2', label: 'C2 - Maestría', badge: 'C2', desc: 'Precisión estilística, perspectiva y reformulación' },
}

// Mapeo de alias para compatibilidad retroactiva con URLs previas
const TOPIC_ALIASES = {
  'sentence-structure': 'sentence-order-svo',
  'adjective-order': 'adjective-order-osascomp',
  'verb-tenses': 'present-simple',
  'comparative-superlative': 'comparatives-and-superlatives',
  'pronouns': 'pronouns-matrix',
  'prepositions-time-place': 'prepositions-pyramid-in-on-at',
  'connectors-linkers': 'connectors-basic-addition-contrast',
}

/**
 * Carga perezosa del currículo completo (100 fichas, 200 actividades, tablas léxicas)
 */
export async function getCurriculumData() {
  if (!curriculumCache) {
    const raw = await import('../../data/quickLearnCurriculum.json')
    curriculumCache = raw.default || raw
  }
  return curriculumCache
}

/**
 * Obtiene todas las fichas ordenadas con índices rápidos de búsqueda
 */
export async function getAllTopics() {
  const data = await getCurriculumData()
  return data.topics || []
}

/**
 * Obtiene el mapa de roles gramaticales y sus colores
 */
export async function getGrammarRoles() {
  const data = await getCurriculumData()
  return data.roles || {}
}

/**
 * Obtiene los niveles MCER con sus descriptores y objetivos
 */
export async function getCurriculumLevels() {
  const data = await getCurriculumData()
  return data.levels || []
}

/**
 * Busca una ficha por su ID canónico o alias
 */
export async function getTopicById(id) {
  if (!id) return null
  const data = await getCurriculumData()
  const canonicalId = TOPIC_ALIASES[id] || id

  let topic = data.topics.find((t) => t.id === canonicalId)
  if (!topic) {
    // Intenta buscar por slug parcial o término clave
    topic = data.topics.find((t) => t.id.includes(canonicalId) || canonicalId.includes(t.id))
  }
  return topic || null
}

/**
 * Obtiene las actividades de repaso asociadas a una ficha
 */
export async function getTopicExercises(topicId) {
  if (!topicId) return []
  const data = await getCurriculumData()
  const canonicalId = TOPIC_ALIASES[topicId] || topicId
  return (data.exercises || []).filter((ex) => ex.topic_id === canonicalId)
}

/**
 * Obtiene el tema anterior y siguiente en la secuencia pedagógica
 */
export async function getAdjacentTopics(topicId) {
  const data = await getCurriculumData()
  const canonicalId = TOPIC_ALIASES[topicId] || topicId
  const index = data.topics.findIndex((t) => t.id === canonicalId)

  if (index === -1) return { prevTopic: null, nextTopic: null }

  return {
    prevTopic: index > 0 ? data.topics[index - 1] : null,
    nextTopic: index < data.topics.length - 1 ? data.topics[index + 1] : null,
  }
}

/**
 * Filtra tópicos por nivel, categoría y término de búsqueda
 */
export async function searchTopics({ level = 'all', category = 'all', query = '' }) {
  const topics = await getAllTopics()
  const cleanQuery = query.trim().toLowerCase()

  return topics.filter((topic) => {
    const matchesLevel = level === 'all' || topic.level === level
    const matchesCategory = category === 'all' || topic.category === category

    if (!cleanQuery) return matchesLevel && matchesCategory

    const matchesQuery =
      topic.title_en?.toLowerCase().includes(cleanQuery) ||
      topic.title_es?.toLowerCase().includes(cleanQuery) ||
      topic.formula?.toLowerCase().includes(cleanQuery) ||
      topic.summary_es?.toLowerCase().includes(cleanQuery) ||
      topic.search_terms?.some((term) => term.toLowerCase().includes(cleanQuery)) ||
      topic.signals?.some((sig) => sig.toLowerCase().includes(cleanQuery)) ||
      topic.examples?.some(
        (ex) =>
          ex.en?.toLowerCase().includes(cleanQuery) ||
          ex.es?.toLowerCase().includes(cleanQuery)
      )

    return matchesLevel && matchesCategory && matchesQuery
  })
}
