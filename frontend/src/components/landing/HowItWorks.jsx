"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { QrCode, ShoppingCart, CreditCard, Receipt, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: QrCode,
    title: "Scan Product QR",
    tagline: "Point & Scan In-Aisle",
    description: "Launch the QuickCart web scanner and aim your phone camera at any item's shelf QR code or packaging barcode.",
    previewIcon: "📱⚡",
    color: "blue",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Smart Cart Auto-Sync",
    tagline: "Real-time Subtotals",
    description: "Item specs, nutritional info, and pricing auto-populate. Adjust quantities directly in your synchronized digital cart.",
    previewIcon: "🛒🥑",
    color: "indigo",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "1-Click Digital Payment",
    tagline: "UPI & Instant Settlement",
    description: "Choose your preferred payment method — UPI, Cards, NetBanking, or Digital Wallets powered by Razorpay.",
    previewIcon: "💳⚡",
    color: "violet",
  },
  {
    number: "04",
    icon: Receipt,
    title: "Digital Receipt & Walk Out",
    tagline: "Zero Waiting Queues",
    description: "Payment is verified in milliseconds. Your digital invoice is archived and you can walk directly out of the store.",
    previewIcon: "🧾✨",
    color: "emerald",
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 bg-slate-50/70 dark:bg-[#060b18] transition-colors duration-300 overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200/80 dark:border-blue-800 mb-4 shadow-xs">
            <Sparkles size={13} className="text-blue-500 animate-pulse" />
            <span>Frictionless Flow</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How QuickCart Works in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
              4 Simple Steps
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            From discovering items in the aisle to walking out the door — total checkout time takes under 60 seconds.
          </p>
        </motion.div>

        {/* 4-Step Interactive Horizontal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 35 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group relative p-6 sm:p-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>

                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-mono">
                      {step.number}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                    {step.tagline}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Simulation Pill Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="text-lg">{step.previewIcon}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                    <CheckCircle2 size={13} />
                    Ready
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
