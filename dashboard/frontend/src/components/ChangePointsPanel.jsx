export default function ChangePointsPanel({ changePoints }) {
  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Detected Change Points</h2>
      <div style={styles.cards}>
        {changePoints.map((cp) => (
          <div key={cp.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.modelLabel}>{cp.label}</span>
              <span className="mono" style={styles.rhat}>r_hat {cp.r_hat.toFixed(2)}</span>
            </div>

            <div className="mono" style={styles.date}>{cp.change_point_date}</div>
            <div style={styles.hdi}>94% HDI: {cp.hdi_lower} – {cp.hdi_upper}</div>

            <div style={styles.priceRow}>
              <div style={styles.priceBlock}>
                <div style={styles.priceLabel}>Before</div>
                <div className="mono" style={styles.priceValue}>${cp.price_before.toFixed(2)}</div>
              </div>
              <div style={styles.arrow}>→</div>
              <div style={styles.priceBlock}>
                <div style={styles.priceLabel}>After</div>
                <div className="mono" style={styles.priceValue}>${cp.price_after.toFixed(2)}</div>
              </div>
              <div style={{
                ...styles.pctChange,
                color: cp.pct_change >= 0 ? 'var(--accent-ok)' : 'var(--accent-danger)',
              }}>
                {cp.pct_change >= 0 ? '+' : ''}{cp.pct_change.toFixed(1)}%
              </div>
            </div>

            {cp.matched_event ? (
              <div style={styles.matchBox}>
                <span style={styles.matchLabel}>Matched Event</span>
                <div style={styles.matchName}>{cp.matched_event}</div>
                <div style={styles.matchMeta}>
                  {cp.matched_event_date} · {cp.days_from_event} day{cp.days_from_event !== 1 ? 's' : ''} from change point
                </div>
              </div>
            ) : (
              <div style={styles.noMatchBox}>No dated event matched within window</div>
            )}

            <p style={styles.interpretation}>{cp.interpretation}</p>
          </div>
        ))}
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
    marginBottom: '24px',
  },
  title: { fontSize: '15px', fontWeight: 600, margin: '0 0 14px 0', color: 'var(--text-primary)' },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
  },
  card: {
    background: 'var(--bg-panel-raised)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-sm)',
    padding: '16px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  modelLabel: { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 },
  rhat: { fontSize: '11px', color: 'var(--accent-ok)' },
  date: { fontSize: '22px', color: 'var(--accent-crude)', fontWeight: 700 },
  hdi: { fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', marginBottom: '14px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' },
  priceBlock: {},
  priceLabel: { fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)' },
  priceValue: { fontSize: '15px', color: 'var(--text-primary)' },
  arrow: { color: 'var(--text-tertiary)' },
  pctChange: { marginLeft: 'auto', fontSize: '15px', fontWeight: 700 },
  matchBox: {
    background: 'rgba(111, 191, 130, 0.08)',
    border: '1px solid var(--accent-ok)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
    marginBottom: '10px',
  },
  matchLabel: { fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-ok)', letterSpacing: '0.05em' },
  matchName: { fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' },
  matchMeta: { fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' },
  noMatchBox: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic',
    padding: '10px 12px',
    marginBottom: '10px',
    border: '1px dashed var(--border-hair)',
    borderRadius: 'var(--radius-sm)',
  },
  interpretation: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 },
}
