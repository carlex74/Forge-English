import { API_URL } from '../../config/api'

export const fetchExercise = async ({ queryKey }) => {
  // eslint-disable-next-line no-unused-vars
  const [_key, difficulty, mode, exerciseCount] = queryKey
  const res = await fetch(`${API_URL}/exercise/random?difficulty=${difficulty}&mode=${mode}&t=${Date.now()}`)
  if (!res.ok) throw new Error('Network error')
  return res.json()
}

export const evaluateExercise = async (payload) => {
  const res = await fetch(`${API_URL}/exercise/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Error al evaluar')
  return res.json()
}

export const explainSentence = async (sentence) => {
  const res = await fetch(`${API_URL}/exercise/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence })
  })
  if (!res.ok) throw new Error('Error al obtener explicación')
  return res.json()
}

export const fetchWordDefinition = async (word) => {
  // Primary API: freedictionaryapi.com
  try {
    const res = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${word}`)
    if (res.ok) {
      const data = await res.json()
      // Adaptar el formato de freedictionaryapi.com al de dictionaryapi.dev
      const raw = Array.isArray(data) ? data[0] : data
      
      const meanings = (raw.entries || raw.meanings || []).map(entry => {
        const senses = entry.senses || entry.definitions || []
        return {
          partOfSpeech: entry.partOfSpeech || 'unknown',
          synonyms: entry.synonyms || senses.flatMap(s => s.synonyms || []),
          antonyms: entry.antonyms || senses.flatMap(s => s.antonyms || []),
          definitions: senses.map(sense => ({
            definition: sense.definition || sense.gloss || '',
            example: sense.example || ''
          }))
        }
      })

      let audio = null
      let phonetic = ''
      
      // Buscar pronunciaciones
      const phoneticsList = raw.pronunciations || raw.phonetics || []
      for (const pron of phoneticsList) {
        if (!audio && pron.audio && pron.audio.url) audio = pron.audio.url
        if (!audio && pron.audio && typeof pron.audio === 'string') audio = pron.audio
        
        if (!phonetic && pron.transcriptions && pron.transcriptions.length > 0) {
          phonetic = pron.transcriptions[0].transcription || ''
        }
        if (!phonetic && pron.text) phonetic = pron.text
      }

      return {
        word: raw.word || word,
        phonetic: phonetic,
        phonetics: audio ? [{ audio }] : [],
        meanings: meanings
      }
    }
  } catch (error) {
    console.warn("API principal falló, probando alternativa...")
  }

  // Fallback API: dictionaryapi.dev
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (res.ok) {
      const data = await res.json()
      return data[0] // Estructura original
    }
  } catch (error) {
    console.warn("API secundaria también falló", error)
  }

  return null
}
