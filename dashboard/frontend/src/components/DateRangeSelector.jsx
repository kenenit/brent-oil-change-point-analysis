const PRESETS = [
  { label: 'All Time', start: '1987-05-20', end: '2022-11-14' },
  { label: '2008 Crisis', start: '2007-06-01', end: '2009-12-31' },
  { label: '2014–16 Slide', start: '2014-06-01', end: '2016-12-31' },
  { label: '2020 Crash', start: '2019-10-01', end: '2020-12-31' },
  { label: 'Last 5 Years', start: '2017-11-14', end: '2022-11-14' },
]

export default function DateRangeSelector({ start, end, onChange }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.presetRow}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(p.start, p.end)}
            style={{
              ...styles.presetBtn,
              ...(start === p.start && end === p.end ? styles.presetBtnActive : {}),
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div style={styles.customRow}>
        <label style={styles.fieldLabel}>
          From
          <input
            type="date"
            className="mono"
            value={start}
            min="1987-05-20"
            max="2022-11-14"
            onChange={(e) => onChange(e.target.value, end)}
            style={styles.dateInput}
          />
        </label>
        <label style={styles.fieldLabel}>
          To
          <input
            type="date"
            className="mono"
            value={end}
            min="1987-05-20"
            max="2022-11-14"
            onChange={(e) => onChange(start, e.target.value)}
            style={styles.dateInput}
          />
        </label>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  presetRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  presetBtn: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-hair)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 12px',
    fontSize: '12px',
  },
  presetBtnActive: {
    borderColor: 'var(--accent-crude)',
    color: 'var(--accent-crude)',
    background: 'var(--bg-panel-raised)',
  },
  customRow: { display: 'flex', gap: '12px' },
  fieldLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  dateInput: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-hair)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 8px',
    fontSize: '13px',
  },
}
