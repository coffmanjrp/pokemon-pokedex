import { gsap } from "gsap";
import { AnimationConfig } from "./types";

export function createCardEcho({
  targetElement,
  gridContainer,
}: AnimationConfig) {
  if (!gridContainer) {
    console.warn("Grid container is required for card echo effect");
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const containerRect = gridContainer.getBoundingClientRect();

  // Create 4 echo copies that will expand outward
  const echoCount = 4;
  const echoes: HTMLElement[] = [];

  for (let i = 0; i < echoCount; i++) {
    const echo = targetElement.cloneNode(true) as HTMLElement;

    // Position echo exactly over the original card
    echo.style.cssText = `
      position: absolute;
      left: ${rect.left - containerRect.left}px;
      top: ${rect.top - containerRect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      opacity: ${0.6 - i * 0.1};
      pointer-events: none;
      z-index: ${10 - i};
      border-radius: 12px;
      transform: scale(1);
      transition: none;
    `;

    // Remove any interactive elements from the echo
    const interactiveElements = echo.querySelectorAll("button, a, [onclick]");
    interactiveElements.forEach((el) => {
      el.removeAttribute("onclick");
      (el as HTMLElement).style.pointerEvents = "none";
    });

    gridContainer.appendChild(echo);
    echoes.push(echo);
  }

  // Animate echoes expanding outward in sequence
  const tl = gsap.timeline({
    onComplete: () => {
      echoes.forEach((echo) => {
        if (gridContainer.contains(echo)) {
          gridContainer.removeChild(echo);
        }
      });
    },
  });

  // Original card pulse
  tl.to(targetElement, {
    scale: 1.05,
    duration: 0.1,
    ease: "power2.out",
  }).to(targetElement, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
  });

  // Echo waves expanding outward with delay (smaller scale)
  echoes.forEach((echo, index) => {
    tl.to(
      echo,
      {
        scale: 1.1 + index * 0.05,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: index * 0.1,
      },
      0.1,
    );
  });
}
