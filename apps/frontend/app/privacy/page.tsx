import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — PromptPilot',
  description: 'PromptPilot privacy policy.',
}

export default function PrivacyPage() {
  return (
    <main style={styles.main}>
      <h1 style={styles.heading}>Privacy Policy</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Data Collection</h2>
        <p style={styles.text}>
          PromptPilot collects only the information you provide directly: email address, name, and
          project data. No usage analytics or tracking scripts are included.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Data Storage</h2>
        <p style={styles.text}>
          Your data is stored securely on our servers. Passwords are hashed using bcrypt. API tokens
          are signed JWTs. We do not share your data with third parties.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Your Rights</h2>
        <p style={styles.text}>
          You can request a copy of your data, correction, or deletion at any time by contacting our
          support team.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Contact</h2>
        <p style={styles.text}>
          For privacy-related inquiries, email us at privacy@promptpilot.dev.
        </p>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    padding: '40px 24px',
    maxWidth: '720px',
    margin: '0 auto',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  heading: { fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '32px' },
  section: { marginBottom: '28px' },
  sectionHeading: { fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '8px' },
  text: { fontSize: '1rem', lineHeight: 1.7, color: '#4b5563' },
}
