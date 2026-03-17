import React, { useRef, useState, useEffect } from "react";
import { Project, FurnitureItem } from "../App";
import { Move, Ruler } from "lucide-react";
import { FurnitureFootprint } from "./FurnitureFootprint";

interface Canvas2DProps {
  project: Project;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  updateProject: (project: Project) => void;
}

const GRID_SIZE = 20;

// ---------------------------------------------------------------------------
// Builds the SVG polygon points string for the room shape.
// ---------------------------------------------------------------------------
function getRoomPolygonPoints(width: number, length: number, shape: string): string {
  if (shape === 'L-shape') {
    const hw = width / 2;
    const hl = length / 2;
    return [`0,0`, `${hw},0`, `${hw},${hl}`, `${width},${hl}`, `${width},${length}`, `0,${length}`].join(' ');
  }
  return `0,0 ${width},0 ${width},${length} 0,${length}`;
}

// Corner bracket SVG for selection handles (Figma-style)
function SelectionHandles({ w, h }: { w: number; h: number }) {
  const s = Math.min(12, w * 0.1, h * 0.1); // bracket arm length
  const t = 2.5; // stroke thickness
  const offset = 5; // offset outside item bounds
  const color = "#2563eb";
  const corners = [
    // top-left
    [`M ${-offset + s},${-offset} L ${-offset},${-offset} L ${-offset},${-offset + s}`],
    // top-right
    [`M ${w + offset - s},${-offset} L ${w + offset},${-offset} L ${w + offset},${-offset + s}`],
    // bottom-left
    [`M ${-offset + s},${h + offset} L ${-offset},${h + offset} L ${-offset},${h + offset - s}`],
    // bottom-right
    [`M ${w + offset - s},${h + offset} L ${w + offset},${h + offset} L ${w + offset},${h + offset - s}`],
  ];
  return (
    <svg
      style={{ position: 'absolute', top: -offset, left: -offset, width: w + offset * 2, height: h + offset * 2, overflow: 'visible', pointerEvents: 'none', zIndex: 30 }}
    >
      {corners.map((d, i) => (
        <path key={i} d={d[0]} stroke={color} strokeWidth={t} fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function Canvas2D({ project, selectedItemId, onSelectItem, updateProject }: Canvas2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<{x: number, y: number}[]>([]);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);

  const { width, length, shape } = project.roomConfig;
  const polygonPoints = getRoomPolygonPoints(width, length, shape);
  const clipId = `room-clip-${shape}`;
  // Warm hardwood floor tone — independent from wall color picker
  const FLOOR_COLOR = "#d9cbb8";
  const FLOOR_PLANK = "#c9b89e";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedItemId) {
        updateProject({ ...project, items: project.items.filter(item => item.id !== selectedItemId) });
        onSelectItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, selectedItemId, updateProject, onSelectItem]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const furnitureData = e.dataTransfer.getData("furniture");
    if (!furnitureData || !containerRef.current) return;
    const furniture = JSON.parse(furnitureData);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newItem: FurnitureItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: furniture.id,
      name: furniture.name,
      x: Math.round((x - furniture.dimensions.w / 2) / GRID_SIZE) * GRID_SIZE,
      y: Math.round((y - furniture.dimensions.l / 2) / GRID_SIZE) * GRID_SIZE,
      width: furniture.dimensions.w,
      length: furniture.dimensions.l,
      rotation: 0,
      color: "#7c9bb5",   // warm slate blue default (looks nicer in plan view)
      shading: 0.5,
      image: furniture.image,
    };
    updateProject({ ...project, items: [...project.items, newItem] });
    onSelectItem(newItem.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleItemMouseDown = (e: React.MouseEvent, item: FurnitureItem) => {
    e.stopPropagation();
    onSelectItem(item.id);
    setIsDragging(true);
    setDragOffset({ x: e.clientX - item.x, y: e.clientY - item.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMeasuring && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      return;
    }
    if (!isDragging || !selectedItemId) return;
    const newItems = project.items.map(item => {
      if (item.id === selectedItemId) {
        return {
          ...item,
          x: Math.round((e.clientX - dragOffset.x) / GRID_SIZE) * GRID_SIZE,
          y: Math.round((e.clientY - dragOffset.y) / GRID_SIZE) * GRID_SIZE,
        };
      }
      return item;
    });
    updateProject({ ...project, items: newItems });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="w-full h-full relative overflow-auto flex items-center justify-center p-20 cursor-crosshair"
      style={{ background: 'radial-gradient(ellipse at center, #e8e4df 0%, #d5d0cb 100%)' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        if (isMeasuring && mousePos) {
          measurePoints.length === 2 ? setMeasurePoints([mousePos]) : setMeasurePoints([...measurePoints, mousePos]);
        }
        if (e.target === e.currentTarget && !isMeasuring) onSelectItem(null);
      }}
    >
      {/* Room container */}
      <div
        ref={containerRef}
        style={{ width: `${width}px`, height: `${length}px`, position: 'relative', flexShrink: 0 }}
      >
        {/* SVG: floor fill + grid + border */}
        <svg
          width={width}
          height={length}
          style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}
        >
          <defs>
            {/* Wood plank pattern — horizontal lines every 40px */}
            <pattern id="floor-planks" width={width} height={40} patternUnits="userSpaceOnUse">
              <rect width={width} height={40} fill={FLOOR_COLOR} />
              <line x1={0} y1={0} x2={width} y2={0} stroke={FLOOR_PLANK} strokeWidth={1.2} />
              <line x1={0} y1={20} x2={width} y2={20} stroke={FLOOR_PLANK} strokeWidth={0.5} strokeDasharray="none" opacity={0.5} />
            </pattern>
            {/* Dot grid overlay */}
            <pattern id="dot-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <circle cx={GRID_SIZE / 2} cy={GRID_SIZE / 2} r={0.9} fill="rgba(100,80,60,0.18)" />
            </pattern>
            <clipPath id={clipId}>
              <polygon points={polygonPoints} />
            </clipPath>
          </defs>

          {/* Floor planks clipped to polygon */}
          <rect width={width} height={length} fill="url(#floor-planks)" clipPath={`url(#${clipId})`} />
          {/* Dot grid overlay */}
          <rect width={width} height={length} fill="url(#dot-grid)" clipPath={`url(#${clipId})`} />
          {/* Subtle inner shadow vignette */}
          <polygon points={polygonPoints} fill="rgba(0,0,0,0.04)" />
          {/* Room border */}
          <polygon
            points={polygonPoints}
            fill="none"
            stroke="#a89880"
            strokeWidth="3"
            filter="drop-shadow(0 4px 16px rgba(0,0,0,0.18))"
          />
          {/* Outer glow to lift room from canvas */}
          <polygon points={polygonPoints} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
        </svg>

        {/* Dimension labels */}
        <div className="absolute -top-9 left-0 right-0 flex justify-center">
          <span className="text-[10px] font-semibold text-stone-500 tracking-widest bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {width} cm
          </span>
        </div>
        <div className="absolute -left-14 top-0 bottom-0 flex items-center">
          <span className="text-[10px] font-semibold text-stone-500 tracking-widest bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full [writing-mode:vertical-rl] rotate-180">
            {length} cm
          </span>
        </div>

        {/* Furniture + measurement layer — clipped to room polygon */}
        <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(${polygonPoints.split(' ').join(', ')})` }}>

          {/* Measurement overlay */}
          {isMeasuring && measurePoints.length > 0 && (
            <svg className="absolute inset-0 pointer-events-none w-full h-full z-20" style={{ overflow: 'visible' }}>
              {measurePoints.map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r={4} fill="#eab308" />)}
              {measurePoints.length === 1 && mousePos && (
                <>
                  <line x1={measurePoints[0].x} y1={measurePoints[0].y} x2={mousePos.x} y2={mousePos.y} stroke="#eab308" strokeWidth={2} strokeDasharray="4 4" />
                  <text x={(measurePoints[0].x + mousePos.x) / 2} y={(measurePoints[0].y + mousePos.y) / 2 - 10} fill="#eab308" fontSize="12px" fontWeight="bold" textAnchor="middle">
                    {Math.round(Math.hypot(mousePos.x - measurePoints[0].x, mousePos.y - measurePoints[0].y))} cm
                  </text>
                </>
              )}
              {measurePoints.length === 2 && (
                <>
                  <line x1={measurePoints[0].x} y1={measurePoints[0].y} x2={measurePoints[1].x} y2={measurePoints[1].y} stroke="#eab308" strokeWidth={2} />
                  <text x={(measurePoints[0].x + measurePoints[1].x) / 2} y={(measurePoints[0].y + measurePoints[1].y) / 2 - 10} fill="#eab308" fontSize="12px" fontWeight="bold" textAnchor="middle">
                    {Math.round(Math.hypot(measurePoints[1].x - measurePoints[0].x, measurePoints[1].y - measurePoints[0].y))} cm
                  </text>
                </>
              )}
            </svg>
          )}

          {/* Furniture items */}
          {project.items.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <div
                key={item.id}
                onMouseDown={(e) => handleItemMouseDown(e, item)}
                style={{
                  position: 'absolute',
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${item.width}px`,
                  height: `${item.length}px`,
                  transform: `rotate(${item.rotation}deg)`,
                  cursor: 'move',
                  zIndex: isSelected ? 20 : 10,
                  transformOrigin: 'center center',
                }}
              >
                {/* SVG footprint */}
                <FurnitureFootprint
                  type={item.type}
                  width={item.width}
                  length={item.length}
                  color={item.color}
                  selected={isSelected}
                />

                {/* Selection: corner brackets + name badge */}
                {isSelected && (
                  <>
                    <SelectionHandles w={item.width} h={item.length} />
                    {/* Name label above item */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -28,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                      }}
                      className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/30"
                    >
                      {item.name}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {project.items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 pointer-events-none">
              <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-dashed border-stone-300 flex flex-col items-center gap-2 shadow-sm">
                <Move size={24} className="opacity-30" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Drag furniture from the library</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 shadow text-[10px] font-semibold text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          SNAP
        </span>
        <span className="w-px h-3 bg-stone-200" />
        <span>GRID {GRID_SIZE}cm</span>
        <span className="w-px h-3 bg-stone-200" />
        <span>{shape.toUpperCase()}</span>
        <span className="w-px h-3 bg-stone-200" />
        <span>{project.items.length} item{project.items.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Measure tool toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => { setIsMeasuring(!isMeasuring); setMeasurePoints([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all border ${
            isMeasuring
              ? 'bg-amber-500 text-white border-amber-600 shadow-amber-400/30'
              : 'bg-white/90 text-stone-600 border-stone-200 hover:bg-white hover:shadow-md'
          }`}
        >
          <Ruler size={14} />
          {isMeasuring ? 'Exit Measure' : 'Measure'}
        </button>
      </div>
    </div>
  );
}
