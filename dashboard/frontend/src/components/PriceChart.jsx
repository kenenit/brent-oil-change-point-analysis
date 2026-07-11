import { useMemo, useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ReferenceDot,
} from 'recharts'

const CATEGORY_COLORS = {
  'Conflict': 'var(--accent-danger)',
  'OPEC Policy': 'var(--accent-crude)',
  'Economic': 'var(--accent-teal)',
  'Sanctions': 'var(--accent-violet)',
  'Geopolitical': 'var(--accent-violet)',
}

function CustomTooltip({ active, payload, label, eventsByDate }) {
  if (!active || !payload || !payload.length) return null
  const event = eventsByDate[label]
  return (
    <div style={tooltipStyles.box}>
      <div className="mono" style={tooltipStyles.date}>{label}</div>
      <div className="mono" style={tooltipStyles.price}>${payload[0].value.toFixed(2)} /bbl</div>
      {event && (
        <div style={{ ...tooltipStyles.event, borderColor: CATEGORY_COLORS[event.category] || 'var(--accent-crude)' }}>
          <div style={tooltipStyles.eventCategory}>{event.category}</div>
          <div style={tooltipStyles.eventName}>{event.name}</div>
        </div>
      )}
    </div>
  )
}

export default function PriceChart({ prices, events, changePoints, highlightedEvent, onSelectEvent }) {
  const [hoveredDate, setHoveredDate] = useState(null)

  const eventsByDate = useMemo(() => {
    const map = {}
    events.forEach((e) => { map[e.start_date] = e })
    return map
  }, [events])

  // Downsample for render performance on very wide date ranges (chart still reads accurately)
  const displayData = useMemo(() => {
    if (prices.length <= 2500) return prices
    const step = Math.ceil(prices.length / 2500)
    return prices.filter((_, i) => i % step === 0)
  }, [prices])

  const priceByDate = useMemo(() => {
    const map = {}
    prices.forEach((p) => { map[p.date] = p.price })
    return map
  }, [prices])

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Brent Crude Price</h2>
        <div style={styles.legend}>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: color }} />
              {cat}
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={displayData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="var(--border-hair)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="var(--text-tertiary)"
            tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
            minTickGap={40}
          />
          <YAxis
            stroke="var(--text-tertiary)"
            tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickFormatter={(v) => `$${v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip eventsByDate={eventsByDate} />} />

          {/* Change point markers */}
          {changePoints.map((cp) => (
            <ReferenceLine
              key={cp.id}
              x={cp.change_point_date}
              stroke="var(--accent-ok)"
              strokeDasharray="4 3"
              label={{
                value: `τ ${cp.change_point_date}`,
                position: 'top',
                fill: 'var(--accent-ok)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
              }}
            />
          ))}

          {/* Event markers */}
          {events.map((e) => {
            const price = priceByDate[e.start_date]
            if (price === undefined) return null
            const isHighlighted = highlightedEvent === e.id
            return (
              <ReferenceDot
                key={e.id}
                x={e.start_date}
                y={price}
                r={isHighlighted ? 7 : 4}
                fill={CATEGORY_COLORS[e.category] || 'var(--accent-crude)'}
                stroke={isHighlighted ? 'var(--text-primary)' : 'none'}
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectEvent(e.id)}
              />
            )
          })}

          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--accent-crude)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: 'var(--accent-crude)' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p style={styles.hint}>Click a colored dot to highlight that event below · dashed green lines mark detected change points (τ)</p>
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
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: { fontSize: '15px', fontWeight: 600, margin: 0, color: 'var(--text-primary)' },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '14px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
  hint: { fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '10px', marginBottom: 0 },
}

const tooltipStyles = {
  box: {
    background: 'var(--bg-panel-raised)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
    minWidth: '160px',
  },
  date: { fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' },
  price: { fontSize: '14px', color: 'var(--accent-crude)', fontWeight: 600 },
  event: { marginTop: '8px', paddingLeft: '8px', borderLeft: '2px solid' },
  eventCategory: { fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' },
  eventName: { fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' },
}
