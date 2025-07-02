import { Locale } from "@/lib/dictionaries";
import ConditionalLayout from "./ConditionalLayout";

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "ja" },
    { lang: "zh-Hant" },
    { lang: "zh-Hans" },
    { lang: "es" },
    { lang: "ko" },
    { lang: "fr" },
    { lang: "it" },
  ];
}

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: Locale;
  }>;
}

export default async function LangLayout({ children }: LangLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConditionalLayout>{children}</ConditionalLayout>
    </div>
  );
}
