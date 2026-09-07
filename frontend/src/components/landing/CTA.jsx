"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, QrCode, ShoppingCart, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function CTA() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="relative py-24 sm:py-32 bg-slate-50/70 dark:bg-[#060b18] transition-colors duration-300 overflow-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900 rounded-[36px] px-8 sm:px-16 py-16 sm:py-24 text-center overflow-hidden border border-blue-400/30 shadow-2xl shadow-blue-500/20"
        >
          {/* Subtle Isometric Grid Texture */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          {/* Floating Neon Blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            
            {/* Animated Center Holographic Badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-18 h-18 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-xl shadow-blue-900/50 relative"
            >
              <QrCode size={36} className="text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
            </motion.div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
              Ready to Experience the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-200">
                Future of Retail?
              </span>
            </h2>

            <p className="text-blue-100 dark:text-blue-200 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of smart shoppers who are skipping checkout lines every single day. Start scanning now with zero wait time.
            </p>

            {/* Glowing Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4.5 bg-white hover:bg-slate-50 text-blue-700 font-extrabold text-base rounded-2xl shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-blue-200/40 to-transparent transition-transform duration-700 pointer-events-none" />
                <span>Create Free Account</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/auth/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-base rounded-2xl border border-white/25 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Micro Feature Badges */}
            <div className="mt-10 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200 font-semibold">
              <div className="flex items-center gap-1.5">
                <Zap size={15} className="text-cyan-300" />
                <span>Instant Phone Setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-300" />
                <span>Razorpay 256-Bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShoppingCart size={15} className="text-amber-300" />
                <span>Live Cart Synchronization</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
