import { Locale } from '@/lib/dictionaries'
import { getDictionary } from '@/lib/get-dictionary'
import { PokemonListClient } from './client'

interface HomePageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return <PokemonListClient dictionary={dictionary} lang={lang} />
}