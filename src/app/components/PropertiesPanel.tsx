import React, { useState } from "react";
import { FurnitureItem, RoomConfig, LightingSettings, EnvironmentPreset } from "../App";
import {
  Settings2,
  Trash2,
  Copy,
  RotateCw,
  Sun,
  Paintbrush,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sliders,
  Maximize,
  Expand
} from "lucide-react";

import { toast } from "sonner";

interface PropertiesPanelProps {
  selectedItem: FurnitureItem | null;
  roomConfig: RoomConfig;
  updateItem: (item: FurnitureItem) => void;
  updateRoomConfig: (config: RoomConfig) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: FurnitureItem) => void;
  allItems: FurnitureItem[];
  onScaleAllItems: (scaleFactor: number) => void;
  lightingSettings: LightingSettings;
  updateLightingSettings: (settings: LightingSettings) => void;
  onResetCamera: () => void;
}

// Environment Preset Configurations
const ENVIRONMENT_PRESETS: Record<EnvironmentPreset, Omit<LightingSettings, 'environmentPreset'>> = {
  Daylight: {
    ambientIntensity: 70,
    shadowSoftness: 50,
    directionalIntensity: 80,
  },
  Sunset: {
    ambientIntensity: 55,
    shadowSoftness: 70,
    directionalIntensity: 60,
  },
  Artificial: {
    ambientIntensity: 85,
    shadowSoftness: 30,
    directionalIntensity: 90,
  },
  Studio: {
    ambientIntensity: 90,
    shadowSoftness: 20,
    directionalIntensity: 95,
  },
};

