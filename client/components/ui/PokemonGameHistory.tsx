'use client';

import { GameIndex, Generation } from '@/types/pokemon';

interface PokemonGameHistoryProps {
  gameIndices?: GameIndex[];
  generation?: Generation;
  language: 'en' | 'ja';
}

export function PokemonGameHistory({ gameIndices, generation, language }: PokemonGameHistoryProps) {
  if (!gameIndices || gameIndices.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        {language === 'en' ? 'No game appearance data available' : 'ゲーム出現データがありません'}
      </div>
    );
  }

  // Game version display names
  const getGameDisplayName = (version: string) => {
    const gameNames: Record<string, { en: string; ja: string }> = {
      'red': { en: 'Red', ja: '赤' },
      'blue': { en: 'Blue', ja: '青' },
      'yellow': { en: 'Yellow', ja: 'ピカチュウ' },
      'gold': { en: 'Gold', ja: '金' },
      'silver': { en: 'Silver', ja: '銀' },
      'crystal': { en: 'Crystal', ja: 'クリスタル' },
      'ruby': { en: 'Ruby', ja: 'ルビー' },
      'sapphire': { en: 'Sapphire', ja: 'サファイア' },
      'emerald': { en: 'Emerald', ja: 'エメラルド' },
      'firered': { en: 'FireRed', ja: 'ファイアレッド' },
      'leafgreen': { en: 'LeafGreen', ja: 'リーフグリーン' },
      'diamond': { en: 'Diamond', ja: 'ダイヤモンド' },
      'pearl': { en: 'Pearl', ja: 'パール' },
      'platinum': { en: 'Platinum', ja: 'プラチナ' },
      'heartgold': { en: 'HeartGold', ja: 'ハートゴールド' },
      'soulsilver': { en: 'SoulSilver', ja: 'ソウルシルバー' },
      'black': { en: 'Black', ja: 'ブラック' },
      'white': { en: 'White', ja: 'ホワイト' },
      'black-2': { en: 'Black 2', ja: 'ブラック2' },
      'white-2': { en: 'White 2', ja: 'ホワイト2' },
      'x': { en: 'X', ja: 'X' },
      'y': { en: 'Y', ja: 'Y' },
      'omega-ruby': { en: 'Omega Ruby', ja: 'オメガルビー' },
      'alpha-sapphire': { en: 'Alpha Sapphire', ja: 'アルファサファイア' },
      'sun': { en: 'Sun', ja: 'サン' },
      'moon': { en: 'Moon', ja: 'ムーン' },
      'ultra-sun': { en: 'Ultra Sun', ja: 'ウルトラサン' },
      'ultra-moon': { en: 'Ultra Moon', ja: 'ウルトラムーン' },
      'sword': { en: 'Sword', ja: 'ソード' },
      'shield': { en: 'Shield', ja: 'シールド' },
      'brilliant-diamond': { en: 'Brilliant Diamond', ja: 'ブリリアントダイヤモンド' },
      'shining-pearl': { en: 'Shining Pearl', ja: 'シャイニングパール' },
      'legends-arceus': { en: 'Legends: Arceus', ja: 'レジェンズアルセウス' },
      'scarlet': { en: 'Scarlet', ja: 'スカーレット' },
      'violet': { en: 'Violet', ja: 'バイオレット' },
    };

    return gameNames[version]?.[language] || version.charAt(0).toUpperCase() + version.slice(1);
  };

  // Group games by generation/era
  const groupGamesByEra = () => {
    const eras: Record<string, GameIndex[]> = {};
    
    gameIndices.forEach(gameIndex => {
      const version = gameIndex.version.name;
      let era = 'Other';
      
      if (['red', 'blue', 'yellow'].includes(version)) {
        era = language === 'en' ? 'Generation I (Kanto)' : '第1世代 (カントー)';
      } else if (['gold', 'silver', 'crystal'].includes(version)) {
        era = language === 'en' ? 'Generation II (Johto)' : '第2世代 (ジョウト)';
      } else if (['ruby', 'sapphire', 'emerald', 'firered', 'leafgreen'].includes(version)) {
        era = language === 'en' ? 'Generation III (Hoenn)' : '第3世代 (ホウエン)';
      } else if (['diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver'].includes(version)) {
        era = language === 'en' ? 'Generation IV (Sinnoh)' : '第4世代 (シンオウ)';
      } else if (['black', 'white', 'black-2', 'white-2'].includes(version)) {
        era = language === 'en' ? 'Generation V (Unova)' : '第5世代 (イッシュ)';
      } else if (['x', 'y', 'omega-ruby', 'alpha-sapphire'].includes(version)) {
        era = language === 'en' ? 'Generation VI (Kalos)' : '第6世代 (カロス)';
      } else if (['sun', 'moon', 'ultra-sun', 'ultra-moon'].includes(version)) {
        era = language === 'en' ? 'Generation VII (Alola)' : '第7世代 (アローラ)';
      } else if (['sword', 'shield'].includes(version)) {
        era = language === 'en' ? 'Generation VIII (Galar)' : '第8世代 (ガラル)';
      } else if (['brilliant-diamond', 'shining-pearl', 'legends-arceus'].includes(version)) {
        era = language === 'en' ? 'Generation VIII (Remakes)' : '第8世代 (リメイク)';
      } else if (['scarlet', 'violet'].includes(version)) {
        era = language === 'en' ? 'Generation IX (Paldea)' : '第9世代 (パルデア)';
      }
      
      if (!eras[era]) {
        eras[era] = [];
      }
      eras[era].push(gameIndex);
    });
    
    return eras;
  };

  const gamesByEra = groupGamesByEra();

  return (
    <div className="space-y-6">
      {/* Generation Info */}
      {generation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            {language === 'en' ? 'Origin Generation' : '初出世代'}
          </h4>
          <p className="text-blue-800">
            {generation.name.charAt(0).toUpperCase() + generation.name.slice(1)}
          </p>
        </div>
      )}

      {/* Game Appearances by Era */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">
          {language === 'en' ? 'Game Appearances' : 'ゲーム出現履歴'}
        </h4>
        
        {Object.entries(gamesByEra).map(([era, games]) => (
          <div key={era} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h5 className="font-medium text-gray-800">{era}</h5>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {games.map((gameIndex, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {getGameDisplayName(gameIndex.version.name)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      #{gameIndex.gameIndex.toString().padStart(3, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">
            {language === 'en' ? 'Total Appearances:' : '総出現回数:'}
          </span>
          <span className="ml-2">{gameIndices.length}</span>
          <span className="ml-4 font-medium">
            {language === 'en' ? 'Generations:' : '世代:'}
          </span>
          <span className="ml-2">{Object.keys(gamesByEra).length}</span>
        </div>
      </div>
    </div>
  );
}