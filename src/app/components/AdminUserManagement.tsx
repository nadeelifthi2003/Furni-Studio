import React, { useState } from 'react';
import { User, Shield, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType } from '../types';

export function AdminUserManagement() {
    const [users, setUsers] = useState<UserType[]>([
        { email: 'designer@furnihome.com', role: 'designer', name: 'Pro Designer' },
        { email: 'admin@furnihome.com', role: 'admin', name: 'System Admin' },
        { email: 'john@furnihome.com', role: 'designer', name: 'John Doe' },
    ]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 h-full overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-2">Manage designers and admin access.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Add New User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900">Role</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <User size={16} />
                                        </div>
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role === 'admin' && <Shield size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
