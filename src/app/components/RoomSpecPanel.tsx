import React from "react";
import { RoomConfig, RoomShape } from "../App";
import { Maximize, Ruler, Square, Layout, Palette, AlertCircle } from "lucide-react";

interface RoomSpecPanelProps {
  config: RoomConfig;
  onChange: (config: RoomConfig) => void;
}

export function RoomSpecPanel({ config, onChange }: RoomSpecPanelProps) {
  const handleChange = (field: keyof RoomConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const shapes: RoomShape[] = ["Rectangle", "L-shape", "Custom"];

  return (
    <div className="p-5">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
        <Layout size={14} />
        Room Specifications
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Room Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape) => (
              <button
                key={shape}
                onClick={() => handleChange("shape", shape)}
                className={`text-[10px] py-2 rounded-md border font-medium transition-all ${config.shape === shape
                  ? "bg-blue-50 border-blue-600 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 flex justify-between">
              Width (cm)
              <span className="text-gray-900 font-semibold">{config.width} cm</span>
            </label>
            <input
              type="range"
              min="200"
              max="1000"
              value={config.width}
              onChange={(e) => handleChange("width", parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 flex justify-between">
              Length (cm)
              <span className="text-gray-900 font-semibold">{config.length} cm</span>
            </label>
            <input
              type="range"
              min="200"
              max="1000"
              value={config.length}
              onChange={(e) => handleChange("length", parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 flex justify-between">
              Height (cm)
              <span className="text-gray-900 font-semibold">{config.height} cm</span>
            </label>
            <input
              type="range"
              min="200"
              max="400"
              value={config.height}
              onChange={(e) => handleChange("height", parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wall Color</label>
          <div className="flex gap-2">
            {["#f3f4f6", "#ffffff", "#fef3c7", "#dcfce7", "#e0e7ff"].map((color) => (
              <button
                key={color}
                onClick={() => handleChange("wallColor", color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.wallColor === color ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent"
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input
              type="color"
              value={config.wallColor}
              onChange={(e) => handleChange("wallColor", e.target.value)}
              className="w-8 h-8 rounded-full border-2 border-gray-200 p-0 overflow-hidden cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
          <AlertCircle size={18} className="text-blue-600 shrink-0" />
          <p className="text-[11px] text-blue-800 leading-normal">
            Room dimensions affect lighting and object scaling. Ensure measurements are accurate for real-world visualization.
          </p>
        </div>

        <div className="border border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <span className="text-[10px] text-gray-400 mb-2 font-medium">REAL-TIME THUMBNAIL</span>
          <div
            className="w-24 h-16 rounded border border-gray-300 shadow-inner flex items-center justify-center transition-all overflow-hidden"
            style={{
              backgroundColor: config.wallColor,
              width: `${Math.max(40, config.width / 10)}px`,
              height: `${Math.max(30, config.length / 10)}px`
            }}
          >
            <div className="text-[8px] text-gray-400 font-mono">
              {config.width}x{config.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
