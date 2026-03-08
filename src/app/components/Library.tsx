import React from 'react';
import { 
  Square, 
  Trash2, 
  Copy, 
  RotateCw, 
  Undo2, 
  Redo2, 
  Save, 
  Layers, 
  Box, 
  Grid3X3,
  Search,
  Plus,
  Info,
  ChevronRight,
  ChevronLeft,
  Settings,
  Palette,
  Maximize
} from 'lucide-react';
import { FurnitureItem, FurnitureType } from '../types';

// Mock Library Data
export const FURNITURE_LIBRARY: Omit<FurnitureItem, 'id' | 'x' | 'z' | 'rotation'>[] = [
  { type: 'chair', name: 'Modern Chair', width: 0.5, depth: 0.5, height: 0.9, color: '#3b82f6' },
  { type: 'sofa', name: 'Large Sofa', width: 2.2, depth: 0.9, height: 0.8, color: '#64748b' },
  { type: 'table', name: 'Dining Table', width: 1.8, depth: 0.9, height: 0.75, color: '#92400e' },
  { type: 'bed', name: 'Queen Bed', width: 1.6, depth: 2.1, height: 0.6, color: '#f8fafc' },
  { type: 'cabinet', name: 'Bookshelf', width: 1.2, depth: 0.4, height: 2.0, color: '#451a03' },
  { type: 'rug', name: 'Area Rug', width: 3.0, depth: 2.0, height: 0.01, color: '#e2e8f0' },
];

export const Library: React.FC<{ onAddItem: (item: any) => void }> = ({ onAddItem }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-72">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          Furniture Library
        </h2>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search furniture..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Essentials</h3>
          <div className="grid grid-cols-2 gap-3">
            {FURNITURE_LIBRARY.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onAddItem(item)}
                className="group flex flex-col items-center p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                title={`Add ${item.name} to workspace`}
              >
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Square className="w-6 h-6 text-slate-400" style={{ color: item.color }} />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center">{item.name}</span>
                <span className="text-[10px] text-slate-400 mt-1">{item.width}m x {item.depth}m</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <p>Click an item to add it to the center of your room.</p>
        </div>
      </div>
    </div>
  );
};
