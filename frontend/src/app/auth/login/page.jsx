"use client";

import { useState, useCallback, useRef, useEffect, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShoppingCart,
  Sparkles,
  Sun,
  Moon,
  Package,
  ShoppingBag,
  Store,
  ShieldCheck,
  Zap,
  Check,
  CreditCard,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import { login, googleLogin } from "@/services/authServices";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useTheme } from "@/hooks/useTheme";

const AmbientBackground = memo(function AmbientBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      <div className="animate-orb-1 absolute -top-40 -left-40 w-[620px] h-[620px] bg-gradient-to-tr from-blue-400/25 via-indigo-400/20 to-purple-400/15 dark:from-blue-600/30 dark:via-indigo-600/25 dark:to-purple-600/20 rounded-full blur-[130px]" />
      <div className="animate-orb-2 absolute -bottom-40 -right-40 w-[680px] h-[680px] bg-gradient-to-br from-indigo-400/25 via-violet-400/20 to-cyan-400/15 dark:from-indigo-600/30 dark:via-violet-600/25 dark:to-cyan-500/20 rounded-full blur-[140px]" />
      <div className="animate-orb-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-blue-400/10 dark:bg-blue-500/15 rounded-full blur-[150px]" />

      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="animate-particle-drift-1 absolute top-[12%] left-[18%] w-2 h-2 bg-blue-400/60 dark:bg-blue-400 rounded-full blur-xs" />
      <div className="animate-particle-drift-2 absolute top-[68%] left-[8%] w-1.5 h-1.5 bg-indigo-400/60 dark:bg-indigo-400 rounded-full blur-xs" />
      <div className="animate-particle-drift-3 absolute top-[22%] right-[16%] w-2 h-2 bg-violet-400/60 dark:bg-violet-400 rounded-full blur-xs" />
      <div className="animate-particle-drift-4 absolute top-[78%] right-[22%] w-1.5 h-1.5 bg-cyan-400/60 dark:bg-cyan-400 rounded-full blur-xs" />
      <div className="animate-particle-drift-5 absolute top-[45%] left-[48%] w-1 h-1 bg-purple-400/60 dark:bg-purple-400 rounded-full blur-xs" />
    </div>
  );
});

// 🧭 Memoized Top Header Controls
const HeaderControls = memo(function HeaderControls({ theme, toggleTheme }) {
  return (
    <header className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40 flex items-center gap-2.5">
      <Link
        href="/"
        className="px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 shadow-md shadow-slate-200/40 dark:shadow-black/40 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-500/50 text-xs font-bold transition-all flex items-center gap-1.5 hover:-translate-y-0.5 group"
      >
        <Store size={14} className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        <span>Home</span>
      </Link>
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-amber-400 shadow-md shadow-slate-200/40 dark:shadow-black/40 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-amber-400/50 hover:scale-105 active:scale-95 transition cursor-pointer"
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
    </header>
  );
});

