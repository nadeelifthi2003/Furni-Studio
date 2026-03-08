import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { Login } from "./components/Login";
import { RoomSpecPanel } from "./components/RoomSpecPanel";
import { FurnitureLibrary } from "./components/FurnitureLibrary";
import { Canvas2D } from "./components/Canvas2D";
import { Visualization3D } from "./components/Visualization3D";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { SavedDesigns } from "./components/SavedDesigns";
import { SettingsPage } from "./components/SettingsPage";
import { LandingPage } from "./components/LandingPage";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// Types
export type RoomShape = "Rectangle" | "L-shape" | "Custom";
export type EnvironmentPreset = "Daylight" | "Sunset" | "Artificial" | "Studio";

export interface LightingSettings {
  ambientIntensity: number; // 0-100
  shadowSoftness: number; // 0-100
  directionalIntensity: number; // 0-100
  environmentPreset: EnvironmentPreset;
}

export interface RoomConfig {
  width: number;
  length: number;
  height: number;
  shape: RoomShape;
  wallColor: string;
}

export interface FurnitureItem {
  id: string;
  type: "chair" | "sofa" | "table" | "side-table";
  name: string;
  x: number;
  y: number;
  width: number;
  length: number;
  rotation: number;
  color: string;
  shading: number;
  image: string;
}

export interface Project {
  id: string;
  name: string;
  lastModified: string;
  roomConfig: RoomConfig;
  items: FurnitureItem[];
  lightingSettings: LightingSettings;
}

const INITIAL_LIGHTING_SETTINGS: LightingSettings = {
  ambientIntensity: 70,
  shadowSoftness: 50,
  directionalIntensity: 80,
  environmentPreset: "Daylight",
};

