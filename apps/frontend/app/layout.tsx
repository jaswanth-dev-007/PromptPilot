import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PromptPilot',
  description:
    'AI-powered software planning pipeline — go from idea to complete specification suite in minutes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            top: '-100%',
            left: '8px',
            padding: '8px 16px',
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            borderRadius: '0 0 8px 8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            zIndex: 9999,
            transition: 'top 0.1s',
          }}
          onFocus={e => {
            (e.target as HTMLElement).style.top = '0'
          }}
          onBlur={e => {
            (e.target as HTMLElement).style.top = '-100%'
          }}
        >
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
