import { create } from 'zustand';

export type FurnitureType = 'chair' | 'table' | 'sofa' | 'bed' | 'cabinet' | 'rug';

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  name: string;
  x: number; // in meters
  z: number; // in meters (y in 2D)
  rotation: number; // in degrees
  width: number; // in meters
  depth: number; // in meters
  height: number; // in meters
  color: string;
}

export interface RoomConfig {
  width: number; // meters
  depth: number; // meters
  wallColor: string;
  floorColor: string;
  gridSize: number; // meters
  lightIntensity: number;
  showShadows: boolean;
}

export interface AppState {
  room: RoomConfig;
  items: FurnitureItem[];
  selectedId: string | null;
  mode: '2D' | '3D';
  history: FurnitureItem[][];
  historyIndex: number;
}
