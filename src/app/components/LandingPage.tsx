import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Box, Ruler, Layers } from "lucide-react";

interface LandingPageProps {
    onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col items-center justify-center">
            {/* Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[10%] -right-[20%] w-[60vw] h-[60vw] bg-indigo-600/20 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col items-center text-center"
            >
                <motion.div variants={itemVariants} className="mb-6">
                    <span className="inline-block py-1.5 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wider uppercase border border-blue-500/20 shadow-sm backdrop-blur-md">
                        Professional Studio
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
                >
                    Design the Future of <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        Interior Spaces
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed"
                >
                    FurniHome is the ultimate 2D & 3D visualization tool for interior designers. Arrange, scale, and visualize furniture layouts with real-time lighting and rendering.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
                    <button
                        onClick={onLoginClick}
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
                    >
                        Access Studio
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Feature Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {[
                        {
                            icon: <Box className="w-8 h-8 text-blue-400" />,
                            title: "3D Visualization",
                            desc: "Seamlessly switch between precision 2D planning and immersive 3D viewing.",
                        },
                        {
                            icon: <Ruler className="w-8 h-8 text-indigo-400" />,
                            title: "Room Specifications",
                            desc: "Configure exact room dimensions, geometry, and lighting setups.",
                        },
                        {
                            icon: <Layers className="w-8 h-8 text-purple-400" />,
                            title: "Extensive Library",
                            desc: "Access a curated collection of modern, customizable furniture pieces.",
                        },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-100 mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
