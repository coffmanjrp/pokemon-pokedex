"use client";

import { Dictionary, interpolate } from "@/lib/dictionaries";

interface DetailPageFooterProps {
  dictionary: Dictionary;
}

export function DetailPageFooter({ dictionary }: DetailPageFooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center text-sm text-gray-600">
          {/* Copyright Notice */}
          <p className="font-medium">
            {interpolate(dictionary.footer.copyright, {
              currentYear: new Date().getFullYear(),
            })}
          </p>

          {/* Trademark Notice */}
          <p>{dictionary.footer.trademark}</p>

          {/* Disclaimer */}
          <p className="text-xs">{dictionary.footer.disclaimer}</p>

          {/* PokeAPI Credit */}
          <p className="text-xs">
            {dictionary.footer.dataSource}{" "}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              PokeAPI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
