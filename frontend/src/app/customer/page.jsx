"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import {
  Search,
  Filter,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Tag,
  Package,
  QrCode,
  CheckCircle2,
  SlidersHorizontal,
  Star,
  Eye,
  X,
  Layers,
  ArrowRight,
  Zap,
  CreditCard,
  Receipt,
  Store,
  Clock,
  ShieldCheck,
  ShoppingCart,
  Users,
  Check,
  CheckCheck,
} from "lucide-react";

export default function CustomerDashboard() {
  // Products, categories & loading states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [availability, setAvailability] = useState("");

  // Quick View Product Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Continuous Looping Shopping Journey Simulation Stage
  // 0: Customer enters smart supermarket
  // 1: Picks up smart cart & approaches shelf
  // 2: Scans product #1 (🥑 Avocado) -> laser beam glow -> item flies into cart
  // 3: Scans product #2 (🥛 Milk) -> cart count: 2
  // 4: Scans product #3 (🥤 Juice) -> cart count: 3
  // 5: Checkout screen & 1-click payment approved ✓
  // 6: Digital E-Receipt generates -> customer exits store happily
  const [journeyStage, setJourneyStage] = useState(0);

  useEffect(() => {
    const stageDurations = [2400, 2200, 2400, 2000, 2000, 2400, 2600];
    const timer = setTimeout(() => {
      setJourneyStage((prev) => (prev + 1) % stageDurations.length);
    }, stageDurations[journeyStage]);

    return () => clearTimeout(timer);
  }, [journeyStage]);

  // 300ms debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Load category list for dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/categoryapi/categories");
      const data = res.data?.categories || res.data?.category || res.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products from backend with Search, Sort & Category filter
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (sort) params.sort = sort;
      if (category) params.category = category;

      const response = await api.get("/productapi/products", { params });

      const data = response.data?.products || response.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side Price, Availability and Category Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter check
      if (category && category.trim() !== "" && category.toLowerCase() !== "all") {
        const selectedCat = category.trim().toLowerCase();
        const prodCatName = (
          product.Category?.categoryName ||
          product.category?.categoryName ||
          product.categoryName ||
          ""
        ).trim().toLowerCase();
        const prodCatId = String(
          product.categoryId || product.Category?.categoryId || product.category?.categoryId || ""
        );

        const matches =
          prodCatName === selectedCat ||
          prodCatName.includes(selectedCat) ||
          prodCatId === selectedCat;

        if (!matches) return false;
      }

      const price = Number(product.price || 0);
      const stock = Number(product.stock || 0);

      // Price filter check
      if (priceFilter === "under_100" && price >= 100) return false;
      if (priceFilter === "100_500" && (price < 100 || price > 500)) return false;
      if (priceFilter === "500_1000" && (price < 500 || price > 1000)) return false;
      if (priceFilter === "above_1000" && price <= 1000) return false;

      // Availability check
      if (availability === "in_stock" && stock <= 0) return false;
      if (availability === "out_of_stock" && stock > 0) return false;

      return true;
    });
  }, [products, category, priceFilter, availability]);

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setCategory("");
    setPriceFilter("");
    setAvailability("");
  };

  const hasActiveFilters = Boolean(
    search || sort || category || priceFilter || availability
  );

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="w-full flex flex-col space-y-10 max-w-7xl mx-auto pb-20 select-none font-sans">
      {/* ========================================================================= */}
      {/* 🌌 IMMERSIVE HERO SECTION WITH REAL-TIME TELEMETRY                        */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full relative overflow-hidden rounded-[36px] bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-7 sm:p-9 lg:p-10 shadow-2xl shadow-blue-950/30 border border-slate-800/90"
      >
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Technical Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="max-w-2xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-blue-200 shadow-sm">
              <Sparkles size={13} className="text-blue-400 animate-pulse" />
              <span>Autonomous In-Store Supermarket Experience</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                QuickCart Smart Store.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Scan product QR tags directly from store shelves, manage your live digital cart, pay online with 1-click Razorpay UPI, and walk out without cashier queues.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/customer/qrscanner"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white text-sm font-extrabold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 pointer-events-none" />
                <QrCode size={18} className="animate-pulse" />
                <span>Launch Camera Scanner</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/customer/myorder"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-bold border border-white/15 backdrop-blur-md transition hover:-translate-y-0.5"
              >
                <Receipt size={16} />
                <span>View My Receipts</span>
              </Link>
            </div>
          </motion.div>

          {/* Live Store Status & Micro Telemetry Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Store Checkpoint</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Avg Scan Latency</span>
                <span className="text-cyan-300 font-bold">0.2 seconds</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Checkout Waiting</span>
                <span className="text-blue-300 font-bold">0 minutes (Instant)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 🛒 MAIN CONTINUOUS SELF-CHECKOUT SHOPPING JOURNEY ANIMATION (FLAGSHIP)    */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[36px] p-7 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/5 dark:shadow-slate-950/40 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                <Store size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Continuous Self-Checkout Journey Simulation
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visual demonstration of how autonomous QR shopping flows in real time
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-600 dark:text-blue-300 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>Interactive Live Demo</span>
          </div>
        </div>

        {/* Central Stage Canvas */}
        <div className="relative min-h-[220px] rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-950 to-indigo-950/70 border border-blue-500/20 p-6 flex flex-col items-center justify-center text-white overflow-hidden shadow-inner">
          
          {/* Subtle Ambient Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <AnimatePresence mode="wait">
            {/* Stage 0: Customer enters store */}
            {journeyStage === 0 && (
              <motion.div
                key="stage-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-3"
              >
                <div className="text-5xl animate-bounce">🚶‍♂️🛒</div>
                <div className="px-4 py-2 bg-blue-600/30 border border-blue-400/40 rounded-2xl text-xs sm:text-sm font-bold text-blue-200 backdrop-blur-md">
                  Step 1: Shopper enters Smart Supermarket & takes shopping cart
                </div>
              </motion.div>
            )}

            {/* Stage 1: Moving Cart */}
            {journeyStage === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-3"
              >
                <div className="text-5xl">🛒 ➡️ 🏪</div>
                <div className="px-4 py-2 bg-indigo-600/30 border border-indigo-400/40 rounded-2xl text-xs sm:text-sm font-bold text-indigo-200 backdrop-blur-md">
                  Step 2: Shopper browses aisles with smart digital cart
                </div>
              </motion.div>
            )}

            {/* Stage 2: Scanning Product #1 */}
            {journeyStage === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center space-y-3"
              >
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-400 text-cyan-300 flex items-center gap-3 shadow-lg shadow-cyan-500/20">
                  <QrCode size={26} className="animate-pulse text-cyan-400" />
                  <div className="text-left">
                    <span className="block text-[10px] font-mono text-cyan-400">QR SCAN DETECTED (0.2s)</span>
                    <span className="block text-sm font-black text-white">🥑 Fresh Hass Avocado</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg">₹49</span>
                </div>
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 animate-pulse">
                  <span>Product smoothly glides into digital cart</span>
                  <ArrowRight size={13} />
                </span>
              </motion.div>
            )}

            {/* Stage 3 & 4: Cart filling with multiple items */}
            {(journeyStage === 3 || journeyStage === 4) && (
              <motion.div
                key="stage-3-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md space-y-3"
              >
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700 shadow-xl">
                  <div className="flex items-center justify-between text-xs font-bold mb-2.5">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <ShoppingCart size={16} />
                      Live Digital Cart
                    </span>
                    <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono">
                      {journeyStage === 3 ? "2 Items (₹129)" : "3 Items (₹199)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                      <span className="text-xl">🥑</span>
                      <span className="block text-[10px] font-bold mt-0.5">Avocado</span>
                    </div>
                    <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                      <span className="text-xl">🥛</span>
                      <span className="block text-[10px] font-bold mt-0.5">Milk</span>
                    </div>
                    <div className={`p-2 rounded-xl border transition-all ${
                      journeyStage === 4
                        ? "bg-slate-800 border-cyan-400 text-white"
                        : "opacity-40 border-dashed border-slate-700"
                    }`}>
                      <span className="text-xl">🥤</span>
                      <span className="block text-[10px] font-bold mt-0.5">Juice</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage 5: Payment Approved */}
            {journeyStage === 5 && (
              <motion.div
                key="stage-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-400/60 text-center space-y-2 shadow-2xl"
              >
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <Check size={24} className="stroke-[3]" />
                </div>
                <h3 className="text-base font-black text-emerald-300">
                  Payment Approved • ₹199.00
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  Razorpay UPI Instant Settlement ✓
                </p>
              </motion.div>
            )}

            {/* Stage 6: Digital Receipt & Exit */}
            {journeyStage === 6 && (
              <motion.div
                key="stage-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-400/50 text-center space-y-2"
              >
                <div className="flex items-center justify-center gap-2 text-indigo-300 font-bold text-xs">
                  <Receipt size={16} />
                  <span>Digital Invoice Dispatched</span>
                </div>
                <p className="text-xs font-bold text-slate-200">
                  Shopper walks right out with zero queue waiting! 🛍️✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Sequence Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-7 gap-1.5 text-center">
          {["Enter", "Take Cart", "Scan #1", "Scan #2", "Cart Full", "1-Tap Pay", "Walk Out"].map((label, idx) => (
            <div
              key={idx}
              className={`py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                journeyStage === idx
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* ⚡ 5 PREMIUM FEATURE HIGHLIGHT CARDS                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            icon: QrCode,
            title: "Instant QR Scan",
            badge: "0.2s Latency",
            desc: "Point camera at shelf tag",
            color: "from-blue-600 to-cyan-500",
          },
          {
            icon: ShoppingCart,
            title: "Smart Sync Cart",
            badge: "Live Subtotal",
            desc: "Auto-calculated prices",
            color: "from-indigo-600 to-purple-500",
          },
          {
            icon: CreditCard,
            title: "1-Click UPI Pay",
            badge: "Razorpay Safe",
            desc: "Instant digital settlement",
            color: "from-purple-600 to-pink-500",
          },
          {
            icon: Receipt,
            title: "Digital E-Receipt",
            badge: "Paperless",
            desc: "Saved in your dashboard",
            color: "from-emerald-600 to-teal-500",
          },
          {
            icon: Zap,
            title: "Zero Waiting",
            badge: "100% Free",
            desc: "Skip cashier lines forever",
            color: "from-amber-500 to-orange-500",
          },
        ].map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="group p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[26px] border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 🔍 SEARCH & ADVANCED FILTER CONTROLS                                       */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 space-y-4">
        {/* Search Bar Input */}
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search catalog by product title, brand, or aisle keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 outline-none pl-11 pr-10 py-3 transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* 4 Refined Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Filter 1: Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15 outline-none px-3.5 py-2.5 transition cursor-pointer appearance-none"
            >
              <option value="">Aisle Category: All</option>
              {categories.map((cat) => (
                <option
                  key={cat.categoryId || cat._id || cat.id}
                  value={cat.categoryName || cat.name}
                >
                  {cat.categoryName || cat.name}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </span>
          </div>

          {/* Filter 2: Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15 outline-none px-3.5 py-2.5 transition cursor-pointer appearance-none"
            >
              <option value="">Sort: Featured</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
              <option value="newest">Newest Added</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </span>
          </div>

          {/* Filter 3: Price Range */}
          <div className="relative">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15 outline-none px-3.5 py-2.5 transition cursor-pointer appearance-none"
            >
              <option value="">Price: All</option>
              <option value="under_100">Under ₹100</option>
              <option value="100_500">₹100 - ₹500</option>
              <option value="500_1000">₹500 - ₹1,000</option>
              <option value="above_1000">Above ₹1,000</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </span>
          </div>

          {/* Filter 4: Availability */}
          <div className="relative">
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15 outline-none px-3.5 py-2.5 transition cursor-pointer appearance-none"
            >
              <option value="">Availability: All</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              ▼
            </span>
          </div>
        </div>

        {/* Active Filter Pill Row */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> matching store products
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="w-full p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchProducts}
            className="font-bold underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📦 IN-STORE CATALOG PRODUCTS GRID (LUXURY GLASS CARDS)                     */}
      {/* ========================================================================= */}
      <div className="relative z-0 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden p-4 space-y-3 animate-pulse"
              >
                <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2" />
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3 pt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Products Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              {hasActiveFilters
                ? "No items match your active search filters. Try adjusting your search keywords or price filter."
                : "Store products will appear here once added to the catalog."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => {
              const categoryName =
                product.Category?.categoryName ||
                product.category?.categoryName ||
                product.categoryName ||
                "General";
              const imageUrl = product.productImage || product.image;
              const inStock = Number(product.stock || 0) > 0;

              return (
                <motion.div
                  key={product.productId || product._id || product.id}
                  variants={{ hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 overflow-hidden flex flex-col justify-between group transition-all duration-300"
                >
                  {/* Top Image Canvas */}
                  <div className="relative h-48 sm:h-52 bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-900 dark:to-slate-800/70 p-4 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.productName || "Product"}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1">
                        <Package size={32} />
                        <span className="text-[11px] font-medium">No Image</span>
                      </div>
                    )}

                    {/* Top Badges: Category & Stock */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-white/60 dark:border-slate-700 flex items-center gap-1">
                        <Tag size={10} />
                        <span>{categoryName}</span>
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-2xs backdrop-blur-md border ${
                          inStock
                            ? "bg-emerald-50/95 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60"
                            : "bg-rose-50/95 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60"
                        }`}
                      >
                        {inStock ? `✓ In Stock` : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating & Stock Counter */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-1">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star size={12} fill="currentColor" />
                          <span>4.9</span>
                          <span className="text-slate-400 dark:text-slate-500 font-normal">(AI Verified)</span>
                        </div>
                        <span className="font-semibold text-slate-500 dark:text-slate-400">
                          {inStock ? `${product.stock} units left` : "0 in stock"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.productName || product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.description || "Available for immediate smart QR checkout in store."}
                      </p>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                            Store Price
                          </span>
                          <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                            ₹{Number(product.price || 0).toLocaleString()}
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/40">
                          QR Instant Pay
                        </span>
                      </div>

                      {/* 2 Modern Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(product)}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>

                        <Link
                          href="/customer/qrscanner"
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer"
                        >
                          <QrCode size={13} />
                          <span>Scan QR</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🔍 PRODUCT QUICK DETAILS MODAL                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.18 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Package size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Product Overview
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">In-Store QR item</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="h-52 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                  {selectedProduct.productImage || selectedProduct.image ? (
                    <img
                      src={selectedProduct.productImage || selectedProduct.image}
                      alt={selectedProduct.productName}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Package size={42} className="text-slate-300 dark:text-slate-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                      {selectedProduct.Category?.categoryName ||
                        selectedProduct.category?.categoryName ||
                        selectedProduct.categoryName ||
                        "General"}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        Number(selectedProduct.stock || 0) > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {Number(selectedProduct.stock || 0) > 0
                        ? `✓ In Stock (${selectedProduct.stock} units)`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {selectedProduct.productName}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {selectedProduct.description || "No description provided."}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                      Price
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      ₹{Number(selectedProduct.price || 0).toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href="/customer/qrscanner"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition cursor-pointer"
                  >
                    <QrCode size={15} />
                    <span>Scan in Store</span>
                  </Link>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}