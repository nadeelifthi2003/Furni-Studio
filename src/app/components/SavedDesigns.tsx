import React, { useState } from "react";
import { Project } from "../App";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Copy, 
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface SavedDesignsProps {
  onEdit: (project: Project) => void;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Scandinavian Penthouse",
    lastModified: "2024-02-12T14:30:00Z",
    roomConfig: { width: 600, length: 500, height: 280, shape: "Rectangle", wallColor: "#ffffff" },
    items: [],
    lightingSettings: { ambientIntensity: 70, shadowSoftness: 50, directionalIntensity: 80, environmentPreset: "Daylight" }
  },
  {
    id: "proj-2",
    name: "Mid-Century Modern Office",
    lastModified: "2024-02-10T09:15:00Z",
    roomConfig: { width: 400, length: 400, height: 240, shape: "Rectangle", wallColor: "#f3f4f6" },
    items: [],
    lightingSettings: { ambientIntensity: 85, shadowSoftness: 30, directionalIntensity: 90, environmentPreset: "Artificial" }
  },
  {
    id: "proj-3",
    name: "Industrial Loft Kitchen",
    lastModified: "2024-02-08T16:45:00Z",
    roomConfig: { width: 800, length: 600, height: 320, shape: "L-shape", wallColor: "#e5e7eb" },
    items: [],
    lightingSettings: { ambientIntensity: 55, shadowSoftness: 70, directionalIntensity: 60, environmentPreset: "Sunset" }
  }
];

export function SavedDesigns({ onEdit }: SavedDesignsProps) {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PROJECTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Designs</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and organize your client consultations.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search designs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div 
            key={proj.id}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div 
                className="w-1/2 h-1/2 rounded-sm border border-gray-300 shadow-sm" 
                style={{ backgroundColor: proj.roomConfig.wallColor }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                <button 
                  onClick={() => onEdit(proj)}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                >
                  <Edit2 size={16} />
                  Open Project
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{proj.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                      <Calendar size={12} />
                      {new Date(proj.lastModified).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                      <Clock size={12} />
                      {new Date(proj.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-50">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Dimensions
                  <p className="text-gray-700 text-xs mt-0.5 normal-case font-semibold">{proj.roomConfig.width}x{proj.roomConfig.length}cm</p>
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">
                  Status
                  <p className="text-green-600 text-xs mt-0.5 normal-case font-bold">Completed</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No designs found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}