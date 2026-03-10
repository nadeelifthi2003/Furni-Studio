import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Phone, Building2, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export interface Store {
    id: string;
    name: string;
    location: string;
    contact: string;
    status: 'active' | 'inactive';
}

const mockStores: Store[] = [
    {
        id: 'st-001',
        name: 'Design Hub Manhattan',
        location: '123 5th Ave, New York, NY 10003',
        contact: '+1 (555) 123-4567',
        status: 'active',
    },
    {
        id: 'st-002',
        name: 'Modern Living Brooklyn',
        location: '456 Bedford Ave, Brooklyn, NY 11211',
        contact: '+1 (555) 987-6543',
        status: 'active',
    },
    {
        id: 'st-003',
        name: 'Nordic Spaces West',
        location: '789 Market St, San Francisco, CA 94103',
        contact: '+1 (555) 456-7890',
        status: 'inactive',
    },
];

export function AdminStoreManagement() {
    const [stores, setStores] = useState<Store[]>(mockStores);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to remove this store?')) {
            setStores(stores.filter(s => s.id !== id));
            toast.success('Store removed successfully');
        }
    };

    const handleSaveStore = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newStore: Store = {
            id: editingStore ? editingStore.id : `st-${Date.now()}`,
            name: formData.get('name') as string,
            location: formData.get('location') as string,
            contact: formData.get('contact') as string,
            status: formData.get('status') as 'active' | 'inactive',
        };

        if (editingStore) {
            setStores(stores.map(s => s.id === editingStore.id ? newStore : s));
            toast.success('Store updated successfully');
        } else {
            setStores([...stores, newStore]);
            toast.success('Store added successfully');
        }

        setIsAddModalOpen(false);
        setEditingStore(null);
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
                    <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
                    <p className="text-gray-500 mt-2">Add, update, or remove furniture store locations.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingStore(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Add New Store
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search stores..."
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
                                <th className="px-6 py-4 font-medium">Store Profile</th>
                                <th className="px-6 py-4 font-medium">Location</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStores.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Store size={20} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{store.name}</div>
                                                <div className="text-sm text-gray-500">{store.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="text-sm">{store.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={16} className="text-gray-400" />
                                            <span className="text-sm">{store.contact}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            store.status === 'active' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => {
                                                    setEditingStore(store);
                                                    setIsAddModalOpen(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Store"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(store.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Store"
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
                        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingStore ? 'Edit Store Details' : 'Add New Store'}
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSaveStore} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input 
                                    name="name"
                                    type="text" 
                                    required
                                    defaultValue={editingStore?.name}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter store name..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Location</label>
                                <input 
                                    name="location"
                                    type="text" 
                                    required
                                    defaultValue={editingStore?.location}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter full address..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                <input 
                                    name="contact"
                                    type="text" 
                                    required
                                    defaultValue={editingStore?.contact}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. +1 (555) 000-0000"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    name="status"
                                    defaultValue={editingStore?.status || 'active'}
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
                                    {editingStore ? 'Save Changes' : 'Add Store'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
