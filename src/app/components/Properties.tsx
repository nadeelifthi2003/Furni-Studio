import React from 'react';
import { 
  Trash2, 
  Copy, 
  RotateCw, 
  Settings, 
  Palette, 
  Move, 
  AlertCircle 
} from 'lucide-react';
import { FurnitureItem, RoomConfig } from '../types';

interface PropertiesProps {
  selectedItem: FurnitureItem | null;
  room: RoomConfig;
  onUpdateItem: (updates: Partial<FurnitureItem>) => void;
  onUpdateRoom: (updates: Partial<RoomConfig>) => void;
  onDeleteItem: () => void;
  onDuplicateItem: () => void;
}

export const Properties: React.FC<PropertiesProps> = ({
  selectedItem,
  room,
  onUpdateItem,
  onUpdateRoom,
  onDeleteItem,
  onDuplicateItem,
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Properties
        </h2>
      </div>

      {selectedItem ? (
        <div className="p-4 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-900">{selectedItem.name}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={onDuplicateItem}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                  title="Duplicate Object"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={onDeleteItem}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  title="Delete Object"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Width (m)</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={selectedItem.width || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateItem({ width: isNaN(val) ? 0 : val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Depth (m)</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={selectedItem.depth || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateItem({ depth: isNaN(val) ? 0 : val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Rotation (°)</label>
                <input 
                  type="number"
                  step="15"
                  value={selectedItem.rotation || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onUpdateItem({ rotation: isNaN(val) ? 0 : val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={selectedItem.color}
                    onChange={(e) => onUpdateItem({ color: e.target.value })}
                    className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={selectedItem.color}
                    onChange={(e) => onUpdateItem({ color: e.target.value })}
                    className="flex-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Position</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">X (m)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={selectedItem.x || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateItem({ x: isNaN(val) ? 0 : val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Z (m)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={selectedItem.z || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateItem({ z: isNaN(val) ? 0 : val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Room Specification</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Room Width (m)</label>
                <input 
                  type="number"
                  min="2"
                  max="20"
                  value={room.width || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateRoom({ width: isNaN(val) ? 2 : val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
                {room.width > 20 && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Max width 20m</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Room Depth (m)</label>
                <input 
                  type="number"
                  min="2"
                  max="20"
                  value={room.depth || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateRoom({ depth: isNaN(val) ? 2 : val });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
                {room.depth > 20 && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Max depth 20m</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Grid Size (m)</label>
                <select 
                  value={room.gridSize}
                  onChange={(e) => onUpdateRoom({ gridSize: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value={0.1}>0.1m (Precise)</option>
                  <option value={0.25}>0.25m (Standard)</option>
                  <option value={0.5}>0.5m (Coarse)</option>
                  <option value={1}>1.0m (Wide)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Floor Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={room.floorColor}
                    onChange={(e) => onUpdateRoom({ floorColor: e.target.value })}
                    className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={room.floorColor}
                    onChange={(e) => onUpdateRoom({ floorColor: e.target.value })}
                    className="flex-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase">3D Visualization</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-slate-500">Lighting Intensity</label>
                    <span className="text-xs text-slate-400">{(room.lightIntensity || 1).toFixed(1)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={room.lightIntensity || 1}
                    onChange={(e) => onUpdateRoom({ lightIntensity: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500">Enable Shadows</label>
                  <input 
                    type="checkbox"
                    checked={room.showShadows}
                    onChange={(e) => onUpdateRoom({ showShadows: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Visualization Tip</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Select any object in the workspace to edit its properties or use the library to add more furniture.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
