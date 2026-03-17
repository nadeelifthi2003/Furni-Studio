import React, { useState } from "react";
import { Save, Undo2, Redo2, LayoutGrid, Box, ChevronRight, Download, FileJson, Image, Menu } from "lucide-react";

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
  onMenuClick: () => void; // hamburger menu handler
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
  onExportImage,
  onMenuClick,
}: TopNavProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 md:px-6 z-20 shadow-sm flex-shrink-0">

      {/* Left: Hamburger + Project Name */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        {/* Hamburger — visible only on mobile */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors lg:hidden flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center text-sm text-gray-500 min-w-0">
          <span className="hidden sm:block">Project</span>
          <ChevronRight size={14} className="mx-1 hidden sm:block" />
          <span className="font-semibold text-gray-900 truncate max-w-[120px] md:max-w-[200px]">
            {projectName}
          </span>
        </div>
      </div>

      {/* Center: 2D / 3D Toggle */}
      <div className="flex items-center bg-gray-100 p-1 rounded-lg flex-shrink-0">
        <button
          onClick={() => setViewMode("2d")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
            viewMode === "2d" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <LayoutGrid size={14} />
          <span>2D</span>
        </button>
        <button
          onClick={() => setViewMode("3d")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
            viewMode === "3d" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Box size={14} />
          <span>3D</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Undo/Redo — hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-1 pr-2 md:pr-4 border-r border-gray-200">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs md:text-sm font-semibold shadow-sm transition-colors"
        >
          <Save size={15} />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Export Dropdown — hidden on small screens */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download size={15} />
            <span>Export</span>
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

        {/* User Avatar */}
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-100 flex-shrink-0">
          JD
        </div>
      </div>
    </header>
  );
}
