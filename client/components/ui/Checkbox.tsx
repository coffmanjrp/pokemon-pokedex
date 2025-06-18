'use client';

import { cn } from '@/lib/utils';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Checkbox({ id, checked, onChange, label, className, style }: CheckboxProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className="flex items-center cursor-pointer"
        style={style}
      >
        <div
          className={cn(
            "w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center transition-all duration-200",
            checked 
              ? "bg-blue-600 border-blue-600" 
              : "border-gray-300 hover:border-gray-400"
          )}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <span className={cn("text-sm font-medium", checked ? "text-gray-900" : "text-gray-700")}>
          {label}
        </span>
      </label>
    </div>
  );
}