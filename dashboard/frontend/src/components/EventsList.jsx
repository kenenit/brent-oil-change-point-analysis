import { useMemo, useState } from 'react'

const CATEGORY_COLORS = {
  'Conflict': 'var(--accent-danger)',
  'OPEC Policy': 'var(--accent-crude)',
  'Economic': 'var(--accent-teal)',
  'Sanctions': 'var(--accent-violet)',
  'Geopolitical': 'var(--accent-violet)',
}

export default function EventsList({ events, highlightedEvent, onSelectEvent }) {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category))
    return ['All', ...Array.from(set)]
  }, [events])

  const filtered = useMemo(() => {
    if (categoryFilter === 'All') return events
    return events.filter((e) => e.category === categoryFilter)
  }, [events, categoryFilter])

  const handleClick = (event) => {
    setExpandedId(expandedId === event.id ? null : event.id)
    onSelectEvent(event.id)
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Key Events</h2>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={styles.list}>
        {filtered.map((e) => {
          const isExpanded = expandedId === e.id
          const isHighlighted = highlightedEvent === e.id
          return (
            <div
              key={e.id}
              onClick={() => handleClick(e)}
              style={{
                ...styles.item,
                borderLeftColor: CATEGORY_COLORS[e.category] || 'var(--accent-crude)',
                background: isHighlighted ? 'var(--bg-panel-raised)' : 'transparent',
              }}
            >
              <div style={styles.itemHeader}>
                <span className="mono" style={styles.itemDate}>{e.start_date}</span>
                <span style={{ ...styles.itemCategory, color: CATEGORY_COLORS[e.category] || 'var(--accent-crude)' }}>
                  {e.category}
                </span>
              </div>
              <div style={styles.itemName}>{e.name}</div>
              {isExpanded && <div style={styles.itemDescription}>{e.description}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    height: '100%',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  title: { fontSize: '15px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' },
  select: {
    background: 'var(--bg-panel-raised)',
    border: '1px solid var(--border-hair)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 8px',
    fontSize: '11px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '460px',
    overflowY: 'auto',
  },
  item: {
    borderLeft: '3px solid',
    borderRadius: '2px',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  itemHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  itemDate: { fontSize: '11px', color: 'var(--text-tertiary)' },
  itemCategory: { fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  itemName: { fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 },
  itemDescription: { fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 },
}
