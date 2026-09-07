"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, QrCode, Sun, Moon, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why QuickCart", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, href, label) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveLink(label);

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-lg shadow-slate-200/40 dark:shadow-black/40 border-b border-slate-200/60 dark:border-slate-800/80 py-3"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            
            {/* Animated Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25 border border-white/20">
                  <QrCode size={20} className="text-white" />
                </div>
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Cart</span>
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                  Smart Self-Checkout
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = activeLink === link.label;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href, link.label)}
                    className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 dark:text-white bg-white dark:bg-slate-900 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:scale-105 active:scale-95 backdrop-blur-md"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -6, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 6, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    {theme === "dark" ? (
                      <Sun size={17} className="text-amber-400" />
                    ) : (
                      <Moon size={17} className="text-slate-600" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>

              <Link
                href="/auth/login"
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signup"
                className="relative group overflow-hidden px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 rounded-2xl shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-1.5 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 pointer-events-none" />
                <span>Get Started</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu & Theme Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 transition border border-slate-200 dark:border-slate-700"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-20 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-2 text-slate-800 dark:text-slate-100"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href, link.label)}
                  className="block px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-slate-800 rounded-2xl transition"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <Link
                  href="/auth/login"
                  className="block text-center px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Free Account
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
