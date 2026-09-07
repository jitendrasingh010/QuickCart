"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  QrCode,
  LogOut,
  ChevronDown,
  AlertCircle,
  Loader2,
  Sparkles,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import api from "@/lib/axios";
import { logout } from "@/services/authServices";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar({ onToggleSidebar = () => {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [customerUser, setCustomerUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const getPageTitle = () => {
    if (pathname === "/customer") return "Product Catalog";
    if (pathname.startsWith("/customer/qrscanner")) return "QR Code Scanner";
    if (pathname.startsWith("/customer/myorder")) return "Order History";
    if (pathname.startsWith("/customer/customerProfile")) return "Customer Profile";
    return "QuickCart Shopping";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setCustomerUser(JSON.parse(stored));
        } catch (e) {
          console.error("Error reading cached user", e);
        }
      }
    }

    const fetchCustomerProfile = async () => {
      try {
        const res = await api.get("/userapi/profile");
        if (res.data?.user) {
          setCustomerUser(res.data.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        }
      } catch (err) {
        // Cached user used as fallback
      }
    };

    fetchCustomerProfile();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      setLogoutError("");

      await logout();

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      setShowLogoutModal(false);
      setIsDropdownOpen(false);
      router.replace("/auth/login");
    } catch (error) {
      setLogoutError(
        error.response?.data?.message || "Unable to sign out. Please try again."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const customerName = customerUser?.firstName
    ? `${customerUser.firstName} ${customerUser.lastName || ""}`.trim()
    : "Shopper";
  const customerEmail = customerUser?.email || "customer@quickcart.com";
  const initial = customerName.charAt(0).toUpperCase() || "C";
  const profileImage = customerUser?.profileImage || customerUser?.image;

  return (
    <>
      <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs transition-colors duration-300">
        {/* Left Side: Hamburger on mobile + Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Sparkles size={13} className="text-blue-500" />
            <span>Smart QR Shopping</span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {getPageTitle()}
          </h2>
        </div>

        {/* Right Side: Theme Toggle & Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Animated Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 active:scale-95 flex items-center justify-center"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -10, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 10, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18 }}
              >
                {theme === "dark" ? (
                  <Sun size={17} className="text-amber-400" />
                ) : (
                  <Moon size={17} className="text-slate-600" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-2.5 sm:gap-3 p-1.5 sm:px-3 rounded-2xl transition-all duration-200 cursor-pointer border ${
                isDropdownOpen
                  ? "bg-slate-100/90 dark:bg-slate-800 border-slate-300/80 dark:border-slate-700 shadow-xs"
                  : "bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              }`}
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 overflow-hidden ring-2 ring-white dark:ring-slate-800"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={customerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </motion.div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {customerName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight max-w-[130px] truncate mt-0.5">
                  {customerEmail}
                </p>
              </div>

              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400"
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200/90 dark:border-slate-800 p-3 z-50 overflow-hidden"
                >
                  <div className="p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/60 dark:to-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-3.5 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/25 overflow-hidden flex-shrink-0">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={customerName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{initial}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate leading-tight">
                        {customerName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                        {customerEmail}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                        Customer Account
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/customer/customerProfile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-slate-800 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-colors">
                        <User size={16} />
                      </div>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/customer/myorder"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-slate-800 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                        <ShoppingBag size={16} />
                      </div>
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href="/customer/qrscanner"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/80 dark:hover:bg-slate-800 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 dark:group-hover:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 flex items-center justify-center transition-colors">
                        <QrCode size={16} />
                      </div>
                      <span>Scan Store QR</span>
                    </Link>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setLogoutError("");
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50/90 dark:hover:bg-rose-950/40 transition-all cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/60 transition-colors">
                        <LogOut size={16} />
                      </div>
                      <span className="font-bold">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150 border border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 mx-auto mb-4 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center shadow-inner">
              <LogOut className="w-7 h-7 translate-x-0.5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Confirm Sign Out</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Are you sure you want to end your shopping session?
            </p>

            {logoutError && (
              <div className="mb-4 p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{logoutError}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!logoutLoading) setShowLogoutModal(false);
                }}
                disabled={logoutLoading}
                className="flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 disabled:bg-rose-400 rounded-xl shadow-md shadow-rose-500/20 transition cursor-pointer"
              >
                {logoutLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <span>Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}