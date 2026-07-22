import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account — PromptPilot',
  description: 'Create your PromptPilot account to start building AI-powered planning pipelines.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
