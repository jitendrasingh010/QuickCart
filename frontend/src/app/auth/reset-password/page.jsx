"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import api from "@/lib/axios";
import { useTheme } from "@/hooks/useTheme";

export default function ResetPasswordPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isErrorShake, setIsErrorShake] = useState(false);

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

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const pwd = formData.newPassword;
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
  }, [formData.newPassword]);

  // Passwords match check
  const passwordsMatch = useMemo(() => {
    if (!formData.confirmPassword) return null;
    return formData.newPassword === formData.confirmPassword;
  }, [formData.newPassword, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsErrorShake(false);

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      setIsErrorShake(true);
      setStatus({
        type: "error",
        message: "Please fill in all password fields.",
      });
      setTimeout(() => setIsErrorShake(false), 600);
      return;
    }

    if (newPassword.length < 6) {
      setIsErrorShake(true);
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      setTimeout(() => setIsErrorShake(false), 600);
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsErrorShake(true);
      setStatus({
        type: "error",
        message: "New password and Confirm password do not match.",
      });
      setTimeout(() => setIsErrorShake(false), 600);
      return;
    }

    try {
      setLoading(true);

      let res;
      try {
        res = await api.post("/auth/reset-password", {
          email,
          newPassword,
          confirmPassword,
        });
      } catch (err) {
        res = await api.post("/userapi/reset-password", {
          email,
          newPassword,
          confirmPassword,
        });
      }

      localStorage.removeItem("resetEmail");

      setIsSuccess(true);
      setStatus({
        type: "success",
        message:
          res.data?.message ||
          "Password updated successfully! Redirecting to login...",
      });

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);

    } catch (err) {
      console.error("Reset password error:", err);
      setIsErrorShake(true);
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to reset password. Please try again.",
      });
      setTimeout(() => setIsErrorShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-slate-50/90 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 px-4 py-4 sm:py-6 overflow-x-hidden select-none transition-colors duration-300">
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

      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 45, -35, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/15 dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 45, 0],
            y: [0, 35, -25, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 -right-24 w-[480px] h-[480px] bg-gradient-to-br from-indigo-400/20 via-blue-500/20 to-cyan-400/15 dark:from-indigo-600/15 dark:via-blue-600/15 dark:to-cyan-600/10 rounded-full blur-3xl"
        />

        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute top-[15%] left-[10%] p-3.5 bg-white/75 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/80 dark:border-slate-800 text-blue-600 dark:text-blue-400"
        >
          <Lock size={22} />
        </motion.div>
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: isErrorShake ? [-8, 8, -6, 6, -3, 3, 0] : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[460px] sm:max-w-[480px] bg-white/90 dark:bg-[#111827]/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(37,99,235,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 relative z-10 my-auto"
      >
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 dark:via-blue-400/40 to-transparent" />

        {/* Header with Lock Badge */}
        <div className="text-center mb-4 sm:mb-5">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="relative mb-1.5">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300"
              />
              <div className="relative w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
                <Lock size={20} className="text-white" />
              </div>
            </div>

            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Cart</span>
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-2.5">
            Create New Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Create a new strong password to secure your account
          </p>
        </div>

        {/* Status Alert Banner */}
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              className={`mb-3.5 p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm shadow-sm ${status.type === "success"
                  ? "bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                  : "bg-rose-50/90 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {status.type === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <span className="font-medium leading-relaxed">
                {status.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Password Form */}
        <form onSubmit={handleResetPassword} className="space-y-3.5">
          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative group">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
              />
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Min. 6 characters"
                value={formData.newPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full bg-slate-50/90 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200 outline-none pl-10 pr-10 py-2.5 sm:py-3 shadow-sm"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer transition rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.newPassword && (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Strength:</span>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative group">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full bg-slate-50/90 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium rounded-xl border transition-all duration-200 outline-none pl-10 pr-10 py-2.5 sm:py-3 shadow-sm ${passwordsMatch === false
                    ? "border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                    : passwordsMatch === true
                      ? "border-emerald-300 dark:border-emerald-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  }`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer transition rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Match live label */}
            {passwordsMatch === false && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                Passwords do not match.
              </p>
            )}
            {passwordsMatch === true && (
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check size={13} /> Passwords match!
              </p>
            )}
          </div>

          {/* Security Note */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck size={15} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span>Use at least 6 characters with letters & numbers.</span>
          </div>

          {/* Submit Button */}
          <div className="pt-1.5">
            <motion.button
              type="submit"
              disabled={loading || isSuccess}
              whileHover={!loading && !isSuccess ? { scale: 1.015, y: -1 } : {}}
              whileTap={!loading && !isSuccess ? { scale: 0.98 } : {}}
              className={`w-full relative overflow-hidden text-white font-bold py-3 sm:py-3.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-center gap-2 ${isSuccess
                  ? "bg-emerald-600 shadow-emerald-500/30"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-blue-500/25 hover:shadow-blue-500/40 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                }`}
            >
              <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none" />

              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin text-white" />
                  <span>Updating Password...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={17} className="text-white" />
                  <span>✓ Password Reset! Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Create New Password</span>
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
