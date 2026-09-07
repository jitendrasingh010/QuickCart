"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Mail,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import api from "@/lib/axios";
import { useTheme } from "@/hooks/useTheme";

export default function OtpVerifyPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef([]);

  const [status, setStatus] = useState({
    type: "", // 'success' | 'error'
    message: "",
  });

  // Read saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      router.push("/auth/forget");
    }
  }, [router]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend Countdown Timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit input change
  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const otp = otpDigits.join("");

  // Handle Verify Form Submission
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      setStatus({
        type: "error",
        message: "Please enter the 6-digit OTP code.",
      });
      return;
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      setStatus({
        type: "error",
        message: "OTP must be a complete 6-digit number.",
      });
      return;
    }

    try {
      setLoading(true);

      let res;
      try {
        res = await api.post("/userapi/verify-otp", {
          email,
          otp: trimmedOtp,
        });
      } catch (err) {
        res = await api.post("/auth/verify-otp", {
          email,
          otp: trimmedOtp,
        });
      }

      localStorage.setItem("verifiedOtp", trimmedOtp);

      setStatus({
        type: "success",
        message: res.data?.message || "OTP verified successfully!",
      });

      setTimeout(() => {
        router.push("/auth/reset-password");
      }, 900);

    } catch (err) {
      console.error("OTP verification error:", err);
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Invalid or expired OTP code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP Code
  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);
      setStatus({ type: "", message: "" });

      let res;
      try {
        res = await api.post("/userapi/forgot-password", { email });
      } catch (err) {
        res = await api.post("/auth/forgot-password", { email });
      }

      setStatus({
        type: "success",
        message: res.data?.message || "A fresh OTP has been sent to your email.",
      });
      setCountdown(30);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to resend OTP. Please try again.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-slate-50/90 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 px-4 py-12 overflow-hidden transition-colors duration-300">
      {/* Top Floating Theme & Home Controls */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2.5">
        <Link
          href="/"
          className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-md shadow-slate-200/40 dark:shadow-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5"
        >
          <span>Home</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-amber-400 shadow-md shadow-slate-200/40 dark:shadow-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition cursor-pointer"
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
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-600" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
      {/* Background Soft Glowing Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/15 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/15 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[480px] bg-white/90 dark:bg-[#111827]/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 p-8 sm:p-10 relative z-10"
      >
        {/* Top Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-13 h-13 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200 mb-3">
              <QrCode size={26} className="text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Quick<span className="text-blue-600 dark:text-blue-400">Cart</span>
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">
              Scan • Pay • Skip the Queue
            </span>
          </Link>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-6">
            Verify OTP
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
            Enter the 6-digit verification code sent to
          </p>

          {/* Email Pill Badge */}
          {email && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Mail size={13} className="text-slate-400" />
              <span>{email}</span>
            </div>
          )}
        </div>

        {/* Animated Alert Box */}
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-sm ${status.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {status.type === "success" ? (
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <span className="font-medium text-xs sm:text-sm leading-relaxed">
                {status.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OTP Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 text-center">
              Verification Code
            </label>

            {/* 6 Digit Input Boxes */}
            <div
              className="flex items-center justify-between gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  disabled={loading}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-11 sm:w-12 h-14 text-center text-xl sm:text-2xl font-black rounded-2xl border transition-all duration-200 outline-none bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 ${digit
                    ? "border-blue-600 dark:border-blue-500 ring-4 ring-blue-500/10 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    } disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400`}
                />
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || otp.length !== 6}
            whileHover={!loading && otp.length === 6 ? { scale: 1.01 } : {}}
            whileTap={!loading && otp.length === 6 ? { scale: 0.98 } : {}}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin text-white" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify OTP</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        {/* Resend & Change Email Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Link
            href="/auth/forget"
            className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Change Email</span>
          </Link>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={countdown > 0 || resending}
            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${countdown > 0
              ? "text-slate-400 cursor-not-allowed"
              : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
              }`}
          >
            <RotateCw size={13} className={resending ? "animate-spin" : ""} />
            <span>
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
