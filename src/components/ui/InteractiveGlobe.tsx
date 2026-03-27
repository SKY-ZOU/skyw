'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.03, 0.04, 0.08],
      markerColor: [0.83, 0.69, 0.22],
      glowColor: [0.83, 0.69, 0.22],
      markers: [
        { location: [22.3193, 114.1694], size: 0.1 },    // HK
        { location: [1.3521, 103.8198], size: 0.08 },   // Singapore
        { location: [25.2048, 55.2708], size: 0.08 },   // Dubai
        { location: [51.5074, -0.1278], size: 0.08 },   // London
        { location: [39.9042, 116.4074], size: 0.06 },  // Beijing
      ],
      onRender: (state) => {
        // This is called on every animation frame
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
        className="w-full h-full object-contain opacity-90 transition-opacity duration-1000 ease-in-out cursor-grab active:cursor-grabbing"
        style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
      />
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#070B14_75%)] pointer-events-none" />
    </div>
  );
}
