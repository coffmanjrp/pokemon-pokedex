import { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/dictionaries";
import { ImageTestClient } from "./client";

export const metadata: Metadata = {
  title: "Next.js Image Component Test - Pokemon Pokedex",
  description: "Testing Next.js Image component with placeholder.png",
};

interface ImageTestPageProps {
  params: {
    lang: Locale;
  };
}

export default async function ImageTestPage({ params }: ImageTestPageProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Next.js Image Component Test
          </h1>
          <p className="text-gray-600 mt-2">
            Testing placeholder.png with various Next.js Image configurations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImageTestClient dictionary={dictionary} lang={lang} />
      </div>
    </div>
  );
}
