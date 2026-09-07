"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import api from "@/lib/axios";
import {
  Package,
  Eye,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  Search,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Receipt,
  QrCode,
} from "lucide-react";

export default function AdminOrdersPage() {
  // Orders, Loading & Error States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Sort and Date Filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 300ms Debounce for Search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      try {
        response = await api.get("/orderapi/orders");
      } catch {
        response = await api.get("/orderapi/getorder");
      }

      const orderList = response.data?.data || response.data?.orders || [];
      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      setError(err.response?.data?.message || "Failed to load orders from server");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Escape key handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Modal handlers
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Metrics Summary
  const metrics = useMemo(() => {
    const totalCount = orders.length;
    const totalRevenue = orders.reduce((sum, o) => {
      const isPaid = (o.paymentStatus || o.orderStatus || "").toLowerCase() === "paid";
      return isPaid ? sum + Number(o.totalAmount || 0) : sum;
    }, 0);
    const paidCount = orders.filter(
      (o) => (o.paymentStatus || o.orderStatus || "").toLowerCase() === "paid"
    ).length;
    const pendingCount = orders.filter(
      (o) => (o.paymentStatus || o.orderStatus || "").toLowerCase() === "pending"
    ).length;

    return { totalCount, totalRevenue, paidCount, pendingCount };
  }, [orders]);

  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Date filter matching helper
  const checkDateMatch = (orderDateStr, dateMode, customStart, customEnd) => {
    if (!dateMode) return true;
    if (!orderDateStr) return false;

    const orderDate = new Date(orderDateStr);
    const now = new Date();

    if (dateMode === "today") {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      return orderDate >= startOfToday;
    }

    if (dateMode === "yesterday") {
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
      const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
      return orderDate >= startOfYesterday && orderDate <= endOfYesterday;
    }

    if (dateMode === "last_7_days") {
      const startOf7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0);
      return orderDate >= startOf7Days;
    }

    if (dateMode === "last_30_days") {
      const startOf30Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0, 0);
      return orderDate >= startOf30Days;
    }

    if (dateMode === "this_month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      return orderDate >= startOfMonth;
    }

    if (dateMode === "custom") {
      if (customStart && customEnd) {
        const start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      } else if (customStart) {
        const start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
        return orderDate >= start;
      } else if (customEnd) {
        const end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
        return orderDate <= end;
      }
      return true;
    }

    return true;
  };

  // Instant Client-side Filtering & Sorting from Original Orders Array
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // 1. Date Filter
    if (dateFilter && dateFilter.trim() !== "") {
      result = result.filter((order) =>
        checkDateMatch(order.createdAt, dateFilter, customStartDate, customEndDate)
      );
    }

    // 2. Search Filter
    if (debouncedSearch && debouncedSearch.trim() !== "") {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter((order) => {
        const orderNum = String(order.orderNumber || "").toLowerCase();
        const orderId = String(order.orderId || order._id || "").toLowerCase();
        const pMethod = String(order.paymentMethod || "").toLowerCase();
        const dateStr = formatDate(order.createdAt).toLowerCase();

        const customerName = order.User
          ? `${order.User.firstName || ""} ${order.User.lastName || ""}`.toLowerCase()
          : "";
        const customerEmail = String(order.User?.email || "").toLowerCase();

        return (
          orderNum.includes(query) ||
          orderId.includes(query) ||
          pMethod.includes(query) ||
          dateStr.includes(query) ||
          customerName.includes(query) ||
          customerEmail.includes(query)
        );
      });
    }

    // 3. Sorting
    if (sort) {
      if (sort === "latest") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === "oldest") {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sort === "amount_low_high") {
        result.sort((a, b) => Number(a.totalAmount || 0) - Number(b.totalAmount || 0));
      } else if (sort === "amount_high_low") {
        result.sort((a, b) => Number(b.totalAmount || 0) - Number(a.totalAmount || 0));
      }
    }

    return result;
  }, [orders, dateFilter, customStartDate, customEndDate, debouncedSearch, sort]);

  // Status Badge
  const getStatusBadge = (order) => {
    const paymentStatus = (order.paymentStatus || "").toLowerCase();
    const orderStatus = (order.orderStatus || "").toLowerCase();

    if (paymentStatus === "paid" || orderStatus === "paid") {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Paid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          Pending
        </span>
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
    setCustomStartDate("");
    setCustomEndDate("");
    setSort("");
  };

  const hasActiveFilters = Boolean(
    search || dateFilter || customStartDate || customEndDate || sort
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================= */}
      {/* Hero Header Banner                                        */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl shadow-blue-950/10 border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200 mb-3">
              <Sparkles size={13} className="text-blue-400" />
              <span>Real-Time QR Telemetry</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Orders & Transactions</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Monitor customer in-store QR code checkouts, verified digital payments, and real-time transaction logs.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 backdrop-blur-md cursor-pointer hover:-translate-y-0.5"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-blue-400" : ""} />
              <span>Live Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 Summary Metric Badges                                   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Orders */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Checkouts
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Receipt size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <CountUp end={metrics.totalCount} duration={1} />
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            QR In-Store Orders
          </span>
        </div>

        {/* Metric 2: Settled Revenue */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Settled Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹<CountUp end={metrics.totalRevenue} duration={1.2} separator="," decimals={0} />
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
            ✓ Successfully Paid
          </span>
        </div>

        {/* Metric 3: Paid Rate */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Paid Transactions
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <CountUp end={metrics.paidCount} duration={1} />
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            Verified online receipts
          </span>
        </div>

        {/* Metric 4: Pending Clearance */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-amber-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pending Payments
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <CountUp end={metrics.pendingCount} duration={1} />
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 block">
            Awaiting checkout completion
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Floating Search & Filter Bar (SaaS Glassmorphism)         */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-[#111827] p-3.5 sm:p-4 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer Name, or Email..."
              className="w-full pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
            {/* Date Filter Dropdown */}
            <div className="relative flex-1 sm:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={14} />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition cursor-pointer appearance-none"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_month">This Month</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ArrowUpDown size={14} />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition cursor-pointer appearance-none"
              >
                <option value="">Sort: Newest First</option>
                <option value="latest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_low_high">Amount: Low → High</option>
                <option value="amount_high_low">Amount: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Date Range Picker Container */}
        {dateFilter === "custom" && (
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300">Select Range:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
              <span className="text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="font-bold underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/4 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Receipt size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Orders Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
            No orders found for the selected filters.
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
        /* ========================================================= */
        /* Orders Data Table (Zero Desktop Horizontal Scroll)        */
        /* ========================================================= */
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto lg:overflow-x-hidden w-full">
            <table className="w-full text-left border-collapse table-fixed min-w-[700px] lg:min-w-full">
              <colgroup>
                <col className="w-[20%] lg:w-[18%]" />
                <col className="w-[28%] lg:w-[26%]" />
                <col className="w-[15%] lg:w-[14%]" />
                <col className="w-[16%] lg:w-[15%]" />
                <col className="w-[13%] lg:w-[17%]" />
                <col className="w-[8%] lg:w-[10%]" />
              </colgroup>

              <thead className="bg-slate-50/95 dark:bg-slate-900/95 sticky top-0 z-10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredOrders.map((order) => {
                  const customerName = order.User
                    ? `${order.User.firstName || ""} ${order.User.lastName || ""}`.trim() || "Customer"
                    : "Shopper";
                  const customerEmail = order.User?.email || "customer@quickcart.com";
                  const initial = customerName.charAt(0).toUpperCase() || "C";

                  return (
                    <tr
                      key={order.orderId || order._id}
                      className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group"
                    >
                      {/* 1. Order ID */}
                      <td className="py-3.5 px-4 overflow-hidden">
                        <span
                          title={order.orderNumber}
                          className="font-mono font-bold text-slate-900 dark:text-white truncate block max-w-full group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          #{order.orderNumber}
                        </span>
                      </td>

                      {/* 2. Customer Profile */}
                      <td className="py-3.5 px-4 overflow-hidden">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1 truncate">
                            <p className="font-bold text-slate-900 dark:text-white truncate leading-tight">
                              {customerName}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight">
                              {customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 3. Total Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          ₹{Number(order.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* 4. Payment Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                        {getStatusBadge(order)}
                      </td>

                      {/* 5. Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 overflow-hidden text-[11px]">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* 6. Action Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(order)}
                          className="bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer group/btn"
                        >
                          <Eye size={13} className="group-hover/btn:scale-110 transition-transform" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
            <span>
              Showing: <strong className="text-slate-800 dark:text-slate-100">{filteredOrders.length}</strong> of {orders.length} Orders
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Verified Digital Receipts
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Digital Receipt Modal Dialog                              */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
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
              className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              {/* Receipt Header Banner */}
              <div className="p-6 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white relative flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold text-blue-200 mb-1">
                    <QrCode size={11} />
                    <span>QuickCart Self-Checkout</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Digital Receipt</h2>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    #{selectedOrder.orderNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Receipt Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                {/* Customer Details Box */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Customer Details
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedOrder.User
                        ? `${selectedOrder.User.firstName || ""} ${selectedOrder.User.lastName || ""}`.trim() || "Customer"
                        : "Walk-in Customer"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Email:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedOrder.User?.email || "N/A"}
                    </span>
                  </div>
                  {selectedOrder.User?.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedOrder.User.phone}</span>
                    </div>
                  )}
                </div>

                {/* Transaction Details Box */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Transaction Information
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payment Status:</span>
                    {getStatusBadge(selectedOrder)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payment Method:</span>
                    <span className="font-bold text-slate-900 dark:text-white uppercase">
                      {selectedOrder.paymentMethod || "Razorpay"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  {selectedOrder.razorpayPaymentId && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Razorpay ID:</span>
                      <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {selectedOrder.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Scanned Items Breakdown */}
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                    Scanned Items ({selectedOrder.OrderItems?.length || 0})
                  </h4>

                  {selectedOrder.OrderItems && selectedOrder.OrderItems.length > 0 ? (
                    <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2 px-3">Item</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {selectedOrder.OrderItems.map((item, index) => (
                            <tr key={item.orderItemId || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                              <td className="py-2.5 px-3">
                                <p className="font-bold text-slate-900 dark:text-white">
                                  {item.Product?.productName || `Item #${item.productId}`}
                                </p>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                  ₹{Number(item.price || 0).toFixed(2)} each
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </td>
                              <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white">
                                ₹{Number(item.subTotal || item.price * item.quantity || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl text-center">
                      No line item details recorded.
                    </p>
                  )}
                </div>

                {/* Total Settled */}
                <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/60 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Settled</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    ₹{Number(selectedOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}