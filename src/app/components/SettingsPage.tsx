import React from "react";
import { motion } from "motion/react";
import {
    User,
    Settings,
    Monitor,
    Scale,
    Save,
    ShieldCheck,
    Bell,
    Palette,
    Check,
    ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export function SettingsPage() {
    const sections = [
        {
            id: "profile",
            title: "Designer Profile",
            icon: User,
            description: "Manage your professional identity and contact information.",
            fields: [
                { label: "Display Name", value: "Designer Jane Doe", type: "text" },
                { label: "Professional Email", value: "designer@furnihome.com", type: "email" },
            ]
        },
        {
            id: "preferences",
            title: "Workspace Preferences",
            icon: Palette,
            description: "Customize your design environment and display settings.",
            settings: [
                { label: "Default Measurement Unit", options: ["Centimeters (cm)", "Inches (in)"], current: "Centimeters (cm)" },
                { label: "Interface Theme", options: ["Light", "Dark", "System"], current: "System" },
                { label: "Enable Grid Snapping", type: "toggle", enabled: true },
            ]
        },
        {
            id: "visualization",
            title: "Visualization Quality",
            icon: Monitor,
            description: "Configure the 3D rendering engine for your hardware.",
            settings: [
                { label: "Render Resolution", options: ["Low", "Medium", "High (Retina)"], current: "High (Retina)" },
                { label: "Real-time Shadows", type: "toggle", enabled: true },
                { label: "Texture Quality", options: ["Standard", "HD", "Ultra"], current: "HD" },
            ]
        },
        {
            id: "security",
            title: "Security & Access",
            icon: ShieldCheck,
            description: "Secure your account and manage authorized devices.",
            fields: [
                { label: "Last Password Change", value: "3 months ago", type: "text", disabled: true },
            ],
            actions: [
                { label: "Update Password", color: "blue" },
                { label: "Enable 2FA Authentication", color: "gray" }
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 h-full overflow-y-auto bg-gray-50/50"
        >
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Application Settings</h1>
                    <p className="text-gray-500 mt-2">Personalize your FurniHome experience and optimize your design workflow.</p>
                </header>

                <div className="space-y-6 pb-20">
                    {sections.map((section) => (
                        <section
                            key={section.id}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <section.icon size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                                        <p className="text-sm text-gray-500">{section.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {section.fields && section.fields.map((field, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                        <div className="md:col-span-2 relative">
                                            <input
                                                type={field.type}
                                                defaultValue={field.value}
                                                disabled={"disabled" in field ? field.disabled : false}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {section.settings && section.settings.map((setting, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{setting.label}</p>
                                        </div>
                                        {setting.type === "toggle" ? (
                                            <button
                                                className={`w-12 h-6 rounded-full transition-colors relative ${setting.enabled ? "bg-blue-600" : "bg-gray-200"}`}
                                                onClick={() => toast.success(`${setting.label} updated`)}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${setting.enabled ? "right-1" : "left-1"}`} />
                                            </button>
                                        ) : (
                                            <div className="relative">
                                                <select
                                                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer transition-all"
                                                    defaultValue={setting.current}
                                                    onChange={() => toast.success(`${setting.label} updated`)}
                                                >
                                                    {setting.options?.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronRight className="absolute right-3 top-2.5 text-gray-400 rotate-90" size={16} />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {section.actions && (
                                    <div className="flex flex-wrap gap-3 pt-4">
                                        {section.actions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${action.color === "blue"
                                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                onClick={() => toast.info(`Initializing ${action.label}...`)}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}

                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all font-sans"
                            onClick={() => toast.info("Changes discarded")}
                        >
                            Discard Changes
                        </button>
                        <button
                            className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 font-sans"
                            onClick={() => {
                                toast.success("All settings saved successfully!");
                            }}
                        >
                            <Save size={18} />
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
