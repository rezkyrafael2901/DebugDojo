import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DebugDojo — MiMo AI Debugging Mentor',
  description: 'A gamified debugging dojo powered by Xiaomi MiMo. Generate missions, solve bugs, get AI judging, and level up your developer rank.',
  openGraph: {
    title: 'DebugDojo — MiMo AI Debugging Mentor',
    description: 'MiMo-powered debugging missions, answer judging, mentor chat, XP, ranks, and achievements.',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
