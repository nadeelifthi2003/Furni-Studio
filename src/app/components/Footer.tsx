import React from "react";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

interface FooterProps {
  onLoginClick?: () => void;
}

export function Footer({ onLoginClick }: FooterProps) {
  return (
    <footer className="bg-[#0f141f] pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo icon — blue rounded square with 3D box */}
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">FurniStudio</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Professional-grade 2D mapping and 3D visualization combined with premium furniture retail. Build your dream space today.
            </p>
            <div className="flex items-center gap-4 text-gray-500">
              <a href="#" className="hover:text-amber-500 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Github size={18} /></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={onLoginClick} className="hover:text-amber-400 transition-colors">2D Room Planner</button></li>
              <li><button onClick={onLoginClick} className="hover:text-amber-400 transition-colors">3D Visualization</button></li>
              <li><button onClick={onLoginClick} className="hover:text-amber-400 transition-colors">Furniture Catalog</button></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Pricing &amp; Delivery</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Partnerships</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Return Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FurniStudio. All rights reserved.</p>
          <p>Designed for professionals and homeowners alike.</p>
        </div>
      </div>
    </footer>
  );
}
