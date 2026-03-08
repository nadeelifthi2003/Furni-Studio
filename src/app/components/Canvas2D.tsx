import React, { useRef, useState, useEffect } from "react";
import { Project, FurnitureItem } from "../App";
import { Move, RotateCw, Trash2, Maximize2 } from "lucide-react";

interface Canvas2DProps {
  project: Project;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  updateProject: (project: Project) => void;
}

const GRID_SIZE = 20;

export function Canvas2D({ project, selectedItemId, onSelectItem, updateProject }: Canvas2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const furnitureData = e.dataTransfer.getData("furniture");
    if (!furnitureData || !containerRef.current) return;

    const furniture = JSON.parse(furnitureData);
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate drop position relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap to grid
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

    updateProject({
      ...project,
      items: [...project.items, newItem]
    });
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
    setDragOffset({
      x: e.clientX - item.x,
      y: e.clientY - item.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedItemId) return;

    const newItems = project.items.map(item => {
      if (item.id === selectedItemId) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Snap to grid
        return {
          ...item,
          x: Math.round(newX / GRID_SIZE) * GRID_SIZE,
          y: Math.round(newY / GRID_SIZE) * GRID_SIZE
        };
      }
      return item;
    });

    updateProject({ ...project, items: newItems });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Convert cm to pixels for display (1cm = 1px for simplicity in this demo)
  const roomStyle = {
    width: `${project.roomConfig.width}px`,
    height: `${project.roomConfig.length}px`,
    backgroundColor: project.roomConfig.wallColor,
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 40px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.05)',
    border: '4px solid #fff',
    borderRadius: '4px',
    backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
  };

  return (
    <div 
      className="w-full h-full relative overflow-auto bg-gray-100 flex items-center justify-center p-20 cursor-crosshair"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => onSelectItem(null)}
    >
      <div 
        ref={containerRef}
        style={roomStyle}
        className="relative transition-all duration-300"
      >
        {/* Room Measurements */}
        <div className="absolute -top-8 left-0 right-0 flex justify-center text-[10px] font-bold text-gray-400">
          {project.roomConfig.width} cm
        </div>
        <div className="absolute -left-12 top-0 bottom-0 flex items-center text-[10px] font-bold text-gray-400 [writing-mode:vertical-rl] rotate-180">
          {project.roomConfig.length} cm
        </div>

        {/* Furniture Items */}
        {project.items.map((item) => (
          <div
            key={item.id}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            className={`absolute cursor-move transition-shadow ${
              selectedItemId === item.id ? "ring-2 ring-blue-500 ring-offset-2 z-10 shadow-xl" : "hover:shadow-md"
            }`}
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
              padding: '4px'
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

      {/* Viewport Info Overlay */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm text-[10px] font-bold text-gray-500">
        <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> SNAP ENABLED</span>
        <span className="w-px h-3 bg-gray-200"></span>
        <span>GRID: {GRID_SIZE}cm</span>
        <span className="w-px h-3 bg-gray-200"></span>
        <span>SCALE 1:1</span>
      </div>
    </div>
  );
}