// 🛒 Memoized Left Column Supermarket Simulation
const StoreSimulation = memo(function StoreSimulation() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left"
    >
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/15 dark:via-indigo-500/15 dark:to-purple-500/15 border border-blue-500/20 dark:border-blue-400/30 backdrop-blur-xl text-[11px] font-bold text-blue-600 dark:text-blue-300 shadow-sm shadow-blue-500/10 dark:shadow-blue-950/50 self-start">
        <Sparkles size={13} className="text-blue-500 dark:text-blue-400 animate-pulse" />
        <span>AI-Powered In-Store Smart Self-Checkout</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Scan, Pay & Walk Out{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
            in Seconds.
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed max-w-lg">
          Experience the next generation of retail shopping. No cashiers, zero waiting lines, and instant digital invoicing.
        </p>
      </div>

      <div className="relative h-64 sm:h-72 w-full rounded-3xl bg-white/70 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/60 dark:to-blue-950/40 border border-slate-200/80 dark:border-slate-800/80 shadow-xl dark:shadow-2xl p-5 sm:p-6 backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2 bg-slate-100/90 dark:bg-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Store size={14} className="text-blue-500 dark:text-blue-400" />
            <span>Smart Shelf Checkpoint #04</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-500/30 px-3 py-1 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <Zap size={12} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
            <span>Queue Free</span>
          </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center my-2">
          <motion.div
            animate={{
              x: [-16, 16, -16],
              y: [0, -3, 0],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 flex flex-col items-center"
          >
            <motion.div
              animate={{
                y: [0, -6, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 relative mb-2"
            >
              <QrCode size={22} className="animate-pulse" />
              <span className="absolute -inset-1 rounded-2xl border border-blue-400/40 animate-ping pointer-events-none opacity-40" />
            </motion.div>

            <div className="w-20 h-16 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-md dark:shadow-xl relative">
              <ShoppingCart size={32} />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-sm">
                3
              </span>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, -14, 0],
              rotate: [0, 8, 0],
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-4 sm:left-6 top-4 sm:top-6 p-2 sm:p-2.5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 backdrop-blur-md shadow-md flex items-center gap-1.5 text-xs font-bold"
          >
            <Package size={16} className="text-indigo-500 dark:text-indigo-400" />
            <span className="text-[11px]">Organic Items</span>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 14, 0],
              rotate: [0, -8, 0],
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-4 sm:right-6 bottom-3 sm:bottom-4 p-2 sm:p-2.5 rounded-2xl bg-purple-50/90 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 backdrop-blur-md shadow-md flex items-center gap-1.5 text-xs font-bold"
          >
            <ShoppingBag size={16} className="text-purple-500 dark:text-purple-400" />
            <span className="text-[11px]">Bag Verified</span>
          </motion.div>

          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-2 right-12 text-blue-500 dark:text-blue-400"
          >
            <Sparkles size={18} />
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-3 text-center">
          <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-800">
            <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fast Scan</span>
            <span className="block text-xs font-black text-blue-600 dark:text-blue-400">0.2s</span>
          </div>
          <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-800">
            <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Checkout</span>
            <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400">Queue-Free</span>
          </div>
          <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-800">
            <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment</span>
            <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">Instant UPI</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {[
          { step: "01", title: "Scan QR", icon: QrCode, desc: "Point & scan barcodes" },
          { step: "02", title: "Smart Cart", icon: ShoppingCart, desc: "Live cart auto sync" },
          { step: "03", title: "Instant Pay", icon: CreditCard, desc: "Razorpay / UPI" },
          { step: "04", title: "Skip Queue", icon: Zap, desc: "Direct walk-out" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70 backdrop-blur-md flex flex-col items-start gap-1 transition hover:border-blue-500/40"
          >
            <div className="flex items-center justify-between w-full">
              <item.icon size={15} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold text-slate-400">{item.step}</span>
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 pt-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400" />
          <span>256-Bit Encrypted Security</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check size={16} className="text-blue-500 dark:text-blue-400" />
          <span>Live In-Store Inventory Sync</span>
        </div>
      </div>
    </motion.div>
  );
});

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successStep, setSuccessStep] = useState(0);
  const [scannedItemsCount, setScannedItemsCount] = useState(0);
  const [isErrorShake, setIsErrorShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  // Timer cleanup on unmount
  const timersRef = useRef([]);
  const addTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const triggerSuccessSequence = useCallback((user, displayName) => {
    setUserName(displayName);
    setIsSuccess(true);
    setSuccessStep(1);

    addTimer(() => setSuccessStep(2), 600);
    addTimer(() => {
      setSuccessStep(3);
      setScannedItemsCount(1);
      addTimer(() => setScannedItemsCount(2), 400);
      addTimer(() => setScannedItemsCount(3), 800);
    }, 1200);

    addTimer(() => setSuccessStep(4), 2300);
    addTimer(() => setSuccessStep(5), 3100);

    addTimer(() => {
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    }, 4200);
  }, [addTimer, router]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsErrorShake(false);

    try {
      setLoading(true);

      const res = await login(formData);
      const user = res?.user;

      if (typeof window !== "undefined" && user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      const displayName = user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "Shopper";

      triggerSuccessSequence(user, displayName);
    } catch (error) {
      console.error("Login failed:", error);
      setIsErrorShake(true);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Something went wrong. Please try again.",
      });
      addTimer(() => setIsErrorShake(false), 600);
    } finally {
      setLoading(false);
    }
  }, [formData, triggerSuccessSequence, addTimer]);

  const handleGoogleLogin = useCallback(async () => {
    setStatus({ type: "", message: "" });
    setIsErrorShake(false);

    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const res = await googleLogin(token);
      const user = res?.user;

      if (typeof window !== "undefined" && user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      const displayName = user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : result.user.displayName || "Shopper";

      triggerSuccessSequence(user, displayName);
    } catch (error) {
      console.error("Google Login failed:", error);
      setIsErrorShake(true);
      const errorMessage =
        error.response?.data?.message ||
        (error.code === "auth/popup-closed-by-user"
          ? "Google sign-in popup was closed."
          : "Google authentication failed. Please try again.");
      setStatus({
        type: "error",
        message: errorMessage,
      });
      addTimer(() => setIsErrorShake(false), 600);
    } finally {
      setGoogleLoading(false);
    }
  }, [triggerSuccessSequence, addTimer]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-slate-50/90 dark:bg-[#060b18] text-slate-900 dark:text-slate-100 px-4 py-8 sm:py-12 overflow-hidden select-none font-sans transition-colors duration-300">
      {/* 🌌 CONTINUOUS FUTURISTIC AMBIENT ANIMATED BACKGROUND (GPU Accelerated & Memoized) */}
      <AmbientBackground />

      {/* 🧭 TOP FLOATING CONTROLS (Home & Dynamic Theme Switcher) */}
      <HeaderControls theme={theme} toggleTheme={toggleTheme} />

      {/* 🌟 MAIN 2-COLUMN CONTAINER */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* 🛒 LEFT COLUMN: SUPERMARKET SELF-CHECKOUT EXPERIENCE (Memoized) */}
        <StoreSimulation />

        {/* 🛡️ RIGHT COLUMN: GLASSMORPHIC LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            x: isErrorShake ? [-10, 10, -8, 8, -4, 4, 0] : 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-6 w-full max-w-[480px] mx-auto relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 dark:from-blue-600/40 dark:via-indigo-600/40 dark:to-purple-600/40 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

          <div className="relative rounded-[28px] bg-white/80 dark:bg-slate-900/85 backdrop-blur-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-9 text-slate-900 dark:text-white transition-colors duration-300">
            <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/80 dark:via-blue-400/80 to-transparent" />

            <div className="text-center mb-6">
              <Link href="/" className="inline-flex flex-col items-center group">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mb-2"
                >
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-300" />
                  <div className="relative w-12 h-12 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200 border border-white/20">
                    <QrCode size={24} className="text-white" />
                  </div>
                </motion.div>

                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">Cart</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Self-Checkout System
                </span>
              </Link>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
                Sign In to Your Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Enter your credentials to access store dashboard
              </p>
            </div>

            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className={`mb-4 p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs sm:text-sm shadow-sm ${status.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-500/50 text-rose-800 dark:text-rose-200"
                    }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {status.type === "success" ? (
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle size={16} className="text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                  <span className="font-medium leading-relaxed">{status.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none pl-10 pr-4 py-3 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/auth/forget"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none pl-10 pr-10 py-3 shadow-inner"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={togglePasswordVisibility}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading || isSuccess}
                  whileHover={!loading && !isSuccess ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!loading && !isSuccess ? { scale: 0.98 } : {}}
                  className={`w-full relative overflow-hidden text-white font-bold py-3.5 rounded-2xl text-sm transition-all duration-200 cursor-pointer shadow-xl flex items-center justify-center gap-2 ${isSuccess
                    ? "bg-emerald-600 shadow-emerald-500/40 border border-emerald-400/50"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-blue-600/30 hover:shadow-blue-600/50 border border-blue-400/30 disabled:opacity-60 disabled:cursor-not-allowed"
                    }`}
                >
                  <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none" />

                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin text-white" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 size={18} className="text-white animate-bounce" />
                      <span>Login Verified ✓</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Store</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                <span className="bg-white/90 dark:bg-slate-900/90 px-3 text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading || isSuccess}
              whileHover={!loading && !googleLoading && !isSuccess ? { scale: 1.01, y: -1 } : {}}
              whileTap={!loading && !googleLoading && !isSuccess ? { scale: 0.99 } : {}}
              className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-slate-500 dark:text-slate-400" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </motion.button>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                New to QuickCart?{" "}
                <Link
                  href="/auth/signup"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors inline-flex items-center gap-1"
                >
                  <span>Create an Account</span>
                  <ArrowUpRight size={14} />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 🎉 CINEMATIC FULL-SCREEN SELF-CHECKOUT SUCCESS OVERLAY */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl px-4 select-none"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="animate-orb-1 absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl" />
              <div className="animate-orb-2 absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
            </div>

            {successStep >= 5 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: `${i * 4 + 2}%`,
                      y: "-10%",
                      opacity: 1,
                      rotate: 0,
                    }}
                    animate={{
                      y: "110%",
                      opacity: [1, 1, 0],
                      rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
                    }}
                    transition={{
                      duration: 2.2 + (i % 5) * 0.3,
                      ease: "easeOut",
                      delay: (i % 6) * 0.08,
                    }}
                    className={`absolute w-2 h-2 rounded-sm ${[
                      "bg-blue-400",
                      "bg-emerald-400",
                      "bg-amber-400",
                      "bg-purple-400",
                      "bg-cyan-400",
                      "bg-pink-400",
                    ][i % 6]
                      }`}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10 text-center max-w-lg w-full bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/60">
              {successStep >= 1 && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 14, stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/40 border border-emerald-300/40 mb-4"
                >
                  <CheckCircle2 size={36} />
                </motion.div>
              )}

              {successStep >= 2 && successStep < 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-4 p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 backdrop-blur-md relative overflow-hidden"
                >
                  <motion.div
                    animate={{ y: [-40, 100, -40] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none"
                  />

                  <div className="flex items-center justify-between text-xs text-blue-300 font-bold mb-3">
                    <div className="flex items-center gap-1.5">
                      <QrCode size={15} className="text-cyan-400 animate-pulse" />
                      <span>Smart Shelf Scanner</span>
                    </div>
                    <span className="text-[11px] bg-blue-900/50 px-2 py-0.5 rounded-md border border-blue-400/30 text-cyan-300 font-mono">
                      {scannedItemsCount}/3 Items Scanned
                    </span>
                  </div>

                  <div className="flex items-center justify-around gap-2 py-2">
                    {[
                      { icon: "🥑", name: "Avocado", count: 1 },
                      { icon: "🥛", name: "Organic Milk", count: 2 },
                      { icon: "🥤", name: "Energy Drink", count: 3 },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0.3, scale: 0.8 }}
                        animate={
                          scannedItemsCount >= item.count
                            ? { opacity: 1, scale: [1, 1.15, 1], y: [0, -4, 0] }
                            : { opacity: 0.3, scale: 0.8 }
                        }
                        transition={{ duration: 0.35 }}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${scannedItemsCount >= item.count
                          ? "bg-blue-950/80 border-cyan-400/60 shadow-lg shadow-cyan-500/20 text-white"
                          : "bg-slate-900/40 border-slate-800 text-slate-500"
                          }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] font-bold">{item.name}</span>
                        {scannedItemsCount >= item.count && (
                          <span className="text-[9px] text-emerald-400 font-black">✓ In Cart</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {successStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-4 py-3 px-6 bg-slate-950/80 rounded-2xl border border-indigo-500/30 backdrop-blur-md flex items-center justify-center gap-4 overflow-hidden relative shadow-lg"
                >
                  <motion.div
                    animate={{ x: [-30, 45] }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative">
                      <ShoppingCart size={28} className="text-blue-400" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                        3
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-indigo-400 animate-pulse" />
                    <div className="p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <Receipt size={14} className="text-emerald-400" />
                      <span>Checkout</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {successStep >= 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2 mt-3"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <Check size={14} className="text-emerald-400" />
                    <span>Payment Verified • Zero Queue</span>
                    <Sparkles size={14} className="text-amber-400 animate-spin" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Welcome Back{userName ? `, ${userName}` : ""}!
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-300/90">
                    Entering QuickCart Smart Self-Checkout Workspace...
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