const INITIAL_ROOM_CONFIG: RoomConfig = {
  width: 500,
  length: 400,
  height: 250,
  shape: "Rectangle",
  wallColor: "#f3f4f6",
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "editor" | "saved" | "settings">("dashboard");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [project, setProject] = useState<Project>({
    id: "proj-1",
    name: "Modern Living Room Consultation",
    lastModified: new Date().toISOString(),
    roomConfig: INITIAL_ROOM_CONFIG,
    items: [],
    lightingSettings: INITIAL_LIGHTING_SETTINGS,
  });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ past: Project[]; present: Project; future: Project[] }>({
    past: [],
    present: {
      id: "proj-1",
      name: "Modern Living Room Consultation",
      lastModified: new Date().toISOString(),
      roomConfig: INITIAL_ROOM_CONFIG,
      items: [],
      lightingSettings: INITIAL_LIGHTING_SETTINGS,
    },
    future: [],
  });

  const updateProject = useCallback((newProject: Project, skipHistory = false) => {
    setProject(newProject);
    if (!skipHistory) {
      setHistory((prev) => ({
        past: [...prev.past, prev.present],
        present: newProject,
        future: [],
      }));
    } else {
      setHistory((prev) => ({ ...prev, present: newProject }));
    }
  }, []);

  const undo = () => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    setHistory({
      past: newPast,
      present: previous,
      future: [history.present, ...history.future],
    });
    setProject(previous);
    toast.info("Action undone");
  };

  const redo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: newFuture,
    });
    setProject(next);
    toast.info("Action redone");
  };

  const handleSave = () => {
    toast.success("Design saved successfully!");
  };

  const handleScaleAllItems = useCallback((scaleFactor: number) => {
    if (project.items.length === 0) return;

    // Calculate the center of all furniture
    let centerX = 0, centerY = 0;
    project.items.forEach(item => {
      centerX += item.x + item.width / 2;
      centerY += item.y + item.length / 2;
    });
    centerX /= project.items.length;
    centerY /= project.items.length;

    // Scale all items relative to center
    const scaledItems = project.items.map(item => {
      const itemCenterX = item.x + item.width / 2;
      const itemCenterY = item.y + item.length / 2;

      // Calculate offset from center
      const offsetX = itemCenterX - centerX;
      const offsetY = itemCenterY - centerY;

      // Scale offset and dimensions
      const newOffsetX = offsetX * scaleFactor;
      const newOffsetY = offsetY * scaleFactor;
      const newWidth = Math.max(20, Math.round(item.width * scaleFactor));
      const newLength = Math.max(20, Math.round(item.length * scaleFactor));

      // Calculate new position
      const newX = centerX + newOffsetX - newWidth / 2;
      const newY = centerY + newOffsetY - newLength / 2;

      return {
        ...item,
        x: Math.round(newX),
        y: Math.round(newY),
        width: newWidth,
        length: newLength
      };
    });

    updateProject({
      ...project,
      items: scaledItems
    });
  }, [project, updateProject]);

  if (showLanding) {
    return <LandingPage onLoginClick={() => setShowLanding(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={() => setIsLoggedIn(true)} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsLoggedIn(false)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav
          projectName={project.name}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onSave={handleSave}
          onUndo={undo}
          onRedo={redo}
          canUndo={history.past.length > 0}
          canRedo={history.future.length > 0}
        />

        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 h-full overflow-y-auto"
              >
                <h1 className="text-2xl font-semibold mb-6">Welcome back, Designer</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    onClick={() => setActiveTab("editor")}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    </div>
                    <h3 className="text-lg font-medium">Create New Design</h3>
                    <p className="text-gray-500 mt-1">Start a fresh furniture layout for a new client.</p>
                  </div>
                  {/* Stats or other cards */}
                </div>
              </motion.div>
            )}

            {activeTab === "saved" && (
              <SavedDesigns
                onEdit={(proj) => {
                  setProject(proj);
                  setActiveTab("editor");
                }}
              />
            )}

            {activeTab === "settings" && (
              <SettingsPage />
            )}

            {activeTab === "editor" && (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full"
              >
                {/* Left Panel: Library & Spec */}
                <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
                  <div className="h-1/2 overflow-y-auto border-b border-gray-200">
                    <RoomSpecPanel
                      config={project.roomConfig}
                      onChange={(config) => updateProject({ ...project, roomConfig: config })}
                    />
                  </div>
                  <div className="h-1/2 overflow-y-auto">
                    <FurnitureLibrary />
                  </div>
                </div>

                {/* Center Panel: Workspace */}
                <div className="flex-1 relative bg-gray-100">
                  {viewMode === "2d" ? (
                    <Canvas2D
                      project={project}
                      selectedItemId={selectedItemId}
                      onSelectItem={setSelectedItemId}
                      updateProject={(newProject) => updateProject(newProject)}
                    />
                  ) : (
                    <Visualization3D project={project} />
                  )}
                </div>

                {/* Right Panel: Properties */}
                <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
                  <PropertiesPanel
                    selectedItem={project.items.find(i => i.id === selectedItemId) || null}
                    roomConfig={project.roomConfig}
                    allItems={project.items}
                    lightingSettings={project.lightingSettings}
                    onScaleAllItems={handleScaleAllItems}
                    updateItem={(updatedItem) => {
                      const newItems = project.items.map(item => item.id === updatedItem.id ? updatedItem : item);
                      updateProject({ ...project, items: newItems });
                    }}
                    updateRoomConfig={(config) => updateProject({ ...project, roomConfig: config })}
                    updateLightingSettings={(settings) => updateProject({ ...project, lightingSettings: settings })}
                    onDelete={(id) => {
                      updateProject({ ...project, items: project.items.filter(i => i.id !== id) });
                      setSelectedItemId(null);
                    }}
                    onDuplicate={(item) => {
                      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), x: item.x + 20, y: item.y + 20 };
                      updateProject({ ...project, items: [...project.items, newItem] });
                      setSelectedItemId(newItem.id);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}