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
