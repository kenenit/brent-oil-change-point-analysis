export default function SummaryCards({ summary }) {
  if (!summary) return null

  const cards = [
    { label: 'Coverage', value: `${summary.date_range.start} → ${summary.date_range.end}`, unit: '' },
    { label: 'Observations', value: summary.n_observations.toLocaleString(), unit: 'days' },
    { label: 'Price Range', value: `$${summary.min_price} – $${summary.max_price}`, unit: '/bbl' },
    { label: 'Mean Price', value: `$${summary.mean_price}`, unit: '/bbl' },
    { label: 'Key Events', value: summary.n_events, unit: 'tracked' },
    { label: 'Change Points', value: summary.n_change_points, unit: 'detected' },
  ]

  return (
    <div style={styles.grid}>
      {cards.map((c) => (
        <div key={c.label} style={styles.card}>
          <div style={styles.label}>{c.label}</div>
          <div className="mono" style={styles.value}>{c.value}</div>
          {c.unit && <div style={styles.unit}>{c.unit}</div>}
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1px',
    background: 'var(--border-hair)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  card: {
    background: 'var(--bg-panel)',
    padding: '16px 18px',
  },
  label: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-tertiary)',
    marginBottom: '8px',
  },
  value: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  unit: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
}
