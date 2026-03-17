import React from "react";

interface FurnitureFootprintProps {
  type: string;
  width: number;
  length: number;
  color: string;
  /** Whether this item is currently selected */
  selected?: boolean;
}

// Derive a darker shade for strokes and accent lines
function darken(hex: string, amount = 0.25): string {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3
    ? c.split("").map(x => x + x).join("")
    : c, 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

function lighten(hex: string, amount = 0.3): string {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3
    ? c.split("").map(x => x + x).join("")
    : c, 16);
  const r = Math.min(255, Math.floor(((num >> 16) & 0xff) + 255 * amount));
  const g = Math.min(255, Math.floor(((num >> 8) & 0xff) + 255 * amount));
  const b = Math.min(255, Math.floor((num & 0xff) + 255 * amount));
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Renders an architectural top-down plan symbol for a furniture item.
 * Uses the item's color for fill, with darker strokes for definition.
 */
export function FurnitureFootprint({ type, width, length, color, selected }: FurnitureFootprintProps) {
  const W = width;
  const L = length;
  const stroke = darken(color, 0.35);
  const light = lighten(color, 0.25);
  const sw = Math.max(1, Math.min(3, W / 40)); // stroke width relative to size

  const sharedProps = {
    fill: color,
    stroke,
    strokeWidth: sw,
    strokeLinejoin: "round" as const,
  };

  const renderShape = () => {
    switch (type) {
      case "sofa": {
        const arm = Math.min(W * 0.12, 16);
        const back = Math.min(L * 0.28, 28);
        return (
          <g>
            {/* Seat base */}
            <rect x={arm} y={back} width={W - arm * 2} height={L - back - arm * 0.5}
              rx={4} {...sharedProps} />
            {/* Backrest */}
            <rect x={0} y={0} width={W} height={back} rx={5} {...sharedProps} fill={light} />
            {/* Left arm */}
            <rect x={0} y={back} width={arm} height={L - back} rx={3} {...sharedProps} fill={light} />
            {/* Right arm */}
            <rect x={W - arm} y={back} width={arm} height={L - back} rx={3} {...sharedProps} fill={light} />
            {/* Cushion divider lines */}
            {[1, 2].map(i => (
              <line
                key={i}
                x1={arm + (W - arm * 2) / 3 * i}
                y1={back + 4}
                x2={arm + (W - arm * 2) / 3 * i}
                y2={L - arm * 0.5 - 4}
                stroke={stroke} strokeWidth={sw * 0.6} strokeDasharray="3 3"
              />
            ))}
          </g>
        );
      }

      case "chair": {
        const back = Math.min(L * 0.3, 22);
        const arm = Math.min(W * 0.1, 8);
        return (
          <g>
            {/* Seat */}
            <rect x={arm} y={back} width={W - arm * 2} height={L - back} rx={4} {...sharedProps} />
            {/* Backrest */}
            <rect x={0} y={0} width={W} height={back} rx={4} {...sharedProps} fill={light} />
            {/* Arms */}
            <rect x={0} y={back} width={arm} height={(L - back) * 0.6} rx={2} {...sharedProps} fill={light} />
            <rect x={W - arm} y={back} width={arm} height={(L - back) * 0.6} rx={2} {...sharedProps} fill={light} />
          </g>
        );
      }

      case "bed": {
        const headboard = Math.min(L * 0.18, 28);
        const pillarW = Math.min(W * 0.12, 18);
        return (
          <g>
            {/* Mattress */}
            <rect x={0} y={headboard} width={W} height={L - headboard} rx={3} {...sharedProps} />
            {/* Headboard */}
            <rect x={0} y={0} width={W} height={headboard} rx={4} {...sharedProps} fill={light} />
            {/* Pillows */}
            <rect x={W * 0.08} y={headboard + 6} width={W * 0.36} height={headboard * 1.4} rx={4}
              fill={lighten(color, 0.5)} stroke={stroke} strokeWidth={sw * 0.7} />
            <rect x={W * 0.56} y={headboard + 6} width={W * 0.36} height={headboard * 1.4} rx={4}
              fill={lighten(color, 0.5)} stroke={stroke} strokeWidth={sw * 0.7} />
            {/* Foot posts */}
            <rect x={0} y={L - 8} width={pillarW} height={8} rx={2}
              fill={stroke} stroke={stroke} strokeWidth={sw} />
            <rect x={W - pillarW} y={L - 8} width={pillarW} height={8} rx={2}
              fill={stroke} stroke={stroke} strokeWidth={sw} />
          </g>
        );
      }

      case "table": {
        const isRound = Math.abs(W - L) < 20;
        const legSize = Math.min(W, L) * 0.1;
        return (
          <g>
            {/* Surface */}
            {isRound
              ? <ellipse cx={W / 2} cy={L / 2} rx={W / 2 - sw / 2} ry={L / 2 - sw / 2} {...sharedProps} />
              : <rect x={0} y={0} width={W} height={L} rx={3} {...sharedProps} />
            }
            {/* Legs as corner accents */}
            {[
              [0, 0], [W - legSize, 0], [0, L - legSize], [W - legSize, L - legSize]
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width={legSize} height={legSize} rx={1}
                fill={stroke} stroke="none" />
            ))}
          </g>
        );
      }

      case "side-table": {
        return (
          <g>
            <ellipse cx={W / 2} cy={L / 2} rx={W / 2 - sw / 2} ry={L / 2 - sw / 2} {...sharedProps} />
            <ellipse cx={W / 2} cy={L / 2} rx={W * 0.2} ry={L * 0.2}
              fill={stroke} stroke="none" />
          </g>
        );
      }

      case "lamp": {
        const r = Math.min(W, L) / 2;
        return (
          <g>
            {/* Base circle */}
            <circle cx={W / 2} cy={L / 2} r={r - sw / 2} {...sharedProps} />
            {/* Shade arc lines indicating light spread */}
            {[-30, 0, 30].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x2 = W / 2 + Math.sin(rad) * r * 1.4;
              const y2 = L / 2 - Math.cos(rad) * r * 1.4;
              return <line key={i} x1={W / 2} y1={L / 2} x2={x2} y2={y2}
                stroke={stroke} strokeWidth={sw * 0.5} strokeDasharray="2 2" />;
            })}
            {/* Center dot */}
            <circle cx={W / 2} cy={L / 2} r={r * 0.25} fill={stroke} stroke="none" />
          </g>
        );
      }

      case "plant": {
        const r = Math.min(W, L) / 2;
        return (
          <g>
            {/* Pot */}
            <ellipse cx={W / 2} cy={L * 0.75} rx={r * 0.5} ry={L * 0.3 - sw / 2}
              fill={darken(color, 0.5)} stroke={stroke} strokeWidth={sw} />
            {/* Foliage blobs */}
            {[0, 72, 144, 216, 288].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = W / 2 + Math.cos(rad) * r * 0.45;
              const y = L * 0.38 + Math.sin(rad) * r * 0.4;
              return <circle key={i} cx={x} cy={y} r={r * 0.38}
                fill={color} stroke={stroke} strokeWidth={sw * 0.6} />;
            })}
            {/* Center leaf */}
            <circle cx={W / 2} cy={L * 0.35} r={r * 0.3} fill={light} stroke={stroke} strokeWidth={sw * 0.5} />
          </g>
        );
      }

      case "rug": {
        const bw = Math.min(W, L) * 0.08; // border width
        return (
          <g>
            {/* Outer field */}
            <rect x={0} y={0} width={W} height={L} rx={W * 0.05} {...sharedProps} />
            {/* Inner border */}
            <rect x={bw} y={bw} width={W - bw * 2} height={L - bw * 2}
              rx={W * 0.03} fill="none" stroke={stroke} strokeWidth={sw * 0.6} strokeDasharray="4 3" />
            {/* Centre medallion */}
            <ellipse cx={W / 2} cy={L / 2} rx={W * 0.18} ry={L * 0.14}
              fill={light} stroke={stroke} strokeWidth={sw * 0.5} />
          </g>
        );
      }

      default: {
        // Generic fallback block
        return <rect x={0} y={0} width={W} height={L} rx={4} {...sharedProps} />;
      }
    }
  };

  return (
    <svg
      width={W}
      height={L}
      viewBox={`0 0 ${W} ${L}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Shadow underneath */}
      <rect x={2} y={3} width={W} height={L} rx={4}
        fill="rgba(0,0,0,0.12)" />
      {renderShape()}
    </svg>
  );
}
