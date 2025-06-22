'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface DataUpgradeIndicatorProps {
  isUpgrading: boolean;
  hasUpgraded: boolean;
  isBasicData: boolean;
  className?: string;
}

export default function DataUpgradeIndicator({
  isUpgrading,
  hasUpgraded,
  isBasicData,
  className = ''
}: DataUpgradeIndicatorProps) {
  const [showUpgradeNotification, setShowUpgradeNotification] = useState(false);
  const basicDataRef = useRef<HTMLDivElement>(null);
  const upgradingRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Animate basic data indicator
  useEffect(() => {
    if (isBasicData && !isUpgrading && basicDataRef.current) {
      gsap.fromTo(basicDataRef.current, 
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isBasicData, isUpgrading]);

  // Animate upgrading indicator
  useEffect(() => {
    if (isUpgrading && upgradingRef.current) {
      gsap.fromTo(upgradingRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isUpgrading]);

  // Show notification when upgrade completes
  useEffect(() => {
    if (hasUpgraded) {
      setShowUpgradeNotification(true);
      
      if (notificationRef.current) {
        gsap.fromTo(notificationRef.current,
          { opacity: 0, y: -20, scale: 0.8 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.4, 
            ease: "elastic.out(1, 0.5)",
            onComplete: () => {
              // Auto-hide after animation completes
              setTimeout(() => {
                if (notificationRef.current) {
                  gsap.to(notificationRef.current, {
                    opacity: 0,
                    y: -20,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "back.in(1.7)",
                    onComplete: () => setShowUpgradeNotification(false)
                  });
                }
              }, 2500);
            }
          }
        );
      }
    }
  }, [hasUpgraded]);

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      {isBasicData && !isUpgrading && (
        <div
          ref={basicDataRef}
          className="bg-blue-500/90 text-white px-3 py-2 rounded-lg text-sm shadow-lg backdrop-blur-sm border border-blue-400/30"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
            <span>Loading basic data...</span>
          </div>
        </div>
      )}

      {isUpgrading && (
        <div
          ref={upgradingRef}
          className="bg-yellow-500/90 text-white px-3 py-2 rounded-lg text-sm shadow-lg backdrop-blur-sm border border-yellow-400/30"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-spin"></div>
            <span>Enhancing with full data...</span>
          </div>
        </div>
      )}

      {showUpgradeNotification && (
        <div
          ref={notificationRef}
          className="bg-green-500/90 text-white px-3 py-2 rounded-lg text-sm shadow-lg backdrop-blur-sm border border-green-400/30"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span>Data enhanced!</span>
          </div>
        </div>
      )}
    </div>
  );
}