import React from "react";

interface EvolutionArrowProps {
  condition: string;
  nextEvolutionId: string;
}

export function EvolutionArrow({
  condition,
  nextEvolutionId,
}: EvolutionArrowProps) {
  return (
    <div
      key={`arrow-${nextEvolutionId}`}
      className="flex flex-col md:flex-row items-center mx-2 md:mx-4"
    >
      <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-500 rotate-180 md:rotate-90 mb-2 md:mb-0 md:mr-2"></div>
      <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm text-blue-800 font-medium text-center whitespace-nowrap border border-blue-100 shadow-sm">
        {condition}
      </div>
    </div>
  );
}
