import { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import SummaryCards from './components/SummaryCards'
import DateRangeSelector from './components/DateRangeSelector'
import PriceChart from './components/PriceChart'
import EventsList from './components/EventsList'
import ChangePointsPanel from './components/ChangePointsPanel'

export default function App() {
  const [summary, setSummary] = useState(null)
  const [events, setEvents] = useState([])
  const [changePoints, setChangePoints] = useState([])
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [range, setRange] = useState({ start: '1987-05-20', end: '2022-11-14' })
  const [highlightedEvent, setHighlightedEvent] = useState(null)

  // Initial load: summary, events, change points (static, load once)
  useEffect(() => {
    Promise.all([api.getSummary(), api.getEvents(), api.getChangePoints()])
      .then(([summaryData, eventsData, cpData]) => {
        setSummary(summaryData)
        setEvents(eventsData)
        setChangePoints(cpData)
      })
      .catch((err) => setError(err.message))
  }, [])

  // Price data reloads whenever the date range changes
  useEffect(() => {
    setLoading(true)
    api.getPrices(range.start, range.end)
      .then((data) => { setPrices(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [range])

  const handleRangeChange = useCallback((start, end) => {
    setRange({ start, end })
  }, [])

  const handleSelectEvent = useCallback((eventId) => {
    setHighlightedEvent((prev) => (prev === eventId ? null : eventId))
  }, [])

  const visibleEvents = events.filter((e) => e.start_date >= range.start && e.start_date <= range.end)

  if (error) {
    return (
      <div style={styles.errorScreen}>
        <h1>Could not reach the backend</h1>
        <p className="mono">{error}</p>
        <p style={{ color: 'var(--text-secondary)' }}>
          Make sure the Flask backend is running: <code className="mono">python dashboard/backend/app.py</code>
        </p>
      </div>
    )
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Birhan Energies · Change Point Intelligence</div>
          <h1 style={styles.h1}>Brent Crude Oil — Structural Break Analysis</h1>
        </div>
      </header>

      <main style={styles.main}>
        <SummaryCards summary={summary} />

        <DateRangeSelector start={range.start} end={range.end} onChange={handleRangeChange} />

        <PriceChart
          prices={prices}
          events={visibleEvents}
          changePoints={changePoints.filter((cp) => cp.change_point_date >= range.start && cp.change_point_date <= range.end)}
          highlightedEvent={highlightedEvent}
          onSelectEvent={handleSelectEvent}
        />

        {loading && <div style={styles.loadingNote}>Loading price data…</div>}

        <ChangePointsPanel changePoints={changePoints} />

        <div style={styles.bottomGrid}>
          <EventsList events={visibleEvents} highlightedEvent={highlightedEvent} onSelectEvent={handleSelectEvent} />
        </div>
      </main>

      <footer style={styles.footer}>
        Bayesian change point analysis via PyMC · Data: Brent crude, 20 May 1987 – 14 Nov 2022 ·
        Statistical association, not proven causation — see project report for methodology and limitations.
      </footer>
    </div>
  )
}

const styles = {
  app: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    padding: '24px clamp(16px, 4vw, 40px)',
    borderBottom: '1px solid var(--border-hair)',
  },
  eyebrow: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--accent-crude)',
    marginBottom: '6px',
  },
  h1: { fontSize: 'clamp(18px, 2.4vw, 24px)', margin: 0, fontWeight: 600, color: 'var(--text-primary)' },
  main: {
    flex: 1,
    padding: '24px clamp(16px, 4vw, 40px)',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  loadingNote: { fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '-14px', marginBottom: '14px' },
  footer: {
    padding: '16px clamp(16px, 4vw, 40px)',
    borderTop: '1px solid var(--border-hair)',
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
  },
  errorScreen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: '20px',
    textAlign: 'center',
  },
}
