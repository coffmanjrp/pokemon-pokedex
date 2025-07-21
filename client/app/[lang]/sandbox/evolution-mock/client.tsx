"use client";

import React, { useState } from "react";
import { Dictionary, Locale } from "@/lib/dictionaries";
import { eeveeEvolutionMockData } from "./mockData";
import { TreeDesign } from "./designs/TreeDesign";
import { CircularDesign } from "./designs/CircularDesign";
import { GridDesign } from "./designs/GridDesign";
import { CardDesign } from "./designs/CardDesign";

interface EvolutionMockClientProps {
  dictionary: Dictionary;
  lang: Locale;
}

type DesignType = "tree" | "circular" | "grid" | "card";

export function EvolutionMockClient({
  dictionary,
  lang,
}: EvolutionMockClientProps) {
  const [currentDesign, setCurrentDesign] = useState<DesignType>("tree");

  const designs: { type: DesignType; label: string; description: string }[] = [
    {
      type: "tree",
      label: "ツリー構造",
      description: "中央から放射状に広がるデザイン",
    },
    {
      type: "circular",
      label: "円形配置",
      description: "イーブイを中心に円形に配置",
    },
    {
      type: "grid",
      label: "グリッド配置",
      description: "上下2段のグリッド形式",
    },
    {
      type: "card",
      label: "カード型",
      description: "左にイーブイ、右に進化先",
    },
  ];

  const renderDesign = () => {
    switch (currentDesign) {
      case "tree":
        return (
          <TreeDesign
            evolutionChain={eeveeEvolutionMockData}
            dictionary={dictionary}
            lang={lang}
          />
        );
      case "circular":
        return (
          <CircularDesign
            evolutionChain={eeveeEvolutionMockData}
            dictionary={dictionary}
            lang={lang}
          />
        );
      case "grid":
        return (
          <GridDesign
            evolutionChain={eeveeEvolutionMockData}
            dictionary={dictionary}
            lang={lang}
          />
        );
      case "card":
        return (
          <CardDesign
            evolutionChain={eeveeEvolutionMockData}
            dictionary={dictionary}
            lang={lang}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            イーブイ進化チェーン デザインモック
          </h1>
          <p className="text-gray-600">
            複数の進化分岐を持つポケモンの表示方法を比較
          </p>
        </div>

        {/* Design Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">デザインを選択</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {designs.map((design) => (
              <button
                key={design.type}
                onClick={() => setCurrentDesign(design.type)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentDesign === design.type
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium mb-1">{design.label}</div>
                <div className="text-sm text-gray-600">
                  {design.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Design Display */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">
              {designs.find((d) => d.type === currentDesign)?.label}
            </h3>
          </div>
          {renderDesign()}
        </div>

        {/* Notes */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">実装メモ</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 各デザインはレスポンシブ対応を考慮</li>
            <li>• ホバー時のインタラクションを追加予定</li>
            <li>• 進化条件のアイコン表示を検討中</li>
            <li>• 実際の実装時はアニメーションを追加</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
