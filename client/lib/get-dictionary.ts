import "server-only";
import { Dictionary, Locale } from "./dictionaries";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ja: () => import("./dictionaries/ja.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const dict = await (dictionaries[locale]?.() ?? dictionaries.en());
  return dict as Dictionary;
};
