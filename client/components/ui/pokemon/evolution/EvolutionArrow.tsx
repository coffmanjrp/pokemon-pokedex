import React from "react";

interface EvolutionArrowProps {
  condition?: string;
  nextEvolutionId: string;
  showCondition?: boolean;
  variant?: "horizontal" | "vertical";
}

export function EvolutionArrow({
  condition,
  nextEvolutionId,
  showCondition = true,
  variant = "horizontal",
}: EvolutionArrowProps) {
  const isVertical = variant === "vertical";

  return (
    <div
      key={`arrow-${nextEvolutionId}`}
      className={`flex ${isVertical ? "flex-col" : "flex-col md:flex-row"} items-center mx-2 md:mx-4`}
    >
      <div
        className={`w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-500 ${isVertical ? "rotate-180" : "rotate-180 md:rotate-90"} ${showCondition ? "mb-2 md:mb-0 md:mr-2" : ""}`}
      ></div>
      {showCondition && condition && (
        <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm text-blue-800 font-medium text-center whitespace-nowrap border border-blue-100 shadow-sm">
          {condition}
        </div>
      )}
    </div>
  );
}
