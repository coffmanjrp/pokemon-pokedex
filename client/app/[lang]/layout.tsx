import { Locale } from '@/lib/dictionaries'
import { Header } from '@/components/layout/Header'

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
  params
}: LangLayoutProps) {
  const { lang } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}