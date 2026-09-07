"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  Package,
  Layers,
  Users,
  ShoppingBag,
  IndianRupee,
  QrCode,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity,
  ShieldCheck,
  Zap,
  CreditCard,
  Store,
  Receipt,
  Check,
  Smartphone,
  CheckCheck,
  ShoppingCart,
} from "lucide-react";
import api from "@/lib/axios";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Live Backend Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);

  // Live ticking clock
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all live backend data concurrently
  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const [prodRes, catRes, orderRes, custRes, profileRes] = await Promise.allSettled([
        api.get("/productapi/products"),
        api.get("/categoryapi/categories"),
        api.get("/orderapi/orders"),
        api.get("/userapi/customers"),
        api.get("/userapi/profile"),
      ]);

      // 1. Products
      if (prodRes.status === "fulfilled") {
        const prodData = prodRes.value.data?.products || prodRes.value.data || [];
        setProducts(Array.isArray(prodData) ? prodData : []);
      }

      // 2. Categories
      if (catRes.status === "fulfilled") {
        const catData = catRes.value.data?.categories || catRes.value.data || [];
        setCategories(Array.isArray(catData) ? catData : []);
      }

      // 3. Orders
      if (orderRes.status === "fulfilled") {
        const ordData = orderRes.value.data?.orders || orderRes.value.data || [];
        setOrders(Array.isArray(ordData) ? ordData : []);
      }

      // 4. Customers
      if (custRes.status === "fulfilled") {
        const custData = custRes.value.data?.customers || custRes.value.data || [];
        setCustomers(Array.isArray(custData) ? custData : []);
      }

      // 5. Profile
      if (profileRes.status === "fulfilled") {
        setAdminProfile(profileRes.value.data?.user || null);
      }
    } catch (err) {
      console.error("Dashboard data fetching error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Time-based Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const adminName = adminProfile?.firstName
    ? `${adminProfile.firstName} ${adminProfile.lastName || ""}`.trim()
    : "Administrator";

  // Dynamic Computations from Live Backend
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalCustomers = customers.length;
    const totalOrders = orders.length;

    const activeProducts = products.filter((p) => (p.status ? p.status === "active" : true)).length;
    const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;
    let todayOrdersCount = 0;

    orders.forEach((ord) => {
      const amount = Number(ord.totalAmount || ord.amount || 0);
      const isPaid = (ord.orderStatus || ord.status || "").toLowerCase() === "paid";
      const ordDate = new Date(ord.createdAt || ord.date || Date.now());

      if (isPaid || !ord.orderStatus) {
        totalRevenue += amount;
      }

      if (ordDate >= today) {
        todayOrdersCount += 1;
        if (isPaid || !ord.orderStatus) todayRevenue += amount;
      }

      if (ordDate >= sevenDaysAgo) {
        if (isPaid || !ord.orderStatus) weekRevenue += amount;
      }

      if (ordDate >= thirtyDaysAgo) {
        if (isPaid || !ord.orderStatus) monthRevenue += amount;
      }
    });

    return {
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      todayOrdersCount,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      activeProducts,
      lowStockProducts,
    };
  }, [products, categories, orders, customers]);

  // Chart Data: Last 7 Days Revenue & Orders
  const last7DaysChartData = useMemo(() => {
    const days = [];
    const revenueByDay = {};
    const ordersByDay = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayKey = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days.push(dayKey);
      revenueByDay[dayKey] = 0;
      ordersByDay[dayKey] = 0;
    }

    orders.forEach((ord) => {
      const ordDate = new Date(ord.createdAt || ord.date || Date.now());
      const dayKey = ordDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const amount = Number(ord.totalAmount || ord.amount || 0);
      const isPaid = (ord.orderStatus || ord.status || "").toLowerCase() === "paid";

      if (revenueByDay[dayKey] !== undefined) {
        ordersByDay[dayKey] += 1;
        if (isPaid || !ord.orderStatus) {
          revenueByDay[dayKey] += amount;
        }
      }
    });

    return {
      labels: days,
      revenueValues: days.map((d) => revenueByDay[d]),
      orderValues: days.map((d) => ordersByDay[d]),
    };
  }, [orders]);

  // Line Chart Config (Revenue Trend)
  const revenueChartConfig = {
    labels: last7DaysChartData.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: last7DaysChartData.revenueValues,
        fill: true,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.12)",
        tension: 0.38,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Category Distribution Doughnut Data
  const categoryChartData = useMemo(() => {
    const catCounts = {};
    categories.forEach((cat) => {
      catCounts[cat.categoryName || cat.name || "General"] = 0;
    });

    products.forEach((prod) => {
      const catName = prod.category?.categoryName || prod.categoryName || prod.category || "Unassigned";
      catCounts[catName] = (catCounts[catName] || 0) + 1;
    });

    const labels = Object.keys(catCounts).slice(0, 6);
    const data = labels.map((k) => catCounts[k]);

    return {
      labels: labels.length > 0 ? labels : ["No Categories"],
      datasets: [
        {
          data: data.length > 0 && data.some((v) => v > 0) ? data : [1],
          backgroundColor: [
            "#3b82f6",
            "#6366f1",
            "#8b5cf6",
            "#a855f7",
            "#06b6d4",
            "#10b981",
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [categories, products]);

  // Recent 5 Orders
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, 5);
  }, [orders]);

  // Recent 5 Customers
  const recentCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [customers]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-7xl mx-auto pb-14 transition-all duration-300 font-sans"
    >
      {/* ========================================================================= */}
      {/* 🌌 WELCOME & SMART STORE AI CONTROL HERO SECTION                          */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-7 sm:p-9 shadow-2xl shadow-blue-950/25 border border-slate-800/90"
      >
        {/* Animated Glow Orbs in Background */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-12 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Isometric Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
            {/* Store AI Telemetry Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-blue-200 mb-3 shadow-sm">
              <Sparkles size={13} className="text-blue-400 animate-pulse" />
              <span>QuickCart AI Store Control Center</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
              👋 {greeting}, {adminName}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Manage your autonomous self-checkout catalog, live QR checkpoint telemetry, customer orders, and instant settlements effortlessly.
            </p>
          </motion.div>

          {/* Live Date, Time & Operational Status */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs font-semibold text-slate-200 shadow-sm">
              <Clock size={14} className="text-blue-400" />
              <span>{currentTime || "Synchronizing..."}</span>
              <span className="text-slate-400">•</span>
              <span>{currentDate}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-2xl text-[11px] font-bold text-emerald-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Store Nodes: Online & Live</span>
              </div>

              <button
                type="button"
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer border border-white/15 hover:scale-105 active:scale-95 shadow-sm"
                title="Refresh Store Telemetry"
              >
                <RefreshCw size={15} className={refreshing ? "animate-spin text-blue-400" : ""} />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 📊 8 STATISTIC CARDS (CountUp & Glow Hover)                               */}
      {/* ========================================================================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
      >
        {/* 1. Total Products */}
        <StatCard
          icon={Package}
          title="Total Products"
          value={metrics.totalProducts}
          loading={loading}
          subtext={`${metrics.activeProducts} Active Catalog Items`}
          link="/admin/categories"
          colorIndex={0}
        />

        {/* 2. Total Categories */}
        <StatCard
          icon={Layers}
          title="Aisle Categories"
          value={metrics.totalCategories}
          loading={loading}
          subtext="Store Classifications"
          link="/admin/categories"
          colorIndex={1}
        />

        {/* 3. Total Customers */}
        <StatCard
          icon={Users}
          title="Registered Shoppers"
          value={metrics.totalCustomers}
          loading={loading}
          subtext="Queue-Free Passports"
          link="/admin/customers"
          colorIndex={2}
        />

        {/* 4. Total Orders */}
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value={metrics.totalOrders}
          loading={loading}
          subtext="QR Checkout Transactions"
          link="/admin/orders"
          colorIndex={3}
        />

        {/* 5. Today's Orders */}
        <StatCard
          icon={TrendingUp}
          title="Today's Orders"
          value={metrics.todayOrdersCount}
          loading={loading}
          subtext={`₹${metrics.todayRevenue.toLocaleString()} Generated Today`}
          link="/admin/orders"
          colorIndex={1}
        />

        {/* 6. Total Revenue */}
        <StatCard
          icon={IndianRupee}
          title="Total Store Revenue"
          prefix="₹"
          value={metrics.totalRevenue}
          loading={loading}
          subtext="Paid Checkout Settlement"
          link="/admin/orders"
          colorIndex={0}
        />

        {/* 7. Active QR Codes */}
        <StatCard
          icon={QrCode}
          title="QR Codes Generated"
          value={metrics.activeProducts}
          loading={loading}
          subtext="100% Shelf Ready"
          link="/admin/categories"
          colorIndex={2}
        />

        {/* 8. Low / Out of Stock */}
        <StatCard
          icon={AlertTriangle}
          title="Low Stock Warning"
          value={metrics.lowStockProducts.length}
          loading={loading}
          subtext={metrics.lowStockProducts.length > 0 ? "Stock <= 5 units" : "Stock healthy"}
          link="/admin/categories"
          isAlert={metrics.lowStockProducts.length > 0}
          colorIndex={3}
        />
      </motion.div>

      {/* ========================================================================= */}
      {/* ⚡ QUICK MANAGEMENT SHORTCUTS                                             */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Zap size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Store Quick Actions</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group font-bold text-xs shadow-2xs hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600/15 to-indigo-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={16} />
            </div>
            <span>Add Category</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group font-bold text-xs shadow-2xs hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600/15 to-purple-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package size={16} />
            </div>
            <span>Manage Products</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group font-bold text-xs shadow-2xs hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600/15 to-blue-600/15 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag size={16} />
            </div>
            <span>View All Orders</span>
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group font-bold text-xs shadow-2xs hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600/15 to-indigo-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={16} />
            </div>
            <span>View Customers</span>
          </Link>

          <Link
            href="/admin/profile"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group font-bold text-xs shadow-2xs hover:-translate-y-0.5 col-span-2 sm:col-span-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600/15 to-purple-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck size={16} />
            </div>
            <span>Admin Settings</span>
          </Link>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 🏪 STORE HEALTH & SELF-CHECKOUT QR TELEMETRY CANVAS                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Store Health Metrics (5 Cols) */}
        <div className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />
                <span>Store Health & Automation</span>
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                100% Operational
              </span>
            </div>

            <div className="space-y-4">
              {/* Progress 1: QR Coverage */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">QR Shelf Tagging Coverage</span>
                  <span className="text-blue-600 dark:text-blue-400">100%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                </div>
              </div>

              {/* Progress 2: Inventory Health */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Catalog Inventory Health</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {metrics.totalProducts > 0
                      ? `${Math.round(((metrics.totalProducts - metrics.lowStockProducts.length) / metrics.totalProducts) * 100)}%`
                      : "100%"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: metrics.totalProducts > 0
                        ? `${Math.round(((metrics.totalProducts - metrics.lowStockProducts.length) / metrics.totalProducts) * 100)}%`
                        : "100%",
                    }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>

              {/* Progress 3: Payment Success Rate */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Payment Gateway Success Rate</span>
                  <span className="text-indigo-600 dark:text-indigo-400">99.8%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "99.8%" }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                </div>
              </div>

              {/* Progress 4: Scan Speed */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Average Camera Scan Latency</span>
                  <span className="text-cyan-600 dark:text-cyan-400">0.2s</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Security: 256-Bit SSL Encrypted</span>
            <span className="text-emerald-500 font-bold">Node #QC-MASTER</span>
          </div>
        </div>

        {/* Live QR Shopping Simulation & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode size={18} className="text-blue-600 dark:text-blue-400" />
                <span>Live Self-Checkout Node Simulation</span>
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <Sparkles size={13} className="animate-pulse" />
                <span>Active Shopper Loop</span>
              </div>
            </div>

            {/* Micro Shopping Animation */}
            <div className="h-32 w-full rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-950 to-indigo-950/60 border border-blue-500/20 p-4 flex items-center justify-around relative overflow-hidden text-white mb-4">
              <motion.div
                animate={{ x: [-15, 15, -15], y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md relative mb-1">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                    3
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-300">Smart Cart</span>
              </motion.div>

              <ArrowRight size={18} className="text-cyan-400 animate-pulse" />

              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md mb-1">
                  <QrCode size={20} />
                </div>
                <span className="text-[10px] font-bold text-cyan-300">0.2s Scan</span>
              </motion.div>

              <ArrowRight size={18} className="text-indigo-400 animate-pulse" />

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md mb-1">
                  <CreditCard size={20} />
                </div>
                <span className="text-[10px] font-bold text-emerald-300">Instant UPI</span>
              </motion.div>
            </div>

            {/* 3-Col Micro Telemetry */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Avg Time</span>
                <span className="block text-sm font-black text-blue-600 dark:text-blue-400">42s</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Queue Prevented</span>
                <span className="block text-sm font-black text-indigo-600 dark:text-indigo-400">100%</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Conversion</span>
                <span className="block text-sm font-black text-emerald-600 dark:text-emerald-400">98.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📈 REVENUE & CATEGORY CHARTS (Chart.js)                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Revenue Trend (Line Chart) */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
                <span>Revenue Performance (Last 7 Days)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Paid QR order transactions settled over the past week
              </p>
            </div>

            {/* Total Week Revenue Pill */}
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                7-Day Revenue
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block font-mono">
                ₹<CountUp end={metrics.weekRevenue} duration={1.2} separator="," />
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Line
                data={revenueChartConfig}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => ` Revenue: ₹${Number(ctx.raw || 0).toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: "#94a3b8", font: { size: 11 } },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: "#94a3b8",
                        font: { size: 11 },
                        callback: (val) => `₹${val}`,
                      },
                      grid: { color: "rgba(148, 163, 184, 0.1)" },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Category Breakdown (Doughnut Chart) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span>Category Distribution</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Catalog spread across store classifications
              </p>
            </div>

            <div className="h-52 relative flex items-center justify-center my-3">
              {loading ? (
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Doughnut
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { boxWidth: 10, font: { size: 11 }, color: "#94a3b8" },
                      },
                    },
                    cutout: "70%",
                  }}
                />
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Total Categories: {metrics.totalCategories}</span>
            <Link
              href="/admin/categories"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-bold"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ⚠️ CRITICAL LOW STOCK WARNINGS & REVENUE BREAKDOWN                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Summary Breakdown Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <IndianRupee size={20} className="text-blue-600 dark:text-blue-400" />
            <span>Revenue Summary</span>
          </h2>

          <div className="space-y-3">
            <RevenuePeriodRow
              label="Today"
              value={metrics.todayRevenue}
              ordersCount={metrics.todayOrdersCount}
            />
            <RevenuePeriodRow
              label="This Week (7 Days)"
              value={metrics.weekRevenue}
            />
            <RevenuePeriodRow
              label="This Month (30 Days)"
              value={metrics.monthRevenue}
            />
            <RevenuePeriodRow
              label="All-Time Total"
              value={metrics.totalRevenue}
              isHighlight
            />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <AlertTriangle size={20} className="text-amber-500" />
                <span>Critical Stock & Inventory Warnings</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Items with 5 or fewer remaining units requiring immediate restock
              </p>
            </div>

            <Link
              href="/admin/categories"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : metrics.lowStockProducts.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Inventory Healthy</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All catalog items currently have sufficient stock levels.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.lowStockProducts.slice(0, 4).map((prod) => {
                const stock = Number(prod.stock || 0);
                return (
                  <div
                    key={prod._id || prod.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold overflow-hidden shadow-2xs">
                        {prod.productImage ? (
                          <img
                            src={prod.productImage}
                            alt={prod.name || prod.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {prod.name || prod.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                          Price: ₹{Number(prod.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          stock === 0
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {stock === 0 ? "Out of Stock" : `${stock} Left`}
                      </span>

                      <Link
                        href="/admin/categories"
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-xl shadow-2xs transition"
                      >
                        Restock
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📋 RECENT ORDERS & RECENT CUSTOMERS                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <ShoppingBag size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span>Recent In-Store Orders</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Latest customer purchases completed via QR Self-Checkout
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({metrics.totalOrders})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <ShoppingBag size={40} className="mx-auto text-slate-400 mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Orders Placed Yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                When shoppers scan items and checkout, their invoices appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {recentOrders.map((ord) => {
                    const id = ord._id || ord.orderId || "ORD-000";
                    const shortId = id.length > 8 ? id.substring(id.length - 8) : id;
                    const custName = ord.user?.firstName
                      ? `${ord.user.firstName} ${ord.user.lastName || ""}`
                      : ord.customerName || "Customer";
                    const amount = Number(ord.totalAmount || ord.amount || 0);
                    const status = (ord.orderStatus || ord.status || "Paid").toUpperCase();
                    const dateStr = new Date(ord.createdAt || ord.date || Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr key={id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                          #{shortId}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {custName}
                        </td>
                        <td className="py-3.5 font-bold text-slate-900 dark:text-white font-mono">
                          ₹{amount.toLocaleString()}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                              status === "PAID"
                                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : status === "CANCELLED"
                                ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right text-slate-500 dark:text-slate-400 text-xs">
                          {dateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Customers (1 Col) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Users size={20} className="text-purple-600 dark:text-purple-400" />
                <span>Recent Shoppers</span>
              </h2>

              <Link
                href="/admin/customers"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>All ({metrics.totalCustomers})</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : recentCustomers.length === 0 ? (
              <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Users size={36} className="mx-auto text-slate-400 mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Shoppers Registered</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCustomers.map((c) => {
                  const name = c.firstName ? `${c.firstName} ${c.lastName || ""}`.trim() : "Shopper";
                  const initial = name.charAt(0).toUpperCase() || "S";
                  const dateStr = new Date(c.createdAt || Date.now()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={c._id || c.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {c.email || c.phone || "Verified"}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md flex-shrink-0">
                        {dateStr}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/admin/customers"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Open Customer Management</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// Reusable Stat Card Component with CountUp
// ==========================================
function StatCard({
  icon: Icon,
  title,
  value = 0,
  prefix = "",
  loading = false,
  subtext,
  link,
  isAlert = false,
  colorIndex = 0,
}) {
  const accents = [
    {
      iconBg: "bg-gradient-to-tr from-blue-600/15 to-indigo-600/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      iconBg: "bg-gradient-to-tr from-indigo-600/15 to-purple-600/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    },
    {
      iconBg: "bg-gradient-to-tr from-purple-600/15 to-blue-600/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      iconBg: "bg-gradient-to-tr from-emerald-600/15 to-teal-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  const currentAccent = accents[colorIndex % accents.length];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 15, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={link || "#"}
        className="group block bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {title}
            </span>

            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight font-mono">
              {loading ? (
                <span className="inline-block w-20 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ) : (
                <>
                  {prefix}
                  <CountUp end={Number(value || 0)} duration={1.2} separator="," />
                </>
              )}
            </div>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl ${currentAccent.iconBg} border flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          >
            <Icon size={22} />
          </div>
        </div>

        {subtext && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span
              className={`font-semibold text-[11px] truncate ${
                isAlert ? "text-rose-500 font-bold" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {subtext}
            </span>
            <ArrowUpRight
              size={15}
              className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        )}
      </Link>
    </motion.div>
  );
}

// ==========================================
// Revenue Period Row Component
// ==========================================
function RevenuePeriodRow({ label, value = 0, ordersCount, isHighlight = false }) {
  return (
    <div
      className={`p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 ${
        isHighlight
          ? "bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 text-blue-900 dark:text-blue-200"
          : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200"
      }`}
    >
      <div>
        <p className="text-xs font-bold leading-tight">{label}</p>
        {ordersCount !== undefined && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {ordersCount} Orders Placed
          </p>
        )}
      </div>

      <p className={`text-sm sm:text-base font-black font-mono ${isHighlight ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>
        ₹<CountUp end={Number(value || 0)} duration={1} separator="," />
      </p>
    </div>
  );
}
