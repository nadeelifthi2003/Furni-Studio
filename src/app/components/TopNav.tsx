import React from "react";
import { Save, Undo2, Redo2, User, LayoutGrid, Box, ChevronRight } from "lucide-react";

interface TopNavProps {
  projectName: string;
  viewMode: "2d" | "3d";
  setViewMode: (mode: "2d" | "3d") => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function TopNav({ 
  projectName, 
  viewMode, 
  setViewMode, 
  onSave, 
  onUndo, 
  onRedo,
  canUndo,
  canRedo
}: TopNavProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm text-gray-500">
          <span>Project</span>
          <ChevronRight size={14} className="mx-1" />
          <span className="font-semibold text-gray-900 truncate max-w-[200px]">{projectName}</span>
        </div>
      </div>

      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setViewMode("2d")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === "2d" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <LayoutGrid size={16} />
          2D Layout
        </button>
        <button
          onClick={() => setViewMode("3d")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === "3d" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Box size={16} />
          3D View
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo"
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo"
          >
            <Redo2 size={18} />
          </button>
        </div>

        <button 
          onClick={onSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <Save size={18} />
          Save Design
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-100">
          JD
        </div>
      </div>
    </header>
  );
}
