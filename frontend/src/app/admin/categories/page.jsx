"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import api from "../../../lib/axios";
import {
  Search,
  ArrowUpDown,
  Filter,
  AlertCircle,
  RefreshCw,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Power,
  Sparkles,
  CheckCircle2,
  XCircle,
  FolderTree,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search, Sort and Status filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [saving, setSaving] = useState(false);

  // 300ms search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // ID & Image helper functions
  const getCategoryId = (category) => {
    return category.categoryId || category.id || category._id;
  };

  const getCategoryImage = (category) => {
    return category.categoryImage || category.image;
  };

  // Fetch categories from backend
  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (sort) params.sort = sort;
      if (status) params.status = status;

      const response = await api.get("/categoryapi/categories", { params });

      let data = response.data?.categories || response.data?.category || response.data || [];
      if (Array.isArray(data)) {
        if (status) {
          data = data.filter(
            (cat) => (cat.status || "active").toLowerCase() === status.toLowerCase()
          );
        }
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to load categories. Please try again.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort, status]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalCount = categories.length;
    const activeCount = categories.filter(
      (c) => (c.status || "active").toLowerCase() === "active"
    ).length;
    const inactiveCount = categories.filter(
      (c) => (c.status || "").toLowerCase() === "inactive"
    ).length;

    return { totalCount, activeCount, inactiveCount };
  }, [categories]);

  const openAddModal = () => {
    setIsEdit(false);
    setEditId("");
    setCategoryName("");
    setDescription("");
    setCategoryImage(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setIsEdit(true);
    setEditId(getCategoryId(category));
    setCategoryName(category.categoryName || "");
    setDescription(category.description || "");
    setCategoryImage(null);
    setImagePreview(getCategoryImage(category));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditId("");
    setCategoryName("");
    setDescription("");
    setCategoryImage(null);
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("description", description);

      if (categoryImage) {
        formData.append("categoryImage", categoryImage);
      }

      if (isEdit) {
        await api.put(`/categoryapi/update/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/categoryapi/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      closeModal();
      getCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      alert(err.response?.data?.message || "Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (categoryId) => {
    setDeleteId(categoryId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId("");
  };

  const toggleStatus = async (categoryId) => {
    try {
      setSaving(true);
      await api.put(`/categoryapi/softdelete/${categoryId}`);
      getCategories();
    } catch (err) {
      console.error("Error toggling category status:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    try {
      setSaving(true);
      await api.delete(`/categoryapi/delete/${deleteId}`);
      closeDeleteModal();
      getCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setStatus("");
  };

  const hasActiveFilters = Boolean(search || sort || status);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* Hero Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl shadow-blue-950/10 border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200 mb-3">
              <Sparkles size={13} className="text-blue-400" />
              <span>Catalog Taxonomy</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Category Management</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Organize, structure, and categorize in-store product inventory for fast customer browsing and QR code checkout.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <button
              type="button"
              onClick={getCategories}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 backdrop-blur-md cursor-pointer hover:-translate-y-0.5"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-blue-400" : ""} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* Summary Metric Badges                                     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Categories
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <CountUp end={metrics.totalCount} duration={1} />
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            Organized store departments
          </span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Categories
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            <CountUp end={metrics.activeCount} duration={1} />
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
            ✓ Visible to shoppers
          </span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:shadow-rose-500/5 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Disabled / Inactive
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            <CountUp end={metrics.inactiveCount} duration={1} />
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
            Hidden from customer catalog
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Floating Search & Filter Bar                              */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-[#111827] p-3.5 sm:p-4 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row items-center gap-3">
        {/* Search Box */}
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category by name or keyword..."
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
          {/* Status Dropdown */}
          <div className="relative flex-1 sm:w-44">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Filter size={14} />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-8 pr-7 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition cursor-pointer appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              <option value="">Sort: Default</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && !loading && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" size={18} />
          <div className="flex-1">
            <h3 className="font-bold">Error Loading Categories</h3>
            <p className="mt-0.5 text-rose-600 dark:text-rose-300">{error}</p>
            <button
              type="button"
              onClick={getCategories}
              className="mt-2 inline-flex items-center gap-1.5 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 font-bold transition cursor-pointer"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 space-y-3 shadow-xs animate-pulse"
            >
              <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
              <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md w-1/2" />
              <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-full pt-2" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Layers size={32} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            No Categories Found
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {hasActiveFilters
              ? "Try adjusting or clearing your search keywords and status filter."
              : "Create your first category to start organizing store products."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
            >
              + Add Category
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* Category Grid Cards (Hover Zoom & Glass Actions)          */
        /* ========================================================= */
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => {
            const catId = getCategoryId(category);
            const catImage = getCategoryImage(category);
            const isActive = (category.status || "active").toLowerCase() === "active";

            return (
              <motion.div
                key={catId}
                variants={{ hidden: { opacity: 0, y: 18, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={() => router.push(`/admin/products/${catId}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-[#111827] shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 flex flex-col justify-between"
              >
                {/* Category Banner Image with Zoom */}
                <div className="h-44 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
                  {catImage ? (
                    <img
                      src={catImage}
                      alt={category.categoryName}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-1">
                      <Layers size={32} />
                      <span className="text-[11px] font-medium">No Image</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-xs border backdrop-blur-md ${
                      isActive
                        ? "bg-emerald-500/90 text-white border-emerald-400/50"
                        : "bg-rose-500/90 text-white border-rose-400/50"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="capitalize">{category.status || "Active"}</span>
                  </span>

                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      Click to view products →
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category.categoryName}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {category.description || "In-store QR catalog category."}
                    </p>
                  </div>

                  {/* Glass Action Bar */}
                  <div
                    className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(category)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStatus(catId)}
                        className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? "border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60"
                            : "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
                        }`}
                      >
                        <Power size={12} />
                        <span>{isActive ? "Disable" : "Enable"}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(catId)}
                      className="inline-flex items-center gap-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 px-2.5 py-1.5 text-xs font-bold transition cursor-pointer border border-rose-100 dark:border-rose-800/40"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {isEdit ? "Edit Category" : "Add New Category"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fill in the department details and upload a cover thumbnail.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={saveCategory}>
                <div className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto p-6">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      placeholder="e.g. Beverages, Snacks, Electronics"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Brief summary of items in this category..."
                      className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                    ></textarea>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Category Image
                    </label>
                    <input
                      id="categoryImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="categoryImage"
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 transition hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800"
                    >
                      <span className="shrink-0 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
                        Choose File
                      </span>
                      <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {categoryImage ? categoryImage.name : "Upload category cover thumbnail"}
                      </span>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="h-36 w-full object-cover sm:h-40"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 py-3.5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDeleteModal();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#111827] p-6 shadow-2xl text-center border border-slate-100 dark:border-slate-800"
            >
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Category
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete this category? All associated products may be affected.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteCategory}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-500/20 transition cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
