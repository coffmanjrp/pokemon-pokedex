"use client";

import { useEffect, useState } from "react";

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    limit: number;
  } | null;
  domNodes: number;
  renderTime: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: null,
    domNodes: 0,
    renderTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        // Measure DOM nodes
        const domNodes = document.getElementsByTagName("*").length;

        // Measure memory if available
        let memory = null;
        const performanceWithMemory = performance as Performance & {
          memory?: {
            usedJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        };
        if ("memory" in performance && performanceWithMemory.memory) {
          const memInfo = performanceWithMemory.memory;
          memory = {
            used: Math.round(memInfo.usedJSHeapSize / 1048576), // Convert to MB
            limit: Math.round(memInfo.jsHeapSizeLimit / 1048576),
          };
        }

        setMetrics((prev) => ({
          ...prev,
          fps,
          memory,
          domNodes,
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Show/hide with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg font-mono text-sm z-50 min-w-[200px]">
      <h3 className="text-xs font-bold mb-2 text-gray-400">PERFORMANCE</h3>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span
            className={
              metrics.fps < 30
                ? "text-red-400"
                : metrics.fps < 50
                  ? "text-yellow-400"
                  : "text-green-400"
            }
          >
            {metrics.fps}
          </span>
        </div>

        <div className="flex justify-between">
          <span>DOM Nodes:</span>
          <span
            className={
              metrics.domNodes > 5000
                ? "text-red-400"
                : metrics.domNodes > 2000
                  ? "text-yellow-400"
                  : "text-green-400"
            }
          >
            {metrics.domNodes.toLocaleString()}
          </span>
        </div>

        {metrics.memory && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span
              className={
                metrics.memory.used > metrics.memory.limit * 0.8
                  ? "text-red-400"
                  : "text-green-400"
              }
            >
              {metrics.memory.used}MB
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}
