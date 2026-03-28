'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function GlobalNetworkPulse() {
  // Define positions for cities on a 800x400 SVG coordinate system
  const cities = [
    { id: 'hk', name: 'HONG KONG', x: 620, y: 220, main: true },
    { id: 'london', name: 'LONDON', x: 120, y: 130 },
    { id: 'dubai', name: 'DUBAI', x: 380, y: 200 },
    { id: 'singapore', name: 'SINGAPORE', x: 580, y: 280 },
    { id: 'newyork', name: 'NEW YORK', x: 100, y: 350, hidden: true }, // Off-map decorative
  ];

  // Connections from HK to others
  const connections = [
    { from: 'hk', to: 'london', curve: -50 },
    { from: 'hk', to: 'dubai', curve: -30 },
    { from: 'hk', to: 'singapore', curve: 20 },
  ];

  return (
    <div className="relative w-full aspect-[16/9] max-w-[800px] mx-auto overflow-hidden bg-navy-950/20 rounded-xl backdrop-blur-sm border border-white/5">
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="glowHK" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(620 220) rotate(90) scale(60)">
            <stop stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          
          <pattern id="world-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="rgba(212,175,55,0.12)" />
          </pattern>

          <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* World Dotted Grid Background */}
        <rect width="800" height="400" fill="url(#world-dots)" />

        {/* Subtle World Outlines (Abstract) */}
        <motion.path
          d="M50 150 Q150 80 250 180 T450 130 T650 220 T750 180"
          stroke="rgba(212,175,55,0.05)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M100 280 Q250 350 400 250 T700 300"
          stroke="rgba(212,175,55,0.05)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Global Connections Arcs */}
        {connections.map((conn, idx) => {
          const from = cities.find(c => c.id === conn.from)!;
          const to = cities.find(c => c.id === conn.to)!;
          // Calculate midpoint for the quadratic curve
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 + conn.curve;
          const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

          return (
            <g key={idx}>
              {/* Static Path */}
              <path
                d={pathD}
                stroke="rgba(212,175,55,0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Animated Light Beam */}
              <motion.path
                d={pathD}
                stroke="url(#beamGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: idx * 1.2,
                  ease: "easeInOut",
                }}
              />
              <defs>
                <linearGradient id="beamGradient" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </g>
          );
        })}

        {/* City Nodes */}
        {cities.filter(c => !c.hidden).map((city) => (
          <g key={city.id}>
            {/* Pulsing Aura */}
            <motion.circle
              cx={city.x}
              cy={city.y}
              r={city.main ? 15 : 8}
              fill="rgba(212,175,55,0.2)"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            />
            
            {/* Core Dot */}
            <circle
              cx={city.x}
              cy={city.y}
              r={city.main ? 4 : 2.5}
              fill={city.main ? "#D4AF37" : "#D4AF37"}
              className="shadow-glow"
            />

            {/* Label */}
            <text
              x={city.x}
              y={city.y + (city.main ? 25 : 18)}
              textAnchor="middle"
              fill={city.main ? "rgba(212,175,55,0.9)" : "rgba(255,255,255,0.4)"}
              fontSize={city.main ? "10" : "8"}
              fontWeight={city.main ? "600" : "400"}
              letterSpacing="0.15em"
              className="pointer-events-none select-none"
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* Center Glow for HK */}
        <circle cx="620" cy="220" r="60" fill="url(#glowHK)" pointerEvents="none" />
      </svg>

      {/* CSS For Glow Effects */}
      <style jsx>{`
        .shadow-glow {
          filter: drop-shadow(0 0 4px rgba(212,175,55,0.8));
        }
      `}</style>
    </div>
  );
}
