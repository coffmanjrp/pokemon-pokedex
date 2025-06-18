'use client';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export function StatBar({ label, value, maxValue, color }: StatBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            backgroundColor: color,
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}