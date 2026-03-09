import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Armchair, Bed, Sofa, LampFloor, PackageOpen, Zap, Truck } from "lucide-react";

interface LandingPageProps {
    onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    // Random floating furniture pieces for the background
    const floatingIcons = mounted ? [
        { Icon: Armchair, x: "10%", y: "20%", delay: 0, scale: 1.5, duration: 15 },
        { Icon: Sofa, x: "80%", y: "15%", delay: 2, scale: 2, duration: 18 },
        { Icon: Bed, x: "15%", y: "70%", delay: 5, scale: 1.8, duration: 20 },
        { Icon: LampFloor, x: "75%", y: "65%", delay: 1, scale: 1.2, duration: 14 },
        { Icon: Armchair, x: "45%", y: "10%", delay: 7, scale: 1, duration: 12 },
        { Icon: Sofa, x: "50%", y: "85%", delay: 3, scale: 1.4, duration: 17 },
    ] : [];

    return (
        <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col items-center justify-center">
            {/* Animated Furniture Background Orbs / Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-amber-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[10%] -right-[20%] w-[60vw] h-[60vw] bg-orange-600/20 rounded-full blur-[120px]"
                />

                {/* Floating Furniture Icons */}
                {floatingIcons.map((item, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-white/5"
                        style={{ left: item.x, top: item.y }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: item.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: item.delay,
                        }}
                    >
                        <item.Icon size={100 * item.scale} strokeWidth={1} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col items-center text-center"
            >
                <motion.div variants={itemVariants} className="mb-6">
                    <span className="inline-block py-1.5 px-3 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold tracking-wider uppercase border border-amber-500/20 shadow-sm backdrop-blur-md">
                        Furni Studio Shop
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
                >
                    Discover Perfect <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                        Furniture for Your Home
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed"
                >
                    Explore our exclusive collection of modern furniture. Visualize items in your exact room dimensions using our revolutionary 2D & 3D planning tools before you buy.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
                    <button
                        onClick={onLoginClick}
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-500/40"
                    >
                        Shop Collection
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={onLoginClick}
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white/40 text-white rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
                    >
                        Open Room Planner
                    </button>
                </motion.div>

                {/* Feature Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {[
                        {
                            icon: <PackageOpen className="w-8 h-8 text-amber-400" />,
                            title: "Curated Collections",
                            desc: "Browse our hand-picked selection of premium sofas, tables, beds, and decorative lighting.",
                        },
                        {
                            icon: <Zap className="w-8 h-8 text-orange-400" />,
                            title: "Preview Before Buying",
                            desc: "Drag and drop your favorite items into our virtual 3D room planner to see exactly how they fit.",
                        },
                        {
                            icon: <Truck className="w-8 h-8 text-yellow-400" />,
                            title: "Fast, Secure Delivery",
                            desc: "Once you perfect your design, checkout seamlessly. We offer quick, white-glove delivery on all items.",
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
