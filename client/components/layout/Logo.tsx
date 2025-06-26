"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="Pokédex"
        width={120}
        height={45}
        priority
        className="h-auto w-auto"
      />
    </div>
  );
}
