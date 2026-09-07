"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Sparkles, CheckCircle2, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Daily Supermarket Shopper",
    location: "Mumbai",
    avatar: "RS",
    content: "QuickCart transformed my grocery shopping completely. I scan items directly from the shelf, pay via UPI in 5 seconds, and walk straight out. No more 20-minute checkout queues!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Retail Store Manager",
    location: "Bengaluru",
    avatar: "PP",
    content: "As a store manager, QuickCart reduced front-desk cashier congestion by over 65%. Shopper satisfaction skyrocketed and inventory tracking is 100% automated.",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Tech Professional & Shopper",
    location: "Delhi NCR",
    avatar: "AV",
    content: "The camera barcode scanner works with zero lag, and Razorpay 1-click settlement is silky smooth. This feels like the future of retail shopping that we actually needed.",
    rating: 5,
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className="text-amber-400 fill-amber-400"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative py-24 sm:py-32 bg-slate-50/70 dark:bg-[#060b18] transition-colors duration-300 overflow-hidden">
      
      {/* Background Ambient Lights */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200/80 dark:border-blue-800 mb-4 shadow-xs">
            <Sparkles size={13} className="text-blue-500 animate-pulse" />
            <span>Customer Testimonials</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Loved by Shoppers Across{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
              Modern Stores
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Real feedback from customers and store managers experiencing zero-queue shopping.
          </p>
        </motion.div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StarRating count={item.rating} />
                  <Quote size={24} className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" />
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* User Profile */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/20">
                  {item.avatar}
                </div>
                
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.name}
                    </h4>
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {item.role} • {item.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
