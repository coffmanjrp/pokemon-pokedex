import React from "react";
import { Locale } from "@/lib/dictionaries";

interface DataEmptyStateProps {
  type:
    | "moves"
    | "descriptions"
    | "games"
    | "sprites"
    | "evolution"
    | "abilities"
    | "general";
  language: Locale;
  customMessage?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
}

const emptyStateMessages: Record<
  DataEmptyStateProps["type"],
  Record<Locale, string>
> = {
  moves: {
    en: "No move data available",
    ja: "技データがありません",
    "zh-Hant": "無招式數據",
    "zh-Hans": "无招式数据",
  },
  descriptions: {
    en: "No descriptions available",
    ja: "説明がありません",
    "zh-Hant": "無說明可用",
    "zh-Hans": "无说明可用",
  },
  games: {
    en: "No game data available",
    ja: "ゲームデータがありません",
    "zh-Hant": "無遊戲數據",
    "zh-Hans": "无游戏数据",
  },
  sprites: {
    en: "No sprites available",
    ja: "スプライトがありません",
    "zh-Hant": "無圖像可用",
    "zh-Hans": "无图像可用",
  },
  evolution: {
    en: "No evolution data available",
    ja: "進化データがありません",
    "zh-Hant": "無進化數據",
    "zh-Hans": "无进化数据",
  },
  abilities: {
    en: "No abilities available",
    ja: "特性データがありません",
    "zh-Hant": "無特性數據",
    "zh-Hans": "无特性数据",
  },
  general: {
    en: "No data available",
    ja: "データがありません",
    "zh-Hant": "無數據可用",
    "zh-Hans": "无数据可用",
  },
};

const defaultIcons = {
  moves: "⚔️",
  descriptions: "📖",
  games: "🎮",
  sprites: "🖼️",
  evolution: "🔄",
  abilities: "✨",
  general: "📋",
};

const sizeClasses = {
  sm: {
    container: "p-4",
    icon: "text-2xl",
    text: "text-sm",
  },
  md: {
    container: "p-8",
    icon: "text-4xl",
    text: "text-base",
  },
  lg: {
    container: "p-12",
    icon: "text-6xl",
    text: "text-lg",
  },
};

export function DataEmptyState({
  type,
  language,
  customMessage,
  icon,
  size = "md",
}: DataEmptyStateProps) {
  const message = customMessage || emptyStateMessages[type][language];
  const displayIcon = icon || defaultIcons[type];
  const classes = sizeClasses[size];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center text-gray-500 ${classes.container}`}
    >
      <div className={`mb-4 ${classes.icon}`}>{displayIcon}</div>
      <p className={`font-medium ${classes.text}`}>{message}</p>
    </div>
  );
}
