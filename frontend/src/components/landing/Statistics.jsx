"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { Package, ShoppingCart, Users, CheckCircle, Clock, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: 500,
    suffix: "+",
    label: "Catalog Products",
    desc: "AI QR Tagged",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: ShoppingCart,
    value: 1200,
    suffix: "+",
    label: "Orders Processed",
    desc: "100% Queue-Free",
    color: "from-indigo-500 to-violet-400",
  },
  {
    icon: Users,
    value: 850,
    suffix: "+",
    label: "Happy Shoppers",
    desc: "Active Members",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: CheckCircle,
    value: 99,
    suffix: ".9%",
    label: "Payment Success",
    desc: "Razorpay Verified",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "System Availability",
    desc: "Always Online",
    color: "from-amber-500 to-orange-400",
  },
];

export default function Statistics() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="relative py-24 sm:py-32 bg-slate-900 dark:bg-black text-white overflow-hidden transition-colors duration-300">
      
      {/* Background Subtle Radial Grid & Mesh */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-500/20 mb-4 shadow-xs">
            <Sparkles size={13} className="text-blue-400 animate-pulse" />
            <span>Platform Traction</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Shoppers & Retailers
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            Powering fast, frictionless autonomous retail checkout experiences across physical stores.
          </p>
        </motion.div>

        {/* 5-Col Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-6 bg-white/5 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 dark:border-slate-800 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between text-center"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/40 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-white mb-1 font-mono tracking-tight">
                    {inView ? (
                      <CountUp
                        end={stat.value}
                        duration={2.5}
                        separator=","
                      />
                    ) : (
                      0
                    )}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      {stat.suffix}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-200 mb-1">
                    {stat.label}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-400 font-medium pt-3 border-t border-white/10 mt-3">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
