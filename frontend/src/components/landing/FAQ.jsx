"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, Sparkles, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "How does QuickCart QR Self-Checkout work?",
    answer:
      "Simply open the QuickCart web application on any smartphone browser, click Scan QR, and aim your camera at the shelf barcode or product QR tag. The item instantly pops into your digital cart. You can adjust quantities, pay securely via Razorpay (UPI, Cards, NetBanking), and walk straight out with zero queueing.",
  },
  {
    question: "Do I need to download a mobile app from App Store / Play Store?",
    answer:
      "No app download is required! QuickCart is a Progressive Web Application (PWA) that runs instantly in Chrome, Safari, or any mobile browser with camera permissions enabled. It offers near-instant camera scanner latency without taking phone storage.",
  },
  {
    question: "How are payments handled and is it secure?",
    answer:
      "All transactions are processed through Razorpay's PCI DSS Level 1 compliant gateway with 256-bit SSL encryption. We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets. QuickCart never stores sensitive financial or card credentials.",
  },
  {
    question: "What happens after I pay? How do I verify my purchase?",
    answer:
      "Upon payment completion, an instant digital tax invoice (E-Receipt) is generated with a cryptographic QR validation code. You can show this receipt at the store exit checkpoint or access it anytime from your 'My Orders' dashboard.",
  },
  {
    question: "Can I manage store products and inventory as an admin?",
    answer:
      "Yes! QuickCart includes a full-featured Admin Control Portal where store owners and merchants can create product categories, manage stock inventory, generate printable QR codes, and monitor live sales telemetry.",
  },
  {
    question: "Is QuickCart free for regular shoppers?",
    answer:
      "Yes, shoppers can create a free QuickCart passport account with zero subscription or registration fees. You only pay for the products you purchase in-store.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all shadow-xs">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 sm:px-7 sm:py-6 text-left cursor-pointer group"
      >
        <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.question}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-blue-600 text-white rotate-180 shadow-md shadow-blue-500/30"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600"
        }`}>
          <ChevronDown size={18} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-white dark:bg-[#080d1a] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200/80 dark:border-blue-800 mb-4 shadow-xs">
            <HelpCircle size={13} className="text-blue-500" />
            <span>Got Questions?</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
              Questions
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about QuickCart Smart Self-Checkout.
          </p>
        </motion.div>

        {/* Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
