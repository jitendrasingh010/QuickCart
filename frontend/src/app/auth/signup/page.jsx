"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Camera,
  ShieldCheck,
  Sun,
  Moon,
  ShoppingCart,
  Package,
  ShoppingBag,
  Store,
  CreditCard,
  Receipt,
  Zap,
  Sparkles,
  Check,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { signup } from "@/services/authServices";
import { useTheme } from "@/hooks/useTheme";

export default function Signup() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // successStep: 0=idle, 1=profile generated, 2=qr membership badge, 3=cart & products scanning, 4=cart rolls to checkout, 5=payment verified & welcome
  const [successStep, setSuccessStep] = useState(0);
  const [isErrorShake, setIsErrorShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [status, setStatus] = useState({
    type: "", // 'success' | 'error'
    message: "",
  });

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: "", color: "" };

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatus({
          type: "error",
          message: "Profile image size must be under 2MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsErrorShake(false);

    if (formData.password.length < 6) {
      setIsErrorShake(true);
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      setTimeout(() => setIsErrorShake(false), 600);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        role: "customer", // Enforce customer role for public signup
      };

      const res = await signup(payload);

      // =========================================================================
      // 🎉 CINEMATIC MEMBERSHIP & ONBOARDING SEQUENCE (Non-blocking)
      // =========================================================================
      setIsSuccess(true);
      setSuccessStep(1); // Step 1: Profile generated & success banner

      // Step 2: QR Membership Card generated
      setTimeout(() => {
        setSuccessStep(2);
      }, 800);

      // Step 3: Shopping cart appears + products automatically enter cart
      setTimeout(() => {
        setSuccessStep(3);
      }, 1600);

      // Step 4: Cart rolls toward checkout
      setTimeout(() => {
        setSuccessStep(4);
      }, 2500);

      // Step 5: Payment verified ✓ + Confetti + "Welcome to QuickCart"
      setTimeout(() => {
        setSuccessStep(5);
      }, 3200);

      // Step 6: Existing redirect flow to login
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 4300);

    } catch (error) {
      console.error("Signup error:", error);
      setIsErrorShake(true);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Registration failed. Please try again.",
      });
      setTimeout(() => setIsErrorShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-slate-50/90 dark:bg-[#060b18] text-slate-900 dark:text-slate-100 px-4 py-8 sm:py-12 overflow-x-hidden select-none font-sans transition-colors duration-300">

      {/* ========================================================================= */}
      {/* 🌌 CONTINUOUS FUTURISTIC AMBIENT ANIMATED BACKGROUND                     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Glowing Ambient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.25, 0.95, 1],
            x: [0, 60, -40, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[620px] h-[620px] bg-gradient-to-tr from-blue-400/25 via-indigo-400/20 to-purple-400/15 dark:from-blue-600/30 dark:via-indigo-600/25 dark:to-purple-600/20 rounded-full blur-[130px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 0.9, 1],
            x: [0, -50, 50, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[680px] h-[680px] bg-gradient-to-br from-indigo-400/25 via-violet-400/20 to-cyan-400/15 dark:from-indigo-600/30 dark:via-violet-600/25 dark:to-cyan-500/20 rounded-full blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.28, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-blue-400/10 dark:bg-blue-500/15 rounded-full blur-[150px]"
        />

        {/* Subtle Futuristic Isometric Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient Micro Particle Stars */}
        {[
          { top: "15%", left: "12%", size: "w-2 h-2", color: "bg-blue-400/60 dark:bg-blue-400", duration: 7 },
          { top: "72%", left: "8%", size: "w-1.5 h-1.5", color: "bg-indigo-400/60 dark:bg-indigo-400", duration: 9 },
          { top: "25%", right: "14%", size: "w-2 h-2", color: "bg-violet-400/60 dark:bg-violet-400", duration: 8 },
          { top: "82%", right: "20%", size: "w-1.5 h-1.5", color: "bg-cyan-400/60 dark:bg-cyan-400", duration: 6 },
          { top: "40%", left: "52%", size: "w-1 h-1", color: "bg-purple-400/60 dark:bg-purple-400", duration: 10 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -35, 0],
              opacity: [0.2, 0.9, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute ${particle.top} ${particle.left || ""} ${particle.right || ""} ${particle.size} ${particle.color} rounded-full blur-xs`}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 🧭 TOP FLOATING CONTROLS (Home & Dynamic Theme Switcher)                   */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 🌟 MAIN 2-COLUMN CONTAINER                                                */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* ─────────────────────────────────────────────────────────────────────── */}
        {/* 🛒 LEFT COLUMN: FUTURISTIC SHOPPING ECOSYSTEM & KIOSK (6 Cols)          */}
        {/* ─────────────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left"
        >
          {/* QuickCart Membership Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/15 dark:via-indigo-500/15 dark:to-purple-500/15 border border-blue-500/20 dark:border-blue-400/30 backdrop-blur-xl text-[11px] font-bold text-blue-600 dark:text-blue-300 shadow-sm shadow-blue-500/10 dark:shadow-blue-950/50 self-start">
            <Sparkles size={13} className="text-blue-500 dark:text-blue-400 animate-pulse" />
            <span>Join QuickCart Smart Shopper Ecosystem</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
          </div>

          {/* Headline & Value Proposition */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              The Future of Retail{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                Starts with You.
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed max-w-lg">
              Create your QuickCart digital shopper passport. Scan product QR codes directly from aisles, add items, and skip checkout lines forever.
            </p>
          </div>

          {/* 🏪 Interactive Smart Store Kiosk Simulation Canvas */}
          <div className="relative h-64 sm:h-72 w-full rounded-3xl bg-white/70 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/60 dark:to-blue-950/40 border border-slate-200/80 dark:border-slate-800/80 shadow-xl dark:shadow-2xl p-5 sm:p-6 backdrop-blur-2xl overflow-hidden flex flex-col justify-between">
            {/* Background Shelf Glows */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Scene Bar: Kiosk Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-100/90 dark:bg-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Store size={14} className="text-blue-500 dark:text-blue-400" />
                <span>Smart Store Node #108</span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-500/30 px-3 py-1 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <Zap size={12} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
                <span>Instant Auto-Billing</span>
              </div>
            </div>

            {/* 🛒 Center Stage: Moving Shopping Cart + Products + Holographic Card */}
            <div className="relative flex-1 flex items-center justify-center my-2">
              {/* Rolling Shopping Cart */}
              <motion.div
                animate={{
                  x: [-16, 16, -16],
                  y: [0, -3, 0],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 flex flex-col items-center"
              >
                {/* Floating QR Laser Checkpoint above Cart */}
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

                {/* Shopping Cart Body */}
                <div className="w-20 h-16 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-md dark:shadow-xl relative">
                  <ShoppingCart size={32} />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-sm">
                    3
                  </span>
                </div>
              </motion.div>

              {/* Floating Product Box */}
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

              {/* Floating Payment Card */}
              <motion.div
                animate={{
                  y: [0, 14, 0],
                  rotate: [0, -8, 0],
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-4 sm:right-6 bottom-3 sm:bottom-4 p-2 sm:p-2.5 rounded-2xl bg-purple-50/90 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 backdrop-blur-md shadow-md flex items-center gap-1.5 text-xs font-bold"
              >
                <CreditCard size={16} className="text-purple-500 dark:text-purple-400" />
                <span className="text-[11px]">1-Tap Payment</span>
              </motion.div>

              {/* Sparkle Badges */}
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

            {/* Bottom Scene Bar: Instant Telemetry */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-3 text-center">
              <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-800">
                <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Checkout</span>
                <span className="block text-xs font-black text-blue-600 dark:text-blue-400">0s Queue</span>
              </div>
              <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-800">
                <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passport</span>
                <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400">QR Member</span>
              </div>
              <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-800">
                <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoicing</span>
                <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">100% Digital</span>
              </div>
            </div>
          </div>

          {/* Benefits Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { title: "Fast Checkout", icon: Zap, desc: "0.2s instant scan" },
              { title: "QR Shopping", icon: QrCode, desc: "Phone is your cart" },
              { title: "Secure Pay", icon: CreditCard, desc: "Razorpay / UPI" },
              { title: "Digital Receipt", icon: Receipt, desc: "Instant e-invoice" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70 backdrop-blur-md flex flex-col items-start gap-1 transition hover:border-blue-500/40"
              >
                <div className="flex items-center justify-between w-full">
                  <item.icon size={15} className="text-blue-600 dark:text-blue-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Customer Trust Badges */}
          <div className="flex items-center gap-6 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={16} className="text-blue-500 dark:text-blue-400" />
              <span>Free Lifetime Membership</span>
            </div>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────────────── */}
        {/* 🛡️ RIGHT COLUMN: GLASSMORPHIC SIGN UP CARD (6 Cols)                    */}
        {/* ─────────────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            x: isErrorShake ? [-10, 10, -8, 8, -4, 4, 0] : 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-6 w-full max-w-[520px] mx-auto relative"
        >
          {/* Card Gradient Aura Glow Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 dark:from-blue-600/40 dark:via-indigo-600/40 dark:to-purple-600/40 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

          {/* Main Glass Card Container */}
          <div className="relative rounded-[28px] bg-white/80 dark:bg-slate-900/85 backdrop-blur-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-8 text-slate-900 dark:text-white transition-colors duration-300">

            {/* Top Accent Light Highlight */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/80 dark:via-blue-400/80 to-transparent" />

            {/* Animated Logo & Header */}
            <div className="text-center mb-4">
              <Link href="/" className="inline-flex flex-col items-center group">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mb-2"
                >
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-300" />
                  <div className="relative w-11 h-11 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200 border border-white/20">
                    <QrCode size={22} className="text-white" />
                  </div>
                </motion.div>

                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">Cart</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Self-Checkout System
                </span>
              </Link>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-3">
                Create Your QuickCart Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                Start your seamless self-checkout journey today
              </p>
            </div>

            {/* Status Alert Banner */}
            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className={`mb-3.5 p-3 rounded-2xl border flex items-start gap-2.5 text-xs sm:text-sm shadow-sm ${status.type === "success"
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

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Optional Profile Photo Pill */}
              <div className="flex items-center justify-center mb-1">
                <label className="relative group cursor-pointer flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={14} />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                      {avatarPreview ? "Photo Added ✓" : "Upload Photo"}
                    </span>
                    <span className="block text-[10px] text-slate-400">Optional</span>
                  </div>
                </label>
              </div>

              {/* First Name & Last Name in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <div className="relative group">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
                    />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      autoComplete="given-name"
                      className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none pl-10 pr-3.5 py-2.5 sm:py-3 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <div className="relative group">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      autoComplete="family-name"
                      className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none pl-10 pr-3.5 py-2.5 sm:py-3 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none pl-10 pr-3.5 py-2.5 sm:py-3 shadow-inner"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none pl-10 pr-3.5 py-2.5 sm:py-3 shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none pl-10 pr-10 py-2.5 sm:py-3 shadow-inner"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Security Strength:</span>
                      <span className={`font-bold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`rounded-full transition-all duration-300 ${level <= passwordStrength.score ? passwordStrength.color : "bg-slate-200 dark:bg-slate-700"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA Button */}
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
                  {/* Shimmer Sweep Light Beam */}
                  <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none" />

                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin text-white" />
                      <span>Creating QuickCart Passport...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 size={18} className="text-white animate-bounce" />
                      <span>Account Created ✓</span>
                    </>
                  ) : (
                    <>
                      <span>Join QuickCart Ecosystem</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Footer Navigation */}
            <div className="mt-5 pt-3.5 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Already registered?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors inline-flex items-center gap-1"
                >
                  <span>Sign In to Account</span>
                  <ArrowUpRight size={14} />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 🎉 CINEMATIC MEMBERSHIP & ONBOARDING SUCCESS OVERLAY                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl px-4 select-none"
          >
            {/* Ambient Background Light Mesh */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
              />
            </div>

            {/* Light Confetti on Step 5 */}
            {successStep >= 5 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: `${(i * 4) + 2}%`,
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

            {/* Onboarding Stage Card */}
            <div className="relative z-10 text-center max-w-lg w-full bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/60">

              {/* Step 1: User Profile & Generated Passport Badge */}
              {successStep >= 1 && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 14, stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/40 border border-emerald-300/40 mb-3"
                >
                  <CheckCircle2 size={36} />
                </motion.div>
              )}

              {/* Step 2: Holographic QR Membership Card */}
              {successStep >= 2 && successStep < 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-3 p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950/60 to-slate-950 border border-blue-500/40 backdrop-blur-md relative overflow-hidden shadow-xl"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-cyan-300">
                        <Award size={18} />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-black text-white">QuickCart Passport</span>
                        <span className="block text-[10px] text-cyan-300 font-mono">ID: QC-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white text-slate-900 shadow-md">
                      <QrCode size={24} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                    <span>Member: <strong className="text-white">{formData.firstName} {formData.lastName}</strong></span>
                    <span className="text-emerald-400 font-bold">✓ Active</span>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Shopping Cart & Products Auto Enter */}
              {successStep >= 3 && successStep < 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="my-2 p-3 rounded-2xl bg-slate-950/60 border border-cyan-500/30 flex items-center justify-around gap-2"
                >
                  <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold">
                    <ShoppingCart size={16} className="text-blue-400" />
                    <span>Cart Ready</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <div className="flex items-center gap-1 text-xs text-emerald-300 font-bold">
                    <span>🥑 🥛 🥤 Auto Synced</span>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Cart Rolls Toward Checkout */}
              {successStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-3 py-3 px-6 bg-slate-950/80 rounded-2xl border border-indigo-500/30 backdrop-blur-md flex items-center justify-center gap-4 overflow-hidden relative shadow-lg"
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

              {/* Step 5: Payment Verified ✓ & Welcome to QuickCart */}
              {successStep >= 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2 mt-2"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <Check size={14} className="text-emerald-400" />
                    <span>Passport Verified • Ready to Shop</span>
                    <Sparkles size={14} className="text-amber-400 animate-spin" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Welcome to QuickCart!
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-300/90">
                    Account created successfully. Redirecting to login...
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