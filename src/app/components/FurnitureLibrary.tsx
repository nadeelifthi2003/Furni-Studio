import React from "react";
import { Package, Search, Grid } from "lucide-react";

export const FURNITURE_TYPES = [
  {
    id: "chair",
    name: "Classic Armchair",
    image: "https://images.unsplash.com/photo-1760236963218-424a715d1816?q=80&w=200",
    dimensions: { w: 80, l: 80 }
  },
  {
    id: "sofa",
    name: "Modern 3-Seater",
    image: "https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?q=80&w=200",
    dimensions: { w: 220, l: 95 }
  },
  {
    id: "table",
    name: "Dining Table",
    image: "https://images.unsplash.com/photo-1679309981674-cef0e23a7864?q=80&w=200",
    dimensions: { w: 160, l: 90 }
  },
  {
    id: "chair",
    name: "Modern Accent Chair",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=200",
    dimensions: { w: 50, l: 50 }
  },
  {
    id: "bed",
    name: "Queen Size Bed",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=200",
    dimensions: { w: 160, l: 200 }
  },
  {
    id: "lamp",
    name: "Modern Floor Lamp",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=200",
    dimensions: { w: 40, l: 40 }
  },
  {
    id: "plant",
    name: "Potted Monstera",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=200",
    dimensions: { w: 50, l: 50 }
  },
  {
    id: "rug",
    name: "Vintage Area Rug",
    image: "https://images.unsplash.com/photo-1534889156217-d643df14f14a?q=80&w=200",
    dimensions: { w: 200, l: 300 }
  }
];

export function FurnitureLibrary() {
  const onDragStart = (e: React.DragEvent, item: typeof FURNITURE_TYPES[0]) => {
    e.dataTransfer.setData("furniture", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="p-5">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
        <Package size={14} />
        Furniture Library
      </h2>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search catalog..."
          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FURNITURE_TYPES.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className="group relative bg-white border border-gray-200 rounded-lg p-2 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="aspect-square bg-gray-50 rounded mb-2 overflow-hidden flex items-center justify-center p-2">
              <img
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-gray-700 truncate">{item.name}</p>
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-gray-400 uppercase">{item.dimensions.w} x {item.dimensions.l} cm</span>
                <span className="text-[8px] bg-blue-50 text-blue-600 px-1 rounded">PRO</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Materials</span>
          <button className="text-[10px] text-blue-600 font-medium">View All</button>
        </div>
        <div className="flex gap-2">
          {["Wood", "Metal", "Fabric", "Glass"].map((m) => (
            <div key={m} className="px-2 py-1 bg-gray-100 rounded text-[9px] font-medium text-gray-600">
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
