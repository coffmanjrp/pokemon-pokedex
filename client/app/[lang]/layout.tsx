import { Locale } from "@/lib/dictionaries";
import ConditionalLayout from "./ConditionalLayout";

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "ja" },
    { lang: "zh-Hans" },
    { lang: "zh-Hant" },
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
