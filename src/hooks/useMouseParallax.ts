import { useState, useEffect } from 'react';

interface ParallaxOffset {
  x: number;
  y: number;
}

/**
 * useMouseParallax:
 * Provides subtle, dampened offset coords (-1 to 1 normalized) on desktop.
 * Gracefully disables on touch devices, mobile viewports, or when prefers-reduced-motion is active.
 */
export function useMouseParallax(damping = 15): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    // Check for reduced motion or touch device
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (mediaQuery.matches || isTouch) {
      return;
    }

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      targetX = ((e.clientX / innerWidth) - 0.5) * 2;
      targetY = ((e.clientY / innerHeight) - 0.5) * 2;
    };

    const updateLoop = () => {
      // Smooth lerp towards target
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      setOffset({
        x: Math.round(currentX * damping * 10) / 10,
        y: Math.round(currentY * damping * 10) / 10,
      });

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [damping]);

  return offset;
}
