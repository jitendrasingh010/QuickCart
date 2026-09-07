"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  Package,
  X,
  Eye,
  Calendar,
  CreditCard,
  Search,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  CheckCircle2,
  Clock,
  QrCode,
} from "lucide-react";

export default function MyOrdersPage() {
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

  // 300ms debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch customer orders from backend API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      try {
        response = await api.get("/orderapi/my-orders");
      } catch {
        response = await api.get("/orderapi/getorder");
      }

      const orderData = response.data?.data || response.data?.orders || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      console.error("Error fetching customer orders:", err);
      setError(err.response?.data?.message || "Failed to load your orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

        return (
          orderNum.includes(query) ||
          orderId.includes(query) ||
          pMethod.includes(query) ||
          dateStr.includes(query)
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

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);

    if (!order.OrderItems || order.OrderItems.length === 0) {
      try {
        const res = await api.get(`/orderapi/get/${order.orderId}`);
        if (res.data?.data) {
          setSelectedOrder(res.data.data);
        }
      } catch (err) {
        console.error("Error loading order item breakdown:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (order) => {
    const paymentStatus = (order.paymentStatus || "").toLowerCase().trim();
    const orderStatus = (order.orderStatus || "").toLowerCase().trim();

    if (paymentStatus === "paid" || orderStatus === "paid") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={11} />
          Paid
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={11} />
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
            <Package className="text-blue-600 dark:text-blue-400" size={28} />
            My In-Store Orders
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Receipts and checkout history for all your QR scan purchases.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-blue-600 dark:text-blue-400" : ""} />
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-[#111827] p-3.5 sm:p-4 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, payment method, or date..."
              className="w-full pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition"
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

          {/* Filters Group */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
            {/* Date Filter Dropdown */}
            <div className="relative flex-1 sm:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
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
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                <ArrowUpDown size={14} />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition cursor-pointer appearance-none"
              >
                <option value="">Sort: Default</option>
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
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
              <span className="text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/4 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-50 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {!loading && error && (
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

      {/* Orders Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-3">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No Orders Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                No orders found for the selected filters.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto lg:overflow-x-hidden w-full">
              <table className="w-full text-left border-collapse table-fixed min-w-[650px] lg:min-w-full">
                <colgroup>
                  <col className="w-[30%] lg:w-[28%]" />
                  <col className="w-[20%] lg:w-[22%]" />
                  <col className="w-[20%] lg:w-[20%]" />
                  <col className="w-[18%] lg:w-[18%]" />
                  <col className="w-[12%] lg:w-[12%]" />
                </colgroup>

                <thead className="bg-slate-50/95 dark:bg-slate-800/95 sticky top-0 z-10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4 text-right">Receipt</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.orderId || order._id}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="py-3.5 px-4 overflow-hidden">
                        <span
                          title={order.orderNumber}
                          className="font-mono font-bold text-slate-900 dark:text-white truncate block max-w-full group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          #{order.orderNumber}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          ₹{Number(order.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                        {getStatusBadge(order)}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 overflow-hidden text-[11px]">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(order)}
                          className="bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer group/btn"
                        >
                          <Eye size={13} className="group-hover/btn:scale-110 transition-transform" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="bg-slate-50/70 dark:bg-slate-800/70 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
            <span>
              Showing: <strong className="text-slate-800 dark:text-slate-200">{filteredOrders.length}</strong> of {orders.length} Orders
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Verified Digital Receipts
            </span>
          </div>
        </div>
      )}

      {/* Order Receipt Modal */}
      {isModalOpen && selectedOrder && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-100 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Digital Receipt
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  #{selectedOrder.orderNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Payment Details */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  {getStatusBadge(selectedOrder)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Payment Gateway:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                    {selectedOrder.paymentMethod || "Razorpay"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Date:</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                  Purchased Items ({selectedOrder.OrderItems?.length || 0})
                </h3>

                {selectedOrder.OrderItems && selectedOrder.OrderItems.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
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
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-center">
                    No detailed line items recorded.
                  </p>
                )}
              </div>

              {/* Total Summary */}
              <div className="bg-blue-50/70 dark:bg-blue-950/50 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Total Paid
                </span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  ₹{Number(selectedOrder.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
