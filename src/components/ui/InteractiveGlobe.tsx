'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1, // 1 for dark mode
      diffuse: 0.2, // 0-1
      mapSamples: 16000,
      mapBrightness: 2.5,
      baseColor: [0.03, 0.04, 0.08], // Navy-950 base #070B14 roughly
      markerColor: [0.83, 0.69, 0.22], // Gold-400 marker #D4AF37 roughly
      glowColor: [0.83, 0.69, 0.22], // Gold glow
      markers: [
        // Hong Kong
        { location: [22.3193, 114.1694], size: 0.1 },
        // Singapore
        { location: [1.3521, 103.8198], size: 0.08 },
        // Dubai
        { location: [25.2048, 55.2708], size: 0.08 },
        // London
        { location: [51.5074, -0.1278], size: 0.08 },
        // Beijing
        { location: [39.9042, 116.4074], size: 0.06 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.003; // Rotation speed
        state.width = width * 2;
        state.height = width * 2;
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain opacity-90 transition-opacity duration-1000 ease-in-out cursor-grab active:cursor-grabbing"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Optional: Add a subtle radial gradient overlay to blend edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#070B14_70%)] pointer-events-none" />
    </div>
  );
}
