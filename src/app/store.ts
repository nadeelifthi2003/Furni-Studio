import { create } from 'zustand';
import { Project, RoomConfig, FurnitureItem, LightingSettings } from './App';
import { User } from './types';

interface AppState {
  // Global View/Auth State
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  viewMode: "2d" | "3d";
  setViewMode: (mode: "2d" | "3d") => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Project State
  project: Project;
  setProject: (project: Project) => void;
  updateProject: (project: Project, skipHistory?: boolean) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;

  // History State
  history: { past: Project[]; present: Project; future: Project[] };
  undo: () => void;
  redo: () => void;
  
  // Camera State
  cameraResetTrigger: number;
  triggerCameraReset: () => void;
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

const INITIAL_PROJECT: Project = {
  id: "proj-1",
  name: "Modern Living Room Consultation",
  lastModified: new Date().toISOString(),
  roomConfig: INITIAL_ROOM_CONFIG,
  items: [],
  lightingSettings: INITIAL_LIGHTING_SETTINGS,
};

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  viewMode: '2d',
  setViewMode: (mode) => set({ viewMode: mode }),
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  project: INITIAL_PROJECT,
  setProject: (project) => set({ project }),
  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),

  updateProject: (newProject, skipHistory = false) => {
    set((state) => {
      if (!skipHistory) {
        return {
          project: newProject,
          history: {
            past: [...state.history.past, state.history.present],
            present: newProject,
            future: [],
          },
        };
      } else {
        return {
          project: newProject,
          history: {
            ...state.history,
            present: newProject,
          },
        };
      }
    });
  },

  history: {
    past: [],
    present: INITIAL_PROJECT,
    future: [],
  },

  undo: () => {
    const { history } = get();
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    
    set({
      history: {
        past: newPast,
        present: previous,
        future: [history.present, ...history.future],
      },
      project: previous
    });
  },

  redo: () => {
    const { history } = get();
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    
    set({
      history: {
        past: [...history.past, history.present],
        present: next,
        future: newFuture,
      },
      project: next
    });
  },

  cameraResetTrigger: 0,
  triggerCameraReset: () => set((state) => ({ cameraResetTrigger: state.cameraResetTrigger + 1 })),
}));
