import React from 'react'

export interface TableProps {
  columns: Array<{ key: string; label: string; width?: string }>
  rows: Array<Record<string, React.ReactNode>>
  emptyMessage?: string
}

export function Table({ columns, rows, emptyMessage = 'No data' }: TableProps) {
  return (
    <div style={{ overflowX: 'auto', fontFamily: 'inherit' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#64748B',
                  borderBottom: '1px solid #E2E8F0',
                  whiteSpace: 'nowrap',
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontStyle: 'italic',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid #F1F5F9' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = '#F8FAFC'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                }}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '12px 16px', color: '#111827' }}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
