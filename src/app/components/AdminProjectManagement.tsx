import React, { useState, useEffect } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminProjectManagement() {
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        // Load projects from local storage to show what exists globally (on this machine)
        const stored = localStorage.getItem("furni_studio_projects");
        if (stored) {
            setProjects(JSON.parse(stored));
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 h-full overflow-y-auto"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
                    <p className="text-gray-500 mt-2">View and manage all designs across the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                        <Package className="mx-auto mb-4 text-gray-400" size={48} />
                        <p>No projects found in the system yet.</p>
                    </div>
                ) : (
                    projects.map((proj) => (
                        <div key={proj.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center border-b border-gray-100">
                                <span className="text-gray-400 font-medium">No Preview</span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">{proj.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">
                                    Room: {proj.roomConfig?.width}x{proj.roomConfig?.length}cm • {proj.items?.length || 0} items
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>ID: {proj.id?.substring(0, 8)}...</span>
                                    <span>{new Date(proj.lastModified).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
