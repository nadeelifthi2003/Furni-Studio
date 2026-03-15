import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Box, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export interface FurnitureCatalogItem {
    id: string;
    type: string;
    name: string;
    dimensions: { w: number; l: number };
    glbUrl: string; // Required now
    status: 'active' | 'inactive';
}

const mockFurniture: FurnitureCatalogItem[] = [
    {
        id: 'furn-001',
        type: 'chair',
        name: 'Classic Armchair',
        dimensions: { w: 80, l: 80 },
        glbUrl: 'https://example.com/chair.glb', // Example placeholder
        status: 'active',
    },
    {
        id: 'furn-002',
        type: 'sofa',
        name: 'Modern 3-Seater',
        dimensions: { w: 220, l: 95 },
        glbUrl: 'https://example.com/sofa.glb',
        status: 'active',
    },
    {
        id: 'furn-003',
        type: 'table',
        name: 'Dining Table',
        dimensions: { w: 160, l: 90 },
        glbUrl: 'https://example.com/table.glb',
        status: 'active',
    },
];

export function AdminFurnitureManagement() {
    const [furnitureItems, setFurnitureItems] = useState<FurnitureCatalogItem[]>(mockFurniture);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FurnitureCatalogItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const filteredItems = furnitureItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string) => {
        setItemToDelete(id);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setFurnitureItems(furnitureItems.filter(item => item.id !== itemToDelete));
            toast.success('Furniture item removed successfully');
            setItemToDelete(null);
        }
    };

    const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        
        let fileUrl = editingItem?.glbUrl || '';
        const glbFile = formData.get('glbFile') as File;

        if (glbFile && glbFile.size > 0) {
            try {
                // Read as array buffer to send raw bytes since we pipe directly in Vite config
                const buffer = await glbFile.arrayBuffer();
                const response = await fetch(`/api/upload-model?name=${encodeURIComponent(glbFile.name)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    },
                    body: buffer
                });
                
                if (!response.ok) {
                    throw new Error('Upload failed');
                }
                
                const data = await response.json();
                fileUrl = data.url;
            } catch (err) {
                console.error('Failed to upload', err);
                toast.error('Failed to upload 3D model. Please try again.');
                setIsSaving(false);
                return;
            }
        }

        const newItem: FurnitureCatalogItem = {
            id: editingItem ? editingItem.id : `furn-${Date.now()}`,
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            dimensions: {
                w: parseInt(formData.get('width') as string, 10),
                l: parseInt(formData.get('length') as string, 10),
            },
            glbUrl: fileUrl,
            status: formData.get('status') as 'active' | 'inactive',
        };

        if (editingItem) {
            setFurnitureItems(furnitureItems.map(item => item.id === editingItem.id ? newItem : item));
            toast.success('Furniture item updated successfully');
        } else {
            setFurnitureItems([...furnitureItems, newItem]);
            toast.success('Furniture item added successfully');
        }

        setIsAddModalOpen(false);
        setEditingItem(null);
        setIsSaving(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 h-full overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Furniture</h1>
                    <p className="text-gray-500 mt-2">Add, update, or remove furniture catalog items.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Add Furniture Item
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search furniture items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Item Profile</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Dimensions (W x L)</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                                {/* Since we removed image, we just show an icon or a placeholder */}
                                                <Box className="text-blue-500" size={24} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5 truncate w-32" title={item.glbUrl}>
                                                    {item.glbUrl ? (item.glbUrl.startsWith('blob:') ? 'Local GLB Uploaded' : '3D Model Attached') : 'No Model attached'}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Box size={16} className="text-gray-400" />
                                            <span className="text-sm capitalize">{item.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{item.dimensions.w}cm x {item.dimensions.l}cm</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            item.status === 'active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setIsAddModalOpen(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Item"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingItem ? 'Edit Furniture Item' : 'Add New Furniture'}
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                    <input 
                                        name="name"
                                        type="text" 
                                        required
                                        defaultValue={editingItem?.name}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Modern Sofa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select 
                                        name="type"
                                        required
                                        defaultValue={editingItem?.type || 'chair'}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="chair">Chair</option>
                                        <option value="sofa">Sofa</option>
                                        <option value="table">Table</option>
                                        <option value="side-table">Side Table</option>
                                        <option value="bed">Bed</option>
                                        <option value="lamp">Lamp</option>
                                        <option value="plant">Plant</option>
                                        <option value="rug">Rug</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                                    <input 
                                        name="width"
                                        type="number" 
                                        required
                                        defaultValue={editingItem?.dimensions?.w || 100}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                                    <input 
                                        name="length"
                                        type="number" 
                                        required
                                        defaultValue={editingItem?.dimensions?.l || 100}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload 3D Model (.glb)</label>
                                <input 
                                    name="glbFile"
                                    type="file" 
                                    accept=".glb"
                                    required={!editingItem?.glbUrl}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {editingItem?.glbUrl && (
                                    <p className="text-xs text-green-600 mt-2 font-medium">✓ Model already attached. Uploading a new one will replace it.</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    name="status"
                                    defaultValue={editingItem?.status || 'active'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    disabled={isSaving}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        editingItem ? 'Save Changes' : 'Add Furniture'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
                    >
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <Trash2 size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Furniture Item</h2>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to delete this furniture item? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setItemToDelete(null)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Delete Item
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

        </motion.div>
    );
}
