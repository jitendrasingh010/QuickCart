"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/services/authServices";
import {
  LayoutDashboard,
  QrCode,
  Package,
  User,
  LogOut,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogout = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      await logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      setShowLogoutModal(false);
      onClose();
      router.replace("/auth/login");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Unable to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const menus = [
    {
      name: "Products",
      href: "/customer",
      icon: LayoutDashboard,
    },
    {
      name: "Scan QR",
      href: "/customer/qrscanner",
      icon: QrCode,
    },
    {
      name: "My Orders",
      href: "/customer/myorder",
      icon: Package,
    },
    {
      name: "Profile",
      href: "/customer/customerProfile",
      icon: User,
    },
  ];

  const SidebarBody = (
    <div className="h-full flex flex-col justify-between select-none">
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link
            href="/customer"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <QrCode size={20} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white leading-none block">
                Quick<span className="text-blue-500">Cart</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 block">
                Shopper Portal
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1.5 mt-2 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Shopping Menu
          </div>

          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                {/* Animated active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="customer-sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon
                  size={18}
                  className={`transition-transform duration-200 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200 group-hover:scale-110"
                  }`}
                />
                <span>{item.name}</span>

                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/80 space-y-2.5">
        <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-300">QuickCart Store</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
            Live
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setErrorMsg("");
            setShowLogoutModal(true);
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 cursor-pointer border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 h-screen flex-shrink-0 bg-slate-900 text-slate-200 border-r border-slate-800 flex-col z-30 sticky top-0 transition-colors duration-300">
        {SidebarBody}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-screen bg-slate-900 text-slate-200 border-r border-slate-800 shadow-2xl flex flex-col"
            >
              {SidebarBody}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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

            {errorMsg && (
              <div className="mb-4 p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!loading) setShowLogoutModal(false);
                }}
                disabled={loading}
                className="flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 disabled:bg-rose-400 rounded-xl shadow-md shadow-rose-500/20 transition cursor-pointer"
              >
                {loading ? (
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