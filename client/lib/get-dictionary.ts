import "server-only";
import { Dictionary, Locale } from "./dictionaries";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ja: () => import("./dictionaries/ja.json").then((module) => module.default),
  "zh-Hans": () =>
    import("./dictionaries/zh-Hans.json").then((module) => module.default),
  "zh-Hant": () =>
    import("./dictionaries/zh-Hant.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  it: () => import("./dictionaries/it.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const dict = await (dictionaries[locale]?.() ?? dictionaries.en());
  return dict as Dictionary;
};
