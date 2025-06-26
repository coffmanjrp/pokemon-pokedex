import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/dictionaries";
import { SandboxClient } from "./client";

interface SandboxPageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export default async function SandboxPage({ params }: SandboxPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <SandboxClient dictionary={dictionary} lang={lang} />;
}
