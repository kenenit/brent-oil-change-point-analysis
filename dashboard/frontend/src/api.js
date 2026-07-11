const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000/api'

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`)
  }
  return res.json()
}

export const api = {
  getSummary: () => fetchJson('/summary'),
  getPrices: (start, end) => {
    const params = new URLSearchParams()
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    const qs = params.toString()
    return fetchJson(`/prices${qs ? `?${qs}` : ''}`)
  },
  getEvents: (category) => {
    const qs = category ? `?category=${encodeURIComponent(category)}` : ''
    return fetchJson(`/events${qs}`)
  },
  getChangePoints: () => fetchJson('/change-points'),
}
