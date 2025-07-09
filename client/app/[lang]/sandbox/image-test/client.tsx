"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Locale } from "@/lib/dictionaries";

interface ImageTestClientProps {
  lang: Locale;
}

interface TestResult {
  method: string;
  status: "loading" | "success" | "error";
  loadTime?: number;
  errorMessage?: string;
}

export function ImageTestClient({ lang }: ImageTestClientProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { method: "Next.js Image (optimized)", status: "loading" },
    { method: "Next.js Image (unoptimized)", status: "loading" },
    { method: "Standard img tag", status: "loading" },
  ]);

  const updateTestResult = (index: number, updates: Partial<TestResult>) => {
    setTestResults((prev) =>
      prev.map((result, i) =>
        i === index ? { ...result, ...updates } : result,
      ),
    );
  };

  const handleImageLoad = (index: number, startTime: number) => {
    const loadTime = Date.now() - startTime;
    updateTestResult(index, { status: "success", loadTime });
  };

  const handleImageError = (index: number, error: string) => {
    updateTestResult(index, { status: "error", errorMessage: error });
  };

  const TestSection = ({
    title,
    children,
    index,
  }: {
    title: string;
    children: React.ReactNode;
    index: number;
  }) => {
    const result = testResults[index];

    if (!result) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center space-x-2">
            {result.status === "loading" && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading...
              </div>
            )}
            {result.status === "success" && (
              <div className="flex items-center text-green-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Success ({result.loadTime}ms)
              </div>
            )}
            {result.status === "error" && (
              <div className="flex items-center text-red-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Error
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
          <div className="flex-shrink-0 mb-4 lg:mb-0">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-64 h-64 flex items-center justify-center">
              {children}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="text-sm text-gray-600">
              <strong>Method:</strong> {result.method}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Status:</strong>{" "}
              <span
                className={
                  result.status === "success"
                    ? "text-green-600"
                    : result.status === "error"
                      ? "text-red-600"
                      : "text-blue-600"
                }
              >
                {result.status}
              </span>
            </div>
            {result.loadTime && (
              <div className="text-sm text-gray-600">
                <strong>Load Time:</strong> {result.loadTime}ms
              </div>
            )}
            {result.errorMessage && (
              <div className="text-sm text-red-600">
                <strong>Error:</strong> {result.errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Test Overview
        </h2>
        <p className="text-gray-600 mb-4">
          This page tests different ways to display the{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">placeholder.png</code>{" "}
          file located in the public directory using Next.js Image component and
          standard HTML img tag.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                result.status === "success"
                  ? "border-green-500 bg-green-50"
                  : result.status === "error"
                    ? "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
              }`}
            >
              <div className="font-medium text-gray-800">{result.method}</div>
              <div className="text-sm text-gray-600 capitalize">
                {result.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test 1: Next.js Image (Optimized) */}
      <TestSection
        title="Test 1: Next.js Image Component (Optimized)"
        index={0}
      >
        <Image
          src="/placeholder.png"
          alt="Placeholder test image (optimized)"
          width={200}
          height={200}
          className="object-contain"
          priority
          onLoad={() => handleImageLoad(0, Date.now())}
          onError={() => handleImageError(0, "Failed to load image")}
        />
      </TestSection>

      {/* Test 2: Next.js Image (Unoptimized) */}
      <TestSection
        title="Test 2: Next.js Image Component (Unoptimized)"
        index={1}
      >
        <Image
          src="/placeholder.png"
          alt="Placeholder test image (unoptimized)"
          width={200}
          height={200}
          className="object-contain"
          unoptimized
          onLoad={() => handleImageLoad(1, Date.now())}
          onError={() => handleImageError(1, "Failed to load image")}
        />
      </TestSection>

      {/* Test 3: Standard img tag */}
      <TestSection title="Test 3: Standard HTML img Tag" index={2}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/placeholder.png"
          alt="Placeholder test image (standard img)"
          className="w-[200px] h-[200px] object-contain"
          onLoad={() => handleImageLoad(2, Date.now())}
          onError={() => handleImageError(2, "Failed to load image")}
        />
      </TestSection>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Instructions
        </h3>
        <ul className="text-blue-700 space-y-2">
          <li>• Open the browser&apos;s Network tab to see image requests</li>
          <li>• Check for any console errors related to image loading</li>
          <li>
            • Compare load times between optimized and unoptimized versions
          </li>
          <li>
            • Verify that all three methods successfully display the image
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3>
        <div className="space-x-4">
          <a
            href={`/${lang}/sandbox`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Sandbox
          </a>
          <a
            href={`/${lang}`}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
