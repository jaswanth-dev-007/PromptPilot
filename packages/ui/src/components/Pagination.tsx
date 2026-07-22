export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        justifyContent: 'center',
        fontFamily: 'inherit',
      }}
    >
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} style={btnStyle}>
        ‹ Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} style={{ padding: '6px 10px', color: '#9CA3AF' }}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            style={{
              ...btnStyle,
              fontWeight: p === page ? 600 : 400,
              backgroundColor: p === page ? '#EEF2FF' : 'transparent',
              color: p === page ? '#4F46E5' : '#64748B',
            }}
          >
            {p}
          </button>
        ),
      )}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} style={btnStyle}>
        Next ›
      </button>
    </nav>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  background: 'transparent',
  color: '#64748B',
  fontSize: '0.8125rem',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
