import React, { useState } from "react";
import { Save, Undo2, Redo2, User, LayoutGrid, Box, ChevronRight, Download, FileJson, Image } from "lucide-react";

interface TopNavProps {
  projectName: string;
  viewMode: "2d" | "3d";
  setViewMode: (mode: "2d" | "3d") => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportJSON?: () => void;
  onExportImage?: () => void;
}

export function TopNav({ 
  projectName, 
  viewMode, 
  setViewMode, 
  onSave, 
  onUndo, 
  onRedo,
  canUndo,
  canRedo,
  onExportJSON,
  onExportImage
}: TopNavProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
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

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download size={18} />
            Export
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => { onExportJSON?.(); setShowExportMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileJson size={16} className="text-blue-500" />
                Export as JSON
              </button>
              <button
                onClick={() => { onExportImage?.(); setShowExportMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Image size={16} className="text-green-500" />
                Export as Image
              </button>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-100">
          JD
        </div>
      </div>
    </header>
  );
}
