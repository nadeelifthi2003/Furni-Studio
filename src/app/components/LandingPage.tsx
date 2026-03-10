import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Armchair, Bed, Sofa, LampFloor, PackageOpen, Zap, Truck, CheckCircle2, Star, Github, Twitter, Instagram, Linkedin, MonitorSmartphone, Box, ShoppingCart } from "lucide-react";

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
        <div className="min-h-screen bg-[#0B1120] text-gray-100 font-sans selection:bg-orange-500/30">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
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
        </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-24 bg-[#111827] relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Design Your Dream Space</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Our intuitive platform bridges the gap between imagination and reality in three simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="relative p-8 rounded-3xl bg-gray-800/50 border border-white/10 hover:bg-gray-800 transition-colors">
                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/30">1</div>
                            <MonitorSmartphone className="w-12 h-12 text-amber-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3">Draw Your Floorplan</h3>
                            <p className="text-gray-400">
                                Use our simple 2D editor to drag and drop walls, doors, and windows, accurately replicating your room's exact dimensions.
                            </p>
                        </div>
                        {/* Step 2 */}
                        <div className="relative p-8 rounded-3xl bg-gray-800/50 border border-white/10 hover:bg-gray-800 transition-colors">
                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/30">2</div>
                            <Box className="w-12 h-12 text-amber-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3">Place Furniture in 3D</h3>
                            <p className="text-gray-400">
                                Switch to immersive 3D mode. Browse our extensive catalog and drop premium furniture pieces directly into your virtual room.
                            </p>
                        </div>
                        {/* Step 3 */}
                        <div className="relative p-8 rounded-3xl bg-gray-800/50 border border-white/10 hover:bg-gray-800 transition-colors">
                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/30">3</div>
                            <ShoppingCart className="w-12 h-12 text-amber-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3">Checkout Securely</h3>
                            <p className="text-gray-400">
                                Love how it looks? Add all items from your virtual room directly to your cart and experience our premium white-glove delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-24 bg-[#0B1120] relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Trusted by Professionals</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            See what interior designers and homeowners are saying about FurniStudio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Jenkins", role: "Interior Designer", text: "FurniStudio revolutionized how I pitch to clients. The 3D visualization is flawless and immediately closes deals." },
                            { name: "Michael Chen", role: "Homeowner", text: "I was terrified of buying a sofa that wouldn't fit. Drawing my living room and placing the 3D model gave me 100% confidence." },
                            { name: "Emma Rossi", role: "Boutique Hotel Owner", text: "We redesigned our entire lobby using this tool. Being able to buy the exact furniture we modeled saved us weeks of sourcing." }
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-[#111827] p-8 rounded-2xl border border-white/5 relative">
                                <div className="flex text-amber-500 mb-4">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-300 italic mb-6">"{testimonial.text}"</p>
                                <div>
                                    <p className="font-bold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBWMGg0MHY0MEgwdnoiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8cGF0aCBkPSJNMCAwdjQwSDBWMHptNDAgMHY0MGgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMCAwaDQwdjBoLTQwem0wIDQwaDQwdjBoLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to see your new room?</h2>
                    <p className="text-orange-100 text-xl mb-10 max-w-2xl mx-auto">
                        Stop guessing if furniture will fit. Start building your perfect space right now in your browser. No downloads required.
                    </p>
                    <button
                        onClick={onLoginClick}
                        className="px-10 py-5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto"
                    >
                        Launch FurniStudio <ArrowRight size={20} />
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-6 text-orange-100/80 text-sm font-medium">
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Free Layout Tools</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Premium 3D Models</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Secure Checkout</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#0f141f] pt-16 pb-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <img src="/logo.png" alt="FurniStudio Logo" className="w-8 h-8 rounded-lg" />
                                <span className="text-2xl font-bold tracking-tight text-white">FurniStudio</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Professional-grade 2D mapping and 3D visualization combined with premium furniture retail. Build your dream space today.
                            </p>
                            <div className="flex items-center gap-4 text-gray-500">
                                <a href="#" className="hover:text-amber-500 transition-colors"><Twitter size={20} /></a>
                                <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
                                <a href="#" className="hover:text-amber-500 transition-colors"><Linkedin size={20} /></a>
                                <a href="#" className="hover:text-amber-500 transition-colors"><Github size={20} /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Product</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><button onClick={onLoginClick} className="hover:text-amber-400 transition-colors">2D Room Planner</button></li>
                                <li><button onClick={onLoginClick} className="hover:text-amber-400 transition-colors">3D Visualization</button></li>
                                <li><button onClick={onLoginClick} className="hover:text-amber-400 transition-colors">Furniture Catalog</button></li>
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Pricing & Delivery</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Company</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Partnerships</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Legal</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Return Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} FurniStudio. All rights reserved.</p>
                        <p>Designed for professionals and homeowners alike.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
