import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/dictionaries";
import { EvolutionMockClient } from "./client";

interface EvolutionMockPageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export default async function EvolutionMockPage({
  params,
}: EvolutionMockPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <EvolutionMockClient dictionary={dictionary} lang={lang} />;
}
