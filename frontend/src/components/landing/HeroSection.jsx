"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  ShoppingCart,
  CreditCard,
  Smartphone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  Receipt,
  Store,
  Package,
  ShoppingBag,
} from "lucide-react";

export default function HeroSection() {
  // Shopping Journey Animation Stage Loop:
  // 0: Customer enters kiosk
  // 1: Scans Product 1 (🥑 Avocado) -> flies into cart
  // 2: Scans Product 2 (🥛 Milk) -> cart count: 2
  // 3: Scans Product 3 (🥤 Sparkling Drink) -> cart count: 3
  // 4: Checkout screen & Payment Approved ✓
  // 5: Digital Receipt Generated & Customer Exits
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const stageDurations = [2500, 2200, 2000, 2200, 2400, 2600];
    const timer = setTimeout(() => {
      setAnimationStage((prev) => (prev + 1) % stageDurations.length);
    }, stageDurations[animationStage]);

    return () => clearTimeout(timer);
  }, [animationStage]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 transition-colors duration-300"
    >
      {/* ========================================================================= */}
      {/* 🌌 CONTINUOUS FUTURISTIC AMBIENT ANIMATED BACKGROUND                     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-slate-50/70 dark:bg-[#060b18] transition-colors duration-300" />

      {/* Moving Gradient Meshes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.25, 0.95, 1],
            x: [0, 60, -40, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[620px] h-[620px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/15 to-purple-400/10 dark:from-blue-600/25 dark:via-indigo-600/20 dark:to-purple-600/15 rounded-full blur-[130px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 0.9, 1],
            x: [0, -50, 50, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[680px] h-[680px] bg-gradient-to-br from-indigo-400/20 via-violet-400/15 to-cyan-400/10 dark:from-indigo-600/25 dark:via-violet-600/20 dark:to-cyan-500/15 rounded-full blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[150px]"
        />

        {/* Subtle Isometric Technical Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Floating Particles */}
        {[
          { top: "18%", left: "14%", size: "w-2 h-2", color: "bg-blue-400/60 dark:bg-blue-400", duration: 7 },
          { top: "75%", left: "8%", size: "w-1.5 h-1.5", color: "bg-indigo-400/60 dark:bg-indigo-400", duration: 9 },
          { top: "28%", right: "12%", size: "w-2 h-2", color: "bg-violet-400/60 dark:bg-violet-400", duration: 8 },
          { top: "85%", right: "18%", size: "w-1.5 h-1.5", color: "bg-cyan-400/60 dark:bg-cyan-400", duration: 6 },
        ].map((p, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute ${p.top} ${p.left || ""} ${p.right || ""} ${p.size} ${p.color} rounded-full blur-xs`}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 🌟 2-COLUMN HERO SHOWCASE                                                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 🚀 LEFT COLUMN: HEADLINE, MISSION & CALL TO ACTION (6 Cols)        */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 text-left space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/15 dark:via-indigo-500/15 dark:to-purple-500/15 border border-blue-500/20 dark:border-blue-400/30 backdrop-blur-xl text-xs font-bold text-blue-600 dark:text-blue-300 shadow-sm shadow-blue-500/10">
              <Sparkles size={14} className="text-blue-500 dark:text-blue-400 animate-pulse" />
              <span>AI-Powered In-Store Smart Self-Checkout</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Massive Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Skip Checkout Lines with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
                Smart QR Shopping.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Scan product QR barcodes right from the store aisle, manage your live digital cart, pay online via 1-click UPI, and walk out. Zero cashier queues forever.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/auth/signup"
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 pointer-events-none" />
                <span>Start Shopping Free</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/auth/login"
                className="px-8 py-4 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base rounded-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 text-center hover:-translate-y-0.5"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Micro Trust & Telemetry Pills */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <Check size={13} />
                </div>
                <span>0.2s Scan Latency</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="w-5 h-5 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <ShieldCheck size={13} />
                </div>
                <span>Razorpay Secured</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="w-5 h-5 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <Zap size={13} />
                </div>
                <span>100% Queue Free</span>
              </div>
            </div>
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 🛒 RIGHT COLUMN: SPECIAL CONTINUOUS SELF-CHECKOUT SIMULATION (6 Cols) */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 relative w-full"
          >
            {/* Ambient Aura Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-[36px] blur-2xl opacity-70 -z-10" />

            {/* High-Tech Supermarket Kiosk Terminal Container */}
            <div className="relative rounded-[32px] bg-white/80 dark:bg-slate-900/85 backdrop-blur-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden min-h-[460px] flex flex-col justify-between">
              
              {/* Terminal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                    <Store size={16} />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Smart Store Node #04</span>
                    <span className="block text-[10px] text-blue-600 dark:text-cyan-400 font-mono">Status: Live Shopper Simulation</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Looping Journey</span>
                </div>
              </div>

              {/* Central Stage: Continuous Sequential Shopping Experience */}
              <div className="relative my-6 flex-1 flex flex-col items-center justify-center min-h-[240px]">
                
                {/* Stage 0: Customer enters store */}
                {animationStage === 0 && (
                  <motion.div
                    key="stage-0"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-3"
                  >
                    <div className="text-5xl">🚶‍♂️🛒</div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
                      Step 1: Shopper enters Smart Supermarket
                    </div>
                  </motion.div>
                )}

                {/* Stage 1: Scans Product 1 (🥑 Avocado) */}
                {animationStage === 1 && (
                  <motion.div
                    key="stage-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative flex flex-col items-center space-y-4"
                  >
                    {/* Laser Scanner Reticle */}
                    <div className="relative p-4 rounded-2xl bg-slate-950 border border-cyan-400 text-cyan-300 flex items-center gap-3 shadow-lg shadow-cyan-500/20">
                      <QrCode size={28} className="animate-pulse" />
                      <div className="text-left">
                        <span className="block text-xs font-mono">BARCODE DETECTED</span>
                        <span className="block text-sm font-black text-white">🥑 Fresh Organic Avocado</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-md">$2.49</span>
                    </div>

                    {/* Product flying into cart */}
                    <motion.div
                      animate={{ y: [0, 15], scale: [1, 0.9] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="text-xs font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1"
                    >
                      <span>Item syncing into Smart Cart</span>
                      <ArrowRight size={14} />
                    </motion.div>
                  </motion.div>
                )}

                {/* Stage 2 & 3: Multiple Products Scanning & Cart Filling */}
                {(animationStage === 2 || animationStage === 3) && (
                  <motion.div
                    key="stage-2-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-3"
                  >
                    <div className="p-3.5 bg-white dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                          <ShoppingCart size={16} />
                          Live Smart Cart
                        </span>
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
                          {animationStage === 2 ? "2 Items" : "3 Items"}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-blue-50 dark:bg-slate-900 rounded-xl text-center border border-blue-100 dark:border-slate-800">
                          <span className="text-xl">🥑</span>
                          <span className="block text-[10px] font-bold mt-1">Avocado</span>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-slate-900 rounded-xl text-center border border-blue-100 dark:border-slate-800">
                          <span className="text-xl">🥛</span>
                          <span className="block text-[10px] font-bold mt-1">Milk</span>
                        </div>
                        <div className={`p-2 rounded-xl text-center border transition-all ${
                          animationStage === 3
                            ? "bg-blue-50 dark:bg-slate-900 border-cyan-400 text-slate-900 dark:text-white"
                            : "opacity-40 border-dashed border-slate-300 dark:border-slate-700"
                        }`}>
                          <span className="text-xl">🥤</span>
                          <span className="block text-[10px] font-bold mt-1">Juice</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Stage 4: Checkout Screen & Payment Approved */}
                {animationStage === 4 && (
                  <motion.div
                    key="stage-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-center space-y-2 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                      <CreditCard size={24} />
                    </div>
                    <h3 className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                      Payment Approved • $14.80
                    </h3>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Razorpay Instant Settlement ✓
                    </p>
                  </motion.div>
                )}

                {/* Stage 5: Digital Receipt Generated & Customer Exits */}
                {animationStage === 5 && (
                  <motion.div
                    key="stage-5"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full p-4 rounded-2xl bg-indigo-50 dark:bg-slate-950/90 border border-indigo-200 dark:border-indigo-500/40 text-center space-y-2"
                  >
                    <div className="flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      <Receipt size={16} />
                      <span>Digital E-Receipt Dispatched</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Shopper skips queue and walks out happily! 🛍️✨
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Bottom Telemetry Bar: Step indicators */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-6 gap-1.5 text-center">
                {["Enter", "Scan #1", "Scan #2", "Cart Ready", "Paid ✓", "Exit"].map((label, idx) => (
                  <div
                    key={idx}
                    className={`py-1 rounded-lg text-[9px] font-bold transition-all ${
                      animationStage === idx
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
