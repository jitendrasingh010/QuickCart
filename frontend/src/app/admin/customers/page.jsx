"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import api from "@/lib/axios";
import {
  Users,
  Search,
  Eye,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Package,
  IndianRupee,
  ShieldCheck,
  X,
  User,
  ShoppingBag,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export default function AdminCustomersPage() {
  // Customer List & Search / Sort states
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");

  // View Customer Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // 300ms search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch customer list
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (sort) params.sort = sort;

      const response = await api.get("/userapi/customers", { params });
      const customerList = response.data?.data || [];
      setCustomers(Array.isArray(customerList) ? customerList : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.response?.data?.message || "Failed to load customers from server");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  // Metrics
  const metrics = useMemo(() => {
    const totalCount = customers.length;
    const activeCount = customers.filter(
      (c) => (c.status || "active").toLowerCase() === "active"
    ).length;

    return { totalCount, activeCount };
  }, [customers]);

  // Fetch single customer modal details
  const handleOpenViewModal = async (customerId) => {
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setSelectedCustomerData(null);

    try {
      const response = await api.get(`/userapi/customer/${customerId}`);
      setSelectedCustomerData(response.data);
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setModalError(err.response?.data?.message || "Failed to load customer details");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerData(null);
    setModalError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${first}${last}` || "C";
  };

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
              <span>Customer Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Shopper Directory</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Explore registered shopper profiles, account credentials, lifetime spending, and verified purchase records.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              onClick={fetchCustomers}
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
      {/* 3 Summary Metric Badges                                   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Registered Shoppers
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <CountUp end={metrics.totalCount} duration={1} />
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            Verified Customer Accounts
          </span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Shoppers
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            <CountUp end={metrics.activeCount} duration={1} />
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
            ✓ Full Shopping Access
          </span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Security Protocol
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-center gap-1.5">
            JWT Auth
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            HttpOnly Session Token Encrypted
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Floating Search & Filter Bar                              */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-[#111827] p-3.5 sm:p-4 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, email, or phone number..."
            className="w-full pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Filter */}
        <div className="relative w-full sm:w-48">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ArrowUpDown size={14} />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full pl-8 pr-7 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition cursor-pointer appearance-none"
          >
            <option value="">Sort: Default</option>
            <option value="name_asc">Name: A → Z</option>
            <option value="name_desc">Name: Z → A</option>
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
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
            onClick={fetchCustomers}
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        /* Data Table */
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {customers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Users size={32} />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No Customers Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No customer profiles match "${searchQuery}". Try a different keyword.`
                  : "Registered shoppers will appear here once they create an account."}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto lg:overflow-x-hidden w-full">
              <table className="w-full text-left border-collapse table-fixed min-w-[700px] lg:min-w-full">
                <colgroup>
                  <col className="w-[30%] lg:w-[28%]" />
                  <col className="w-[25%] lg:w-[24%]" />
                  <col className="w-[15%] lg:w-[15%]" />
                  <col className="w-[12%] lg:w-[13%]" />
                  <col className="w-[10%] lg:w-[10%]" />
                  <col className="w-[8%] lg:w-[10%]" />
                </colgroup>

                <thead className="bg-slate-50/95 dark:bg-slate-900/95 sticky top-0 z-10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Registered</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {customers.map((customer) => {
                    const fullName = `${customer.firstName || ""} ${
                      customer.lastName || ""
                    }`.trim() || "Shopper";

                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group"
                      >
                        {/* 1. Customer Avatar & Name */}
                        <td className="py-3.5 px-4 overflow-hidden">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                              {getInitials(customer.firstName, customer.lastName)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span
                                title={fullName}
                                className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block"
                              >
                                {fullName}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                #{customer.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Email */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 truncate overflow-hidden">
                          <span title={customer.email}>{customer.email || "—"}</span>
                        </td>

                        {/* 3. Phone */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono overflow-hidden whitespace-nowrap">
                          {customer.phone || "—"}
                        </td>

                        {/* 4. Registered Date */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden text-[11px]">
                          {formatDate(customer.createdAt)}
                        </td>

                        {/* 5. Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {customer.status || "Active"}
                          </span>
                        </td>

                        {/* 6. Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(customer.id)}
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
          )}

          {/* Footer */}
          <div className="bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
            <span>
              Total Shoppers: <strong className="text-slate-800 dark:text-slate-100">{customers.length}</strong>
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Verified Shopper Profiles
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* View Customer Details Modal                               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.18 }}
              className="relative bg-white dark:bg-[#111827] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Customer Profile
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Personal credentials and QR shopping telemetry
                    </p>
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
              <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
                {modalLoading ? (
                  <div className="py-16 text-center">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Loading details...</p>
                  </div>
                ) : modalError ? (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                ) : selectedCustomerData ? (
                  <>
                    {/* Basic Information */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                          {getInitials(
                            selectedCustomerData.user?.firstName,
                            selectedCustomerData.user?.lastName
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {selectedCustomerData.user?.firstName} {selectedCustomerData.user?.lastName}
                          </h4>
                          <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                            Shopper Account
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                        <p className="flex items-center gap-1.5">
                          <Mail size={13} className="text-slate-400" />
                          <span className="truncate">{selectedCustomerData.user?.email || "N/A"}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone size={13} className="text-slate-400" />
                          <span>{selectedCustomerData.user?.phone || "N/A"}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>Joined {formatDate(selectedCustomerData.user?.createdAt)}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-emerald-500" />
                          <span>Status: Verified Active</span>
                        </p>
                      </div>
                    </div>

                    {/* Summary Metric Badges */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                          Total Orders Placed
                        </span>
                        <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">
                          {selectedCustomerData.totalOrders || selectedCustomerData.orders?.length || 0}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                          Total Spent
                        </span>
                        <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">
                          ₹{Number(selectedCustomerData.totalSpent || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Recent Orders History */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                        <ShoppingBag size={14} className="text-blue-600 dark:text-blue-400" />
                        Recent Purchase History
                      </h4>

                      {selectedCustomerData.orders && selectedCustomerData.orders.length > 0 ? (
                        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                              <tr>
                                <th className="py-2 px-3">Order ID</th>
                                <th className="py-2 px-3">Amount</th>
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3 text-right">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                              {selectedCustomerData.orders.map((ord) => (
                                <tr key={ord.orderId || ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                                    #{ord.orderNumber}
                                  </td>
                                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                                    ₹{Number(ord.totalAmount || 0).toLocaleString()}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                                      {ord.paymentStatus || ord.orderStatus || "Paid"}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-right text-slate-400 dark:text-slate-500 text-[11px]">
                                    {formatDate(ord.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                          No orders recorded for this customer yet.
                        </p>
                      )}
                    </div>
                  </>
                ) : null}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}