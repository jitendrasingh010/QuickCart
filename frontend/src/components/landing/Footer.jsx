"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, Mail, Phone, MapPin, ArrowUpRight, Github, Twitter, Linkedin, Sparkles } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Why QuickCart", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ],
  Shopper: [
    { label: "Sign In", href: "/auth/login" },
    { label: "Create Account", href: "/auth/signup" },
    { label: "Customer Portal", href: "/customer" },
    { label: "QR Camera Scanner", href: "/customer/qrscanner" },
  ],
  Merchant: [
    { label: "Admin Dashboard", href: "/admin" },
    { label: "Product Management", href: "/admin/categories" },
    { label: "Order Invoicing", href: "/admin/orders" },
    { label: "Customer Analytics", href: "/admin/customers" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScroll = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="relative bg-slate-900 dark:bg-black text-slate-300 border-t border-slate-800 dark:border-slate-900 transition-colors duration-300 overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/20"
              >
                <QrCode size={20} className="text-white" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight leading-none">
                  Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cart</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Autonomous Self-Checkout
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern in-store self-checkout platform. Scan shelf QR codes with your smartphone, manage live carts, pay digitally, and skip cashier queues forever.
            </p>

            {/* Contact Details */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-400 pt-2">
              <div className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail size={15} className="text-blue-400" />
                <span>support@quickcart.in</span>
              </div>
              <div className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone size={15} className="text-blue-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 hover:text-white transition-colors">
                <MapPin size={15} className="text-blue-400" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Nav Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleScroll(e, link.href)}
                        className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {currentYear} QuickCart Inc. All rights reserved. Designed for queue-free smart shopping.
          </p>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>All Store Systems Operational • 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
