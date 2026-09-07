"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Timer,
  Fingerprint,
  Rocket,
  ShieldCheck,
  BarChart3,
  QrCode,
  Sparkles,
  Check,
} from "lucide-react";

const reasons = [
  {
    icon: Timer,
    title: "Zero Queue Waiting",
    description: "Say goodbye to crowded checkout lanes. Scan and pay directly on your personal device.",
    metric: "0s Wait Time",
  },
  {
    icon: Fingerprint,
    title: "100% Contactless Shopping",
    description: "Direct barcode detection and digital payments minimize physical touchpoints entirely.",
    metric: "Pure Digital",
  },
  {
    icon: Rocket,
    title: "Lightning 60s Checkout",
    description: "Scan your entire grocery cart and complete settlement in under a single minute.",
    metric: "< 60s Total",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Encryption",
    description: "Powered by Razorpay payment rails with 256-bit SSL encryption and tokenization.",
    metric: "PCI-DSS Safe",
  },
  {
    icon: BarChart3,
    title: "Instant Digital Receipts",
    description: "View itemized receipts, timestamps, and order history anytime from your shopper dashboard.",
    metric: "Paperless",
  },
  {
    icon: QrCode,
    title: "Smart Barcode AI",
    description: "Proprietary recognition algorithm detects product QR codes even in low-light environments.",
    metric: "99.8% Accuracy",
  },
];

export default function WhyChoose() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-white dark:bg-[#080d1a] transition-colors duration-300">
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
            <span>Competitive Advantage</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Modern Shoppers{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
              Choose QuickCart
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Built specifically to address the #1 complaint in retail shopping: waiting in long billing queues.
          </p>
        </motion.div>

        {/* Reason Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-6 sm:p-7 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                      <Icon size={22} />
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {reason.metric}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {reason.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {reason.description}
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
