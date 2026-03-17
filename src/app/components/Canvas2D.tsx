import React, { useRef, useState, useEffect } from "react";
import { Project, FurnitureItem } from "../App";
import { Move, Ruler } from "lucide-react";

interface Canvas2DProps {
  project: Project;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  updateProject: (project: Project) => void;
}

const GRID_SIZE = 20;

// ---------------------------------------------------------------------------
// Builds the SVG polygon points string for the room shape.
// Rectangle: standard 4 corners.
// L-shape: cuts out the top-right quadrant (matches 3D buildRoom logic).
// ---------------------------------------------------------------------------
function getRoomPolygonPoints(width: number, length: number, shape: string): string {
  if (shape === 'L-shape') {
    const hw = width / 2;
    const hl = length / 2;
    // SVG coords: top-left origin, so we shift from centred to (0,0) origin
    // L-shape: cut top-right quadrant → 6 vertices
    // (0,0) top-left → (hw,0) → (hw,hl) → (width,hl) → (width,length) → (0,length)
    return [
      `0,0`,
      `${hw},0`,
      `${hw},${hl}`,
      `${width},${hl}`,
      `${width},${length}`,
      `0,${length}`,
    ].join(' ');
  }
  // Rectangle
  return `0,0 ${width},0 ${width},${length} 0,${length}`;
}

export function Canvas2D({ project, selectedItemId, onSelectItem, updateProject }: Canvas2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Measurement Tool State
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<{x: number, y: number}[]>([]);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);

  const { width, length, shape, wallColor } = project.roomConfig;
  const polygonPoints = getRoomPolygonPoints(width, length, shape);
  const clipId = `room-clip-${shape}`;

  // Add Keyboard Support for Deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedItemId) {
        updateProject({
          ...project,
          items: project.items.filter(item => item.id !== selectedItemId)
        });
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

    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;

    const newItem: FurnitureItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: furniture.id,
      name: furniture.name,
      x: snappedX - (furniture.dimensions.w / 2),
      y: snappedY - (furniture.dimensions.l / 2),
      width: furniture.dimensions.w,
      length: furniture.dimensions.l,
      rotation: 0,
      color: "#3b82f6",
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
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        return {
          ...item,
          x: Math.round(newX / GRID_SIZE) * GRID_SIZE,
          y: Math.round(newY / GRID_SIZE) * GRID_SIZE,
        };
      }
      return item;
    });
    updateProject({ ...project, items: newItems });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="w-full h-full relative overflow-auto bg-gray-100 flex items-center justify-center p-20 cursor-crosshair"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        if (isMeasuring && mousePos) {
          if (measurePoints.length === 2) {
            setMeasurePoints([mousePos]);
          } else {
            setMeasurePoints([...measurePoints, mousePos]);
          }
        }
        if (e.target === e.currentTarget && !isMeasuring) {
          onSelectItem(null);
        }
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Room container — sized to bounding box, shaped by SVG clipPath      */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={containerRef}
        style={{
          width: `${width}px`,
          height: `${length}px`,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* SVG layer: draws the room shape (background + border) */}
        <svg
          width={width}
          height={length}
          style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="room-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
            {/* Clip path matching the room polygon */}
            <clipPath id={clipId}>
              <polygon points={polygonPoints} />
            </clipPath>
          </defs>

          {/* Room fill (wall colour) clipped to polygon */}
          <polygon points={polygonPoints} fill={wallColor} />
          {/* Grid fill clipped to polygon */}
          <rect width={width} height={length} fill="url(#room-grid)" clipPath={`url(#${clipId})`} />
          {/* Room border/outline */}
          <polygon
            points={polygonPoints}
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            filter="drop-shadow(0 0 12px rgba(0,0,0,0.12))"
          />
          {/* Inner vignette overlay */}
          <polygon
            points={polygonPoints}
            fill="rgba(0,0,0,0.03)"
          />
        </svg>

        {/* Room dimension labels */}
        <div className="absolute -top-8 left-0 right-0 flex justify-center text-[10px] font-bold text-gray-400">
          {width} cm
        </div>
        <div className="absolute -left-12 top-0 bottom-0 flex items-center text-[10px] font-bold text-gray-400 [writing-mode:vertical-rl] rotate-180">
          {length} cm
        </div>

        {/* Furniture items — clipped to the same room polygon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `polygon(${polygonPoints.split(' ').join(', ')})`,
          }}
        >
          {/* Dynamic Measurement Tool SVG overlay */}
          {isMeasuring && measurePoints.length > 0 && (
            <svg className="absolute inset-0 pointer-events-none w-full h-full z-20" style={{ overflow: 'visible' }}>
              {measurePoints.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r={4} fill="#eab308" />
              ))}
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

          {project.items.map((item) => (
            <div
              key={item.id}
              onMouseDown={(e) => handleItemMouseDown(e, item)}
              className={`absolute cursor-move transition-shadow ${selectedItemId === item.id ? "ring-2 ring-blue-500 ring-offset-2 z-10 shadow-xl" : "hover:shadow-md"}`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.length}px`,
                transform: `rotate(${item.rotation}deg)`,
                backgroundColor: 'white',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain pointer-events-none mix-blend-multiply"
                style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.1))` }}
              />
              {selectedItemId === item.id && (
                <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}

          {/* Empty State Prompt */}
          {project.items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
              <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-gray-300 flex flex-col items-center">
                <Move size={24} className="mb-2 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Drag furniture here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Viewport Info Overlay */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm text-[10px] font-bold text-gray-500">
        <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> SNAP ENABLED</span>
        <span className="w-px h-3 bg-gray-200"></span>
        <span>GRID: {GRID_SIZE}cm</span>
        <span className="w-px h-3 bg-gray-200"></span>
        <span>SHAPE: {shape.toUpperCase()}</span>
      </div>

      {/* Measurement Tool Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => { setIsMeasuring(!isMeasuring); setMeasurePoints([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-colors border ${
            isMeasuring
              ? 'bg-yellow-500 text-white border-yellow-600 shadow-yellow-500/20'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Ruler size={16} />
          {isMeasuring ? 'Exit Measurement' : 'Measure Tool'}
        </button>
      </div>
    </div>
  );
}
