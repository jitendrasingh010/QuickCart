"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  QrCode,
  Zap,
  ShieldCheck,
  Eye,
  Receipt,
  Clock,
  ShoppingBag,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Instant QR Scanning",
    description: "Scan product QR barcodes with your smartphone camera with ultra-low 0.2s latency detection.",
    badge: "0.2s Latency",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Queue-Free Checkout",
    description: "Eliminate long billing counters. Pay online immediately from your digital cart and walk out.",
    badge: "Zero Queues",
    color: "amber",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Payments",
    description: "Razorpay-backed 256-bit encryption supports UPI, Cards, NetBanking, and Instant Refunds.",
    badge: "PCI DSS Level 1",
    color: "emerald",
  },
  {
    icon: Eye,
    title: "Live Product Telemetry",
    description: "View real-time pricing, nutritional data, stock availability, and high-res product photos.",
    badge: "Instant Insights",
    color: "violet",
  },
  {
    icon: Receipt,
    title: "Paperless E-Receipts",
    description: "Automatic digital tax invoices delivered to your order history and email with QR validation.",
    badge: "100% Eco-Friendly",
    color: "rose",
  },
  {
    icon: ShoppingBag,
    title: "Smart Synchronized Cart",
    description: "Manage product quantities effortlessly with real-time subtotal calculation and discounts.",
    badge: "Auto-Sync",
    color: "indigo",
  },
  {
    icon: Clock,
    title: "Lifetime Order Archive",
    description: "Track all your historical shopping sessions, receipts, and itemized spending in one tap.",
    badge: "Instant Search",
    color: "teal",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Store Control",
    description: "Centralized merchant portal for inventory tracking, category management, and sales analytics.",
    badge: "Real-time Metrics",
    color: "sky",
  },
];

const colorMap = {
  blue: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  violet: {
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    iconBg: "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  },
  rose: {
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconBg: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  },
  indigo: {
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  teal: {
    badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    iconBg: "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  },
  sky: {
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    iconBg: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  },
};

export default function Features() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-white dark:bg-[#080d1a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200/80 dark:border-blue-800 mb-4 shadow-xs">
            <Sparkles size={13} className="text-blue-500 animate-pulse" />
            <span>Autonomous Retail Architecture</span>
          </span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineered for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
              Next-Gen Shopping
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Eliminate traditional cash registers and long billing queues with an intelligent self-checkout retail platform.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const themeStyles = colorMap[feature.color];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group relative p-6 sm:p-7 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${themeStyles.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                    >
                      <Icon size={22} />
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${themeStyles.badge}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
