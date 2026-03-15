import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, Armchair, Bed, Sofa, LampFloor, PackageOpen, Zap, Truck,
  CheckCircle2, Star, Github, Twitter, Instagram, Linkedin,
  MonitorSmartphone, Box, ShoppingCart, Package, Menu, X,
  Users, Layers, TrendingUp,
} from "lucide-react";

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const floatingIcons = mounted ? [
    { Icon: Armchair, x: "10%", y: "20%", delay: 0, scale: 1.5, duration: 15 },
    { Icon: Sofa, x: "80%", y: "15%", delay: 2, scale: 2, duration: 18 },
    { Icon: Bed, x: "15%", y: "70%", delay: 5, scale: 1.8, duration: 20 },
    { Icon: LampFloor, x: "75%", y: "65%", delay: 1, scale: 1.2, duration: 14 },
    { Icon: Armchair, x: "45%", y: "10%", delay: 7, scale: 1, duration: 12 },
    { Icon: Sofa, x: "50%", y: "85%", delay: 3, scale: 1.4, duration: 17 },
  ] : [];

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  const stats = [
    { icon: <Users className="w-5 h-5 text-blue-400" />, value: "2,400+", label: "Happy Clients" },
    { icon: <Layers className="w-5 h-5 text-indigo-400" />, value: "12,000+", label: "Designs Created" },
    { icon: <Package className="w-5 h-5 text-amber-400" />, value: "500+", label: "Furniture Items" },
    { icon: <TrendingUp className="w-5 h-5 text-green-400" />, value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 font-sans selection:bg-blue-500/30">

      {/* ─── STICKY TOP NAVIGATION ─── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1120]/90 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Package size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FurniStudio</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
            >
              Get Started <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#111827] border-b border-white/10 px-6 py-4 space-y-4 overflow-hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Get Started <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[10%] -right-[20%] w-[60vw] h-[60vw] bg-indigo-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-amber-600/10 rounded-full blur-[80px]"
          />

          {/* Floating Furniture Icons */}
          {floatingIcons.map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-white/5"
              style={{ left: item.x, top: item.y }}
              animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
            >
              <item.Icon size={100 * item.scale} strokeWidth={1} />
            </motion.div>
          ))}

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBWMGg0MHY0MEgwdnoiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8cGF0aCBkPSJNMCAwdjQwSDBWMHptNDAgMHY0MGgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPHBhdGggZD0iTTAgMGg0MHYwaC00MHptMCA0MGg0MHYwaC00MHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wider uppercase border border-blue-500/20 shadow-sm backdrop-blur-md">
              Professional Furniture Design Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Design Your Perfect{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Space in 3D
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed"
          >
            Explore our exclusive collection of premium furniture. Visualize items in your exact room dimensions
            using our revolutionary{" "}
            <span className="text-gray-200 font-medium">2D &amp; 3D planning tools</span>{" "}
            before you buy.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
            <button
              onClick={onLoginClick}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
            >
              Start Designing Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLoginClick}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white/40 hover:bg-white/5 text-white rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
            >
              Browse Furniture Collection
            </button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div id="features" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {[
              {
                icon: <PackageOpen className="w-8 h-8 text-blue-400" />,
                title: "Curated Collections",
                desc: "Browse our hand-picked selection of premium sofas, tables, beds, and decorative lighting.",
              },
              {
                icon: <Zap className="w-8 h-8 text-indigo-400" />,
                title: "Preview Before Buying",
                desc: "Drag and drop your favorite items into our virtual 3D room planner to see exactly how they fit.",
              },
              {
                icon: <Truck className="w-8 h-8 text-amber-400" />,
                title: "Fast, Secure Delivery",
                desc: "Once you perfect your design, checkout seamlessly. We offer quick, white-glove delivery on all items.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-left hover:bg-white/8 hover:border-white/20 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS / TRUST BAR ─── */}
      <section className="border-t border-b border-white/10 bg-white/3 backdrop-blur-sm py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                  {stat.icon}
                </div>
                <span className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 bg-[#111827] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase border border-blue-500/20 mb-4"
            >
              Simple Process
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Design Your Dream Space
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-lg"
            >
              Our intuitive platform bridges the gap between imagination and reality in three simple steps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                icon: <MonitorSmartphone className="w-12 h-12 text-blue-400 mb-6" />,
                title: "Draw Your Floorplan",
                desc: "Use our simple 2D editor to drag and drop walls, doors, and windows, accurately replicating your room's exact dimensions.",
              },
              {
                step: "2",
                icon: <Box className="w-12 h-12 text-indigo-400 mb-6" />,
                title: "Place Furniture in 3D",
                desc: "Switch to immersive 3D mode. Browse our extensive catalog and drop premium furniture pieces directly into your virtual room.",
              },
              {
                step: "3",
                icon: <ShoppingCart className="w-12 h-12 text-amber-400 mb-6" />,
                title: "Checkout Securely",
                desc: "Love how it looks? Add all items from your virtual room directly to your cart and experience our premium white-glove delivery.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="relative p-8 rounded-3xl bg-gray-800/50 border border-white/10 hover:bg-gray-800/80 hover:border-white/20 transition-all"
              >
                <div className="absolute -top-5 -left-5 w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-600/30 text-white">
                  {s.step}
                </div>
                {s.icon}
                <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 bg-[#0B1120] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block py-1 px-3 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase border border-amber-500/20 mb-4"
            >
              Reviews
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Trusted by Professionals
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-lg"
            >
              See what interior designers and homeowners are saying about FurniStudio.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Interior Designer",
                avatar: "SJ",
                avatarColor: "from-blue-500 to-indigo-600",
                text: "FurniStudio revolutionized how I pitch to clients. The 3D visualization is flawless and immediately closes deals.",
              },
              {
                name: "Michael Chen",
                role: "Homeowner",
                avatar: "MC",
                avatarColor: "from-indigo-500 to-purple-600",
                text: "I was terrified of buying a sofa that wouldn't fit. Drawing my living room and placing the 3D model gave me 100% confidence.",
              },
              {
                name: "Emma Rossi",
                role: "Boutique Hotel Owner",
                avatar: "ER",
                avatarColor: "from-purple-500 to-fuchsia-600",
                text: "We redesigned our entire lobby using this tool. Being able to buy the exact furniture we modeled saved us weeks of sourcing.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="bg-[#111827] p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all relative group"
              >
                {/* Top highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex text-amber-400 mb-5 gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.avatarColor} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 relative overflow-hidden">
        {/* Deep blue gradient matching the primary accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBWMGg0MHY0MEgwdnoiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8cGF0aCBkPSJNMCAwdjQwSDBWMHptNDAgMHY0MGgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMCAwaDQwdjBoLTQwem0wIDQwaDQwdjBoLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30" />

        {/* Subtle orb */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to see your new room?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop guessing if furniture will fit. Start building your perfect space right now in your browser.{" "}
            <span className="font-semibold text-white">No downloads required.</span>
          </p>
          <button
            onClick={onLoginClick}
            className="group px-10 py-4 bg-[#0B1120] hover:bg-gray-900 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-2xl shadow-black/40 inline-flex items-center gap-3 border border-white/10"
          >
            Launch FurniStudio
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-blue-100/80 text-sm font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Free Layout Tools</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Premium 3D Models</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Secure Checkout</span>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0f141f] pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <Package size={20} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">FurniStudio</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Professional-grade 2D mapping and 3D visualization combined with premium furniture retail. Build
                your dream space today.
              </p>
              <div className="flex items-center gap-4 text-gray-500">
                <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Github size={20} /></a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={onLoginClick} className="hover:text-blue-400 transition-colors">2D Room Planner</button></li>
                <li><button onClick={onLoginClick} className="hover:text-blue-400 transition-colors">3D Visualization</button></li>
                <li><button onClick={onLoginClick} className="hover:text-blue-400 transition-colors">Furniture Catalog</button></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing &amp; Delivery</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Partnerships</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Return Policy</a></li>
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
