'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  geoOrthographic,
  geoPath,
  geoInterpolate,
  geoDistance,
  geoGraticule10,
} from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import type { Topology, GeometryCollection } from 'topojson-specification';

export interface GlobeHub {
  key: string;
  /** [longitude, latitude] — GeoJSON order */
  location: [number, number];
  active?: boolean;
  label?: string;
}

interface GlobeProps {
  /** Headquarters marker location [lng, lat] */
  hq: [number, number];
  hqLabel?: string;
  hubs: GlobeHub[];
  /** SVG viewBox dimension (square). Default 600 */
  size?: number;
  /** Allow drag-to-rotate. Default true */
  interactive?: boolean;
  /** Initial rotation [lambda, phi, gamma] for d3-geo projection. Default centers ~70°E. */
  initialRotation?: [number, number, number];
}

type CountryFeature = Feature<Geometry, GeoJsonProperties>;

export default function Globe({
  hq,
  hqLabel,
  hubs,
  size = 600,
  interactive = true,
  initialRotation = [-70, -22, 0],
}: GlobeProps) {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [rotation, setRotation] = useState<[number, number, number]>(initialRotation);
  const dragState = useRef<{ x: number; y: number; lambda: number; phi: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRotation = useRef<[number, number, number] | null>(null);

  // Fetch Natural Earth 110m country TopoJSON
  useEffect(() => {
    let cancelled = false;
    fetch('/countries-110m.json')
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (cancelled) return;
        const coll = topo.objects.countries as GeometryCollection;
        const fc = feature(topo, coll) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
        setCountries(fc.features);
      })
      .catch((e) => {
        console.warn('[Globe] failed to load country data', e);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(size / 2 - 8)
        .translate([size / 2, size / 2])
        .rotate(rotation)
        .clipAngle(90),
    [rotation, size],
  );

  const path = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => geoGraticule10(), []);
  const sphere = useMemo(() => ({ type: 'Sphere' as const }), []);

  // Great-circle arcs from HQ to each hub
  const arcs = useMemo(() => {
    return hubs.map((hub) => {
      const interp = geoInterpolate(hq, hub.location);
      const coords = Array.from({ length: 64 }, (_, i) => interp(i / 63));
      return {
        key: hub.key,
        active: !!hub.active,
        geo: { type: 'LineString' as const, coordinates: coords },
      };
    });
  }, [hq, hubs]);

  const isVisible = (p: [number, number]) => {
    // point is visible if angular distance from rotation center <= 90°
    const center: [number, number] = [-rotation[0], -rotation[1]];
    return geoDistance(p, center) <= Math.PI / 2 - 0.01;
  };

  // ─── Drag interaction (raf-coalesced for smoothness) ───
  const scheduleRotate = (next: [number, number, number]) => {
    pendingRotation.current = next;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingRotation.current) {
        setRotation(pendingRotation.current);
        pendingRotation.current = null;
      }
    });
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive) return;
    dragState.current = {
      x: e.clientX,
      y: e.clientY,
      lambda: rotation[0],
      phi: rotation[1],
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.x;
    const dy = e.clientY - dragState.current.y;
    const sensitivity = 0.35;
    const lambda = dragState.current.lambda + dx * sensitivity;
    const phi = Math.max(-80, Math.min(80, dragState.current.phi - dy * sensitivity));
    scheduleRotate([lambda, phi, 0]);
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    dragState.current = null;
    e.currentTarget.style.cursor = interactive ? 'grab' : 'default';
  };

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const hqPos = projection(hq);
  const hqVisible = isVisible(hq);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{
        width: '100%',
        height: '100%',
        cursor: interactive ? 'grab' : 'default',
        touchAction: 'pan-y',
        display: 'block',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <defs>
        <radialGradient id="globe-ocean" cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#17233B" />
          <stop offset="55%" stopColor="#0B1324" />
          <stop offset="100%" stopColor="#05080F" />
        </radialGradient>
        <linearGradient id="globe-land" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(245,241,230,0.14)" />
          <stop offset="60%" stopColor="rgba(245,241,230,0.08)" />
          <stop offset="100%" stopColor="rgba(245,241,230,0.04)" />
        </linearGradient>
        <radialGradient id="globe-hq-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C14852" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8B2A1A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="globe-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE08A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D4AF5F" stopOpacity="0" />
        </radialGradient>
        <filter id="globe-outer-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          <feComposite in2="SourceGraphic" operator="arithmetic" k2="1" k3="1" />
        </filter>
      </defs>

      {/* Outer atmosphere glow */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 4}
        fill="none"
        stroke="rgba(212,175,95,0.18)"
        strokeWidth={2}
        style={{ filter: 'blur(4px)' }}
      />

      {/* Ocean sphere */}
      <path
        d={path(sphere) ?? ''}
        fill="url(#globe-ocean)"
        stroke="rgba(212,175,95,0.45)"
        strokeWidth={1.2}
      />

      {/* Graticule */}
      <path
        d={path(graticule) ?? ''}
        fill="none"
        stroke="rgba(245,241,230,0.07)"
        strokeWidth={0.55}
      />

      {/* Countries */}
      <g
        fill="url(#globe-land)"
        stroke="rgba(212,175,95,0.4)"
        strokeWidth={0.55}
        strokeLinejoin="round"
      >
        {countries.map((f, i) => {
          const d = path(f);
          return d ? <path key={i} d={d} /> : null;
        })}
      </g>

      {/* Great-circle arcs from HQ */}
      <g fill="none" strokeLinecap="round">
        {/* Base dim pass for all arcs */}
        {arcs.map((a) => {
          const d = path(a.geo);
          if (!d) return null;
          return (
            <path
              key={`base-${a.key}`}
              d={d}
              stroke="rgba(212,175,95,0.35)"
              strokeWidth={1.2}
            />
          );
        })}
        {/* Bright emphasis pass */}
        {arcs.map((a) => {
          const d = path(a.geo);
          if (!d) return null;
          return (
            <path
              key={`top-${a.key}`}
              d={d}
              stroke={a.active ? '#FFE08A' : '#E5C374'}
              strokeWidth={a.active ? 2.6 : 1.6}
              opacity={a.active ? 1 : 0.9}
              style={{
                filter: a.active
                  ? 'drop-shadow(0 0 6px rgba(255,224,138,0.8)) drop-shadow(0 0 2px rgba(255,224,138,1))'
                  : 'drop-shadow(0 0 2px rgba(229,195,116,0.5))',
                transition: 'stroke-width .35s, stroke .35s, opacity .35s',
              }}
            />
          );
        })}
      </g>

      {/* HQ marker */}
      {hqVisible && hqPos && (
        <g>
          <circle cx={hqPos[0]} cy={hqPos[1]} r={26} fill="url(#globe-hq-glow)" />
          <rect
            x={hqPos[0] - 6}
            y={hqPos[1] - 6}
            width={12}
            height={12}
            fill="#C14852"
            stroke="#F5F1E6"
            strokeWidth={1.4}
            transform={`rotate(45 ${hqPos[0]} ${hqPos[1]})`}
            style={{ filter: 'drop-shadow(0 0 4px rgba(193,72,82,0.9))' }}
          />
          {hqLabel && (
            <text
              x={hqPos[0] + 14}
              y={hqPos[1] + 4}
              fill="#F5F1E6"
              fontSize={13}
              fontFamily="var(--font-serif-sc)"
              fontWeight={600}
              style={{ pointerEvents: 'none' }}
            >
              {hqLabel}
            </text>
          )}
        </g>
      )}

      {/* Hub markers */}
      {hubs.map((hub) => {
        const pos = projection(hub.location);
        if (!pos || !isVisible(hub.location)) return null;
        const [x, y] = pos;
        return (
          <g key={hub.key} style={{ pointerEvents: 'none' }}>
            <circle cx={x} cy={y} r={16} fill="url(#globe-hub-glow)" opacity={hub.active ? 0.9 : 0.5} />
            {hub.active && (
              <circle
                cx={x}
                cy={y}
                r={6}
                fill="none"
                stroke="#FFE08A"
                strokeWidth={1.2}
                opacity={0.7}
              >
                <animate attributeName="r" values="6;22;6" dur="2.6s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.75;0;0.75"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={hub.active ? 5 : 3.5}
              fill={hub.active ? '#FFE08A' : '#D4AF5F'}
              stroke="#F5F1E6"
              strokeWidth={hub.active ? 1.2 : 0.6}
              style={{
                filter: `drop-shadow(0 0 ${hub.active ? 5 : 2}px rgba(255,224,138,${hub.active ? 0.95 : 0.7}))`,
                transition: 'r .3s, fill .3s',
              }}
            />
            {hub.label && (
              <text
                x={x}
                y={y - (hub.active ? 10 : 8)}
                textAnchor="middle"
                fill={hub.active ? '#FFE08A' : 'rgba(245,241,230,0.75)'}
                fontSize={hub.active ? 11 : 10}
                fontFamily="var(--font-mono-disp)"
                fontWeight={hub.active ? 600 : 500}
                letterSpacing="0.08em"
                style={{ transition: 'all .3s' }}
              >
                {hub.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