export function PropertiesPanel({
  selectedItem,
  roomConfig,
  updateItem,
  updateRoomConfig,
  onDelete,
  onDuplicate,
  allItems,
  onScaleAllItems,
  lightingSettings,
  updateLightingSettings,
  onResetCamera
}: PropertiesPanelProps) {

  const handleItemUpdate = (newItem: FurnitureItem) => {
    updateItem(newItem);
  };

  const handleEnvironmentPreset = (preset: EnvironmentPreset) => {
    const presetConfig = ENVIRONMENT_PRESETS[preset];
    updateLightingSettings({
      ...presetConfig,
      environmentPreset: preset,
    });
    toast.success(`Environment set to ${preset}`);
  };

  const handleScaleDesign = (scaleFactor: number) => {
    if (allItems.length === 0) {
      toast.error("No furniture to scale");
      return;
    }
    onScaleAllItems(scaleFactor);
    const percentage = Math.round(scaleFactor * 100);
    toast.success(`Design scaled to ${percentage}%`);
  };

  const handleFitToRoom = () => {
    if (allItems.length === 0) {
      toast.error("No furniture to fit");
      return;
    }

    // Calculate bounding box of all furniture
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    allItems.forEach(item => {
      minX = Math.min(minX, item.x);
      maxX = Math.max(maxX, item.x + item.width);
      minY = Math.min(minY, item.y);
      maxY = Math.max(maxY, item.y + item.length);
    });

    const furnitureWidth = maxX - minX;
    const furnitureLength = maxY - minY;

    // Calculate scale factor with 20% margin
    const scaleX = (roomConfig.width * 0.8) / furnitureWidth;
    const scaleY = (roomConfig.length * 0.8) / furnitureLength;
    const scaleFactor = Math.min(scaleX, scaleY);

    // Prevent upscaling too much
    const finalScale = Math.min(scaleFactor, 2.0);

    handleScaleDesign(finalScale);
  };

  if (!selectedItem) {
    return (
      <div className="p-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Settings2 size={14} />
          Global Properties
        </h2>

        <div className="space-y-8">
          {/* Scale Design Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Expand size={14} className="text-gray-400" />
              Scale Design
            </label>

            {/* Quick Scale Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "50%", value: 0.5 },
                { label: "75%", value: 0.75 },
                { label: "100%", value: 1.0 },
                { label: "125%", value: 1.25 },
                { label: "150%", value: 1.5 },
                { label: "200%", value: 2.0 }
              ].map((scale) => (
                <button
                  key={scale.label}
                  onClick={() => handleScaleDesign(scale.value)}
                  className={`px-3 py-2 text-[11px] font-bold border rounded-lg transition-all ${scale.value === 1.0
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  title={`Scale all furniture to ${scale.label}`}
                >
                  {scale.label}
                </button>
              ))}
            </div>

            {/* Fit to Room Button */}
            <button
              onClick={handleFitToRoom}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
              title="Automatically scale all furniture to fit room optimally"
            >
              <Maximize size={14} />
              Fit Design to Room
            </button>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-[10px] text-blue-800 leading-relaxed">
                <span className="font-bold">Tip:</span> Use preset percentages for quick scaling or "Fit to Room" to automatically optimize furniture layout for the current room size.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Sun size={14} className="text-gray-400" />
              Room Illumination
            </label>
            <div className="space-y-4">
              <div className="relative">
                <div className="flex justify-between text-[10px] text-gray-500 mb-2 font-medium uppercase tracking-tight">
                  <span>Ambient Intensity</span>
                  <span className="text-blue-600">{lightingSettings.ambientIntensity}%</span>
                </div>
                <input
                  type="range"
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={lightingSettings.ambientIntensity}
                  onChange={(e) => updateLightingSettings({ ...lightingSettings, ambientIntensity: parseInt(e.target.value) })}
                />
              </div>
              <div className="relative">
                <div className="flex justify-between text-[10px] text-gray-500 mb-2 font-medium uppercase tracking-tight">
                  <span>Shadow Softness</span>
                  <span className="text-blue-600">{lightingSettings.shadowSoftness}%</span>
                </div>
                <input
                  type="range"
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={lightingSettings.shadowSoftness}
                  onChange={(e) => updateLightingSettings({ ...lightingSettings, shadowSoftness: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Paintbrush size={14} className="text-gray-400" />
              Environment Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Daylight", "Sunset", "Artificial", "Studio"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleEnvironmentPreset(preset as EnvironmentPreset)}
                  className="px-3 py-2 text-[10px] font-medium border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-600"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onResetCamera}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors mt-8"
          >
            <RefreshCw size={14} />
            Reset Camera View
          </button>
        </div>

        <div className="mt-20 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-gray-300">
            <Sliders size={20} />
          </div>
          <p className="text-[11px] text-gray-500 font-medium">Select an object in the workspace to see its specific properties.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-6 flex items-center gap-2">
        <Settings2 size={14} />
        Object Properties
      </h2>

      <div className="space-y-8">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2">
            <img src={selectedItem.image} alt={selectedItem.name} className="max-w-full max-h-full object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{selectedItem.name}</h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-0.5">ID: {selectedItem.id.toUpperCase()}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Transformation</label>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-[11px] text-gray-600 mb-2 font-bold">
                <span>ROTATION</span>
                <span>{selectedItem.rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="45"
                value={selectedItem.rotation}
                onChange={(e) => updateItem({ ...selectedItem, rotation: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-[11px] text-gray-600 mb-2 font-bold uppercase">
                  <span>Width</span>
                </div>
                <input
                  type="number"
                  value={selectedItem.width}
                  onChange={(e) => updateItem({ ...selectedItem, width: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-gray-600 mb-2 font-bold uppercase">
                  <span>Length</span>
                </div>
                <input
                  type="number"
                  value={selectedItem.length}
                  onChange={(e) => updateItem({ ...selectedItem, length: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Appearance</label>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-[11px] text-gray-600 mb-2 font-bold uppercase">
                <span>Material Color</span>
              </div>
              <div className="flex gap-2">
                {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1", "#18181b"].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      updateItem({ ...selectedItem, color });
                      toast.success(`Color updated to ${color}`);
                    }}
                    className={`w-6 h-6 rounded-md border transition-all ${selectedItem.color === color ? "border-blue-600 scale-110" : "border-gray-200"
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-gray-600 mb-2 font-bold uppercase">
                <span>Glossiness</span>
                <span>{selectedItem.shading * 100}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedItem.shading}
                onChange={(e) => updateItem({ ...selectedItem, shading: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              onDuplicate(selectedItem);
              toast.success("Object duplicated");
            }}
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Copy size={14} />
            Duplicate
          </button>
          <button
            onClick={() => {
              onDelete(selectedItem.id);
              toast.error("Object deleted");
            }}
            className="flex items-center justify-center gap-2 py-2.5 border border-red-100 bg-red-50 rounded-lg text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}