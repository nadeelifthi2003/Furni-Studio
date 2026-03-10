import React from 'react';
import { Users, BarChart, Package, Store } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
    const stats = [
        { title: 'Total Users', value: '142', icon: Users, change: '+12%', color: 'blue' },
        { title: 'Active Projects', value: '85', icon: Package, change: '+5%', color: 'green' },
        { title: 'Total Stores', value: '3', icon: Store, change: '+1', color: 'orange' },
        { title: 'Designs Exported', value: '1,204', icon: BarChart, change: '+22%', color: 'purple' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 h-full overflow-y-auto"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
                <p className="text-gray-500 mt-2">Platform statistics and high-level metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                            <p className={`text-sm font-medium mt-2 text-${stat.color}-600`}>
                                {stat.change} from last month
                            </p>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}>
                            <stat.icon size={28} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Platform Activity</h2>
                <div className="space-y-4">
                    <p className="text-gray-500">System is running normally. No recent alerts.</p>
                </div>
            </div>
        </motion.div>
    );
}
