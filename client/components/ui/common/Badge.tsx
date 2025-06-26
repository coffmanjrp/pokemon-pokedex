import React from "react";
import { getTypeColorFromName } from "@/lib/pokemonUtils";

interface BaseBadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface TypeBadgeProps {
  type: string;
  displayName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface LevelBadgeProps {
  level: number | string;
  variant?: "level" | "tm" | "tutor" | "egg";
  className?: string;
}

interface GameBadgeProps {
  game: string;
  version?: string;
  className?: string;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

const variantClasses = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  secondary: "bg-gray-100 text-gray-600",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BaseBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function TypeBadge({
  type,
  displayName,
  size = "md",
  className = "",
}: TypeBadgeProps) {
  const typeColor = getTypeColorFromName(type);
  const text = displayName || type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: typeColor,
        color: "white",
        border: "none",
      }}
    >
      {text}
    </span>
  );
}

export function LevelBadge({
  level,
  variant = "level",
  className = "",
}: LevelBadgeProps) {
  const variantStyles = {
    level: "bg-blue-100 text-blue-800",
    tm: "bg-purple-100 text-purple-800",
    tutor: "bg-green-100 text-green-800",
    egg: "bg-yellow-100 text-yellow-800",
  };

  const displayText = typeof level === "number" ? `Lv. ${level}` : level;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full px-2 py-1 text-xs ${variantStyles[variant]} ${className}`}
    >
      {displayText}
    </span>
  );
}

export function GameBadge({ game, version, className = "" }: GameBadgeProps) {
  const displayText = version ? `${game} ${version}` : game;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full px-2 py-1 text-xs bg-indigo-100 text-indigo-800 ${className}`}
    >
      {displayText}
    </span>
  );
}
