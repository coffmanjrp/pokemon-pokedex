"use client";

import { Dictionary, interpolate } from "@/lib/dictionaries";

interface CopyrightNoticeProps {
  dictionary: Dictionary;
}

export function CopyrightNotice({ dictionary }: CopyrightNoticeProps) {
  return (
    <div className="mt-4 pt-3 border-t border-gray-50">
      <div className="text-[9px] text-gray-400 space-y-0.5 leading-tight">
        <p>
          {interpolate(dictionary.footer.copyright, {
            currentYear: new Date().getFullYear(),
          })}
        </p>
        <p>{dictionary.footer.disclaimer}</p>
        <p>
          {dictionary.footer.dataSource}{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-500 underline"
          >
            PokeAPI
          </a>
        </p>
      </div>
    </div>
  );
}
