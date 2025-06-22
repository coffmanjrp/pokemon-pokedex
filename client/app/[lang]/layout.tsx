import { Locale } from '@/lib/dictionaries'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ja' }]
}

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{
    lang: Locale
  }>
}

export default async function LangLayout({
  children,
}: LangLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content with left margin for sidebar */}
      <main className="lg:ml-80 min-h-screen">
        {children}
      </main>
    </div>
  )
}