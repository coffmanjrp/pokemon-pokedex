'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedLoadingScreenProps {
  language: 'en' | 'ja';
  onComplete?: () => void;
}

export function AnimatedLoadingScreen({ language, onComplete }: AnimatedLoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pokeballRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pokeballRef.current || !textRef.current || !dotsRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Immediately call onComplete without fade out animation
        if (onComplete) {
          onComplete();
        }
      }
    });

    // Initial state - completely hidden
    gsap.set([pokeballRef.current, textRef.current, dotsRef.current], {
      opacity: 0,
      scale: 0.3,
      y: 20
    });

    // Animation sequence
    tl
      // Pokeball entrance with bounce
      .to(pokeballRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "bounce.out",
        delay: 0.3
      })
      // Pokeball rotation loop (infinite during loading)
      .to(pokeballRef.current, {
        rotation: 360,
        duration: 1.5,
        ease: "none",
        repeat: 1
      }, "-=0.4")
      // Text entrance
      .to(textRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=2.0")
      // Loading dots animation
      .to(dotsRef.current, {
        opacity: 1,
        scale: 0.5,
        y: 0,
        duration: 0.3
      }, "-=1.4");

    // Dots pulsing animation (separate timeline)
    const dotsChildren = dotsRef.current.children;
    gsap.fromTo(dotsChildren, 
      { scale: 1 },
      {
        scale: 1.5,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
        delay: 1
      }
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-emerald-100"
      >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => {
          // Use deterministic positions based on index to avoid hydration mismatch
          const positions = [
            { left: 10, top: 20, delay: 0.5 },
            { left: 80, top: 15, delay: 1.2 },
            { left: 25, top: 70, delay: 0.8 },
            { left: 60, top: 30, delay: 1.8 },
            { left: 90, top: 60, delay: 0.3 },
            { left: 15, top: 85, delay: 2.1 },
            { left: 70, top: 10, delay: 1.5 },
            { left: 40, top: 50, delay: 0.9 },
            { left: 85, top: 35, delay: 1.7 },
            { left: 20, top: 45, delay: 0.6 },
            { left: 95, top: 80, delay: 2.4 },
            { left: 55, top: 75, delay: 1.1 },
            { left: 30, top: 25, delay: 1.9 },
            { left: 75, top: 90, delay: 0.4 },
            { left: 45, top: 5, delay: 2.2 }
          ];
          const pos = positions[i] || { left: 50, top: 50, delay: 1.0 };
          
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationName: 'float',
                animationDuration: '3s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${pos.delay}s`
              }}
            />
          );
        })}
      </div>

      <div className="text-center z-10">
        {/* Pokeball Animation */}
        <div ref={pokeballRef} className="mx-auto mb-8 opacity-0">
          <div className="relative w-32 h-32 mx-auto">
            {/* Enhanced Pokeball SVG */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xl"
            >
              {/* Outer circle frame */}
              <circle cx="100" cy="100" r="90" stroke="black" strokeWidth="8" fill="white"/>
              {/* Top half red section */}
              <path d="M 10,100 A 90,90 0 0,1 190,100 L 110,100 A 10,10 0 0,0 90,100 Z" fill="#DC2626"/>
              {/* Center dividing line */}
              <line x1="10" y1="100" x2="190" y2="100" stroke="black" strokeWidth="8"/>
              {/* Center button outer circle */}
              <circle cx="100" cy="100" r="20" stroke="black" strokeWidth="8" fill="white"/>
              {/* Center button inner circle */}
              <circle cx="100" cy="100" r="8" fill="white" stroke="black" strokeWidth="4"/>
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div ref={textRef} className="opacity-0">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            {language === 'en' ? 'Loading Pokédex...' : 'ポケモン図鑑を読み込み中...'}
          </h2>
        </div>

        {/* Loading Dots */}
        <div ref={dotsRef} className="flex justify-center space-x-2 opacity-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </div>
      </div>
      </div>
    </>
  );
}