import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Box, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export interface FurnitureCatalogItem {
    id: string;
    type: string;
    name: string;
    dimensions: { w: number; l: number };
    image: string;
    status: 'active' | 'inactive';
}

const mockFurniture: FurnitureCatalogItem[] = [
    {
        id: 'furn-001',
        type: 'chair',
        name: 'Classic Armchair',
        dimensions: { w: 80, l: 80 },
        image: 'https://images.unsplash.com/photo-1760236963218-424a715d1816?q=80&w=200',
        status: 'active',
    },
    {
        id: 'furn-002',
        type: 'sofa',
        name: 'Modern 3-Seater',
        dimensions: { w: 220, l: 95 },
        image: 'https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?q=80&w=200',
        status: 'active',
    },
    {
        id: 'furn-003',
        type: 'table',
        name: 'Dining Table',
        dimensions: { w: 160, l: 90 },
        image: 'https://images.unsplash.com/photo-1679309981674-cef0e23a7864?q=80&w=200',
        status: 'active',
    },
];

export function AdminFurnitureManagement() {
    const [furnitureItems, setFurnitureItems] = useState<FurnitureCatalogItem[]>(mockFurniture);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FurnitureCatalogItem | null>(null);

    const filteredItems = furnitureItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to remove this furniture item?')) {
            setFurnitureItems(furnitureItems.filter(item => item.id !== id));
            toast.success('Furniture item removed successfully');
        }
    };

    const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newItem: FurnitureCatalogItem = {
            id: editingItem ? editingItem.id : `furn-${Date.now()}`,
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            dimensions: {
                w: parseInt(formData.get('width') as string, 10),
                l: parseInt(formData.get('length') as string, 10),
            },
            image: formData.get('image') as string,
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
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-gray-400" size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-500">{item.id}</div>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input 
                                    name="image"
                                    type="url" 
                                    required
                                    defaultValue={editingItem?.image}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/image.jpg"
                                />
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
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    {editingItem ? 'Save Changes' : 'Add Furniture'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
