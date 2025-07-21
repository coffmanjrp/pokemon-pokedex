import { MetadataRoute } from "next";
import { GENERATIONS } from "@/lib/data/generations";
import { getRealFormIds } from "@/lib/data/pokemonFormMappings";
import { getBaseUrl } from "@/lib/utils/metadata";

// Supported languages (reduced for build optimization)
const SUPPORTED_LANGUAGES = ["en", "ja"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const sitemap: MetadataRoute.Sitemap = [];

  // Add home page for each language
  for (const lang of SUPPORTED_LANGUAGES) {
    sitemap.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  // Add Pokemon list pages (generation pages)
  for (const generation of GENERATIONS) {
    for (const lang of SUPPORTED_LANGUAGES) {
      sitemap.push({
        url: `${baseUrl}/${lang}/pokemon?generation=${generation.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // Add all Pokemon detail pages
  // Generation 1-9 Pokemon
  for (const generation of GENERATIONS) {
    if (generation.id === 0) continue; // Handle Generation 0 separately

    for (
      let id = generation.pokemonRange.start;
      id <= generation.pokemonRange.end;
      id++
    ) {
      for (const lang of SUPPORTED_LANGUAGES) {
        sitemap.push({
          url: `${baseUrl}/${lang}/pokemon/${id}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // Generation 0 (Pokemon forms)
  const formIds = getRealFormIds();
  for (const formId of formIds) {
    for (const lang of SUPPORTED_LANGUAGES) {
      sitemap.push({
        url: `${baseUrl}/${lang}/pokemon/${formId}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // Add static pages
  const staticPages = ["/about", "/privacy", "/terms"];

  for (const page of staticPages) {
    for (const lang of SUPPORTED_LANGUAGES) {
      // Check if the page exists before adding to sitemap
      // For now, we'll add them as placeholders
      // You may want to implement these pages or remove them
      sitemap.push({
        url: `${baseUrl}/${lang}${page}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      });
    }
  }

  return sitemap;
}
