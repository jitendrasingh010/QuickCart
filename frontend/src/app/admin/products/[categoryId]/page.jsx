"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../../lib/axios";
import ProductQrModal from "@/components/admin/ProductQrModal";
import {
  Search,
  ArrowUpDown,
  Filter,
  RefreshCw,
  AlertCircle,
  Package,
  Plus,
  Edit2,
  Trash2,
  Power,
  QrCode,
  Sparkles,
} from "lucide-react";

function ProductQrPreview({ product, onOpenModal }) {
  const [imgError, setImgError] = useState(false);
  const qrUrl = product.qrCode;
  const hasValidQr = Boolean(qrUrl && !imgError);

  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 shadow-xs">
        {hasValidQr ? (
          <img
            src={qrUrl}
            alt={`${product.productName} QR Preview`}
            onError={() => setImgError(true)}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-1 text-slate-400">
            <QrCode size={18} />
            <span className="text-[9px] font-medium leading-tight mt-0.5">
              No QR
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onOpenModal(product)}
        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer"
      >
        <QrCode size={11} />
        <span>View</span>
      </button>
    </div>
  );
}

export default function AdminProductsPage() {
  const { categoryId } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Search, Sort and Status filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);

  // QR Modal State
  const [selectedQrProduct, setSelectedQrProduct] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // 300ms debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const getProductId = (product) => product.productId || product.id || product._id;
  const getProductImage = (product) => product.productImage || product.image || "";
  const getCategoryName = (product) =>
    product.Category?.categoryName ||
    product.category?.categoryName ||
    product.categoryName ||
    "General";

  // Fetch products from backend with search, sort & status filter
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (sort) params.sort = sort;
      if (status) params.status = status;

      if (categoryId && categoryId !== "all") {
        params.categoryId = categoryId;
      }

      const response = await api.get("/productapi/products", { params });

      let data = response.data?.products || response.data || [];
      if (Array.isArray(data)) {
        if (categoryId && categoryId !== "all") {
          const targetCat = categoryId.toString().trim().toLowerCase();
          data = data.filter((p) => {
            const pCatName = (p.Category?.categoryName || p.categoryName || "").toLowerCase();
            const pCatId = String(p.categoryId || p.Category?.categoryId || "");
            return pCatName === targetCat || pCatName.includes(targetCat) || pCatId === targetCat;
          });
        }
        if (status) {
          data = data.filter(
            (p) => (p.status || "active").toLowerCase() === status.toLowerCase()
          );
        }
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Could not fetch products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, debouncedSearch, sort, status]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const resetForm = () => {
    setIsEdit(false);
    setEditId("");
    setProductName("");
    setDescription("");
    setPrice("");
    setStock("");
    setProductImage(null);
    setImagePreview("");
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEdit(true);
    setEditId(getProductId(product));
    setProductName(product.productName || "");
    setDescription(product.description || "");
    setPrice(product.price || "");
    setStock(product.stock ?? "");
    setProductImage(null);
    setImagePreview(getProductImage(product));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleOpenQrModal = (product) => {
    setSelectedQrProduct(product);
    setShowQrModal(true);
  };

  const handleCloseQrModal = () => {
    setShowQrModal(false);
    setSelectedQrProduct(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (categoryId && categoryId !== "all") {
        formData.append("categoryId", categoryId);
      }
      if (productImage) formData.append("productImage", productImage);

      if (isEdit) {
        await api.put(`/productapi/update/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/productapi/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      closeModal();
      getProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Could not save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const softDeleteProduct = async (product) => {
    try {
      setSaving(true);
      setError("");
      await api.patch(`/productapi/softdelete/${getProductId(product)}`);
      getProducts();
    } catch (err) {
      console.error("Error updating product status:", err);
      setError("Could not update product status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteProductTarget) return;
    try {
      setSaving(true);
      setError("");
      await api.delete(`/productapi/delete/${getProductId(deleteProductTarget)}`);
      setShowDeleteModal(false);
      setDeleteProductTarget(null);
      getProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Could not delete product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setSort("");
  };

  const hasActiveFilters = Boolean(search || status || sort);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Package className="text-blue-600 dark:text-blue-400" size={28} />
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage inventory, pricing, active states, and QR codes.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer self-start sm:self-auto hover:-translate-y-0.5"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </motion.div>

      {/* Controls Bar */}
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
            placeholder="Search product by name or keyword..."
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

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
          {/* Status Filter */}
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
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" size={18} />
          <div className="flex-1">
            <h3 className="font-bold">Error Loading Products</h3>
            <p className="mt-0.5 text-rose-600 dark:text-rose-300">{error}</p>
            <button
              type="button"
              onClick={getProducts}
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
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/4 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Package size={28} />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-white">No Products Found</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {hasActiveFilters
              ? "No products match your search or filter criteria. Try resetting filters."
              : "Add your first product to this category to get started."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
            >
              + Add Product
            </button>
          </div>
        </div>
      ) : (
        /* Data Table (Zero Desktop Horizontal Scroll) */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white dark:bg-[#111827] rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden"
        >
          <div className="overflow-x-auto lg:overflow-x-hidden w-full">
            <table className="w-full text-left border-collapse table-fixed min-w-[750px] lg:min-w-full">
              <colgroup>
                <col className="w-[30%] lg:w-[28%]" />
                <col className="w-[18%] lg:w-[16%]" />
                <col className="w-[12%] lg:w-[12%]" />
                <col className="w-[10%] lg:w-[10%]" />
                <col className="w-[10%] lg:w-[11%]" />
                <col className="w-[10%] lg:w-[10%]" />
                <col className="w-[10%] lg:w-[13%]" />
              </colgroup>

              <thead className="bg-slate-50/95 dark:bg-slate-900/95 sticky top-0 z-10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">QR Code</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {products.map((product) => {
                  const pId = getProductId(product);
                  const pImg = getProductImage(product);
                  const isActive = (product.status || "active").toLowerCase() === "active";
                  const inStock = Number(product.stock || 0) > 0;

                  return (
                    <tr key={pId} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group">
                      {/* Product Info & Thumbnail */}
                      <td className="py-3.5 px-4 overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            {pImg ? (
                              <img
                                src={pImg}
                                alt={product.productName}
                                loading="lazy"
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <Package size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span
                              title={product.productName}
                              className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block"
                            >
                              {product.productName}
                            </span>
                            <span
                              title={product.description}
                              className="text-[11px] text-slate-400 dark:text-slate-500 truncate block font-normal mt-0.5"
                            >
                              {product.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 overflow-hidden">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-full">
                          {getCategoryName(product)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          ₹{Number(product.price || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                        <span
                          className={`font-bold ${
                            inStock ? "text-slate-800 dark:text-slate-200" : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {product.stock ?? 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap overflow-hidden">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                              : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          <span className="capitalize">{product.status || "Active"}</span>
                        </span>
                      </td>

                      {/* QR Code */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap overflow-hidden">
                        <ProductQrPreview product={product} onOpenModal={handleOpenQrModal} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => softDeleteProduct(product)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isActive
                                ? "border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60"
                                : "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
                            }`}
                            title={isActive ? "Disable Product" : "Enable Product"}
                          >
                            <Power size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteProductTarget(product);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition cursor-pointer border border-rose-100 dark:border-rose-800/40"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
            <span>
              Total Products: <strong className="text-slate-800 dark:text-slate-100">{products.length}</strong>
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Live QR Store Catalog
            </span>
          </div>
        </motion.div>
      )}

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-100 dark:border-slate-800"
            >
            <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isEdit ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update inventory details, pricing, and upload product image.
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

            <form onSubmit={saveProduct}>
              <div className="max-h-[calc(100vh-220px)] space-y-3.5 overflow-y-auto p-6 text-xs sm:text-sm">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    placeholder="e.g. Organic Milk, Whole Wheat Bread"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="2.5"
                    placeholder="Short product details..."
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Stock Units
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Product Image
                  </label>
                  <input
                    id="productImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="productImageInput"
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 transition hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <span className="shrink-0 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
                      Choose File
                    </span>
                    <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {productImage ? productImage.name : "Upload product photo"}
                    </span>
                  </label>
                </div>

                {imagePreview && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-32 w-full object-cover"
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
                  {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
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
              if (e.target === e.currentTarget) setShowDeleteModal(false);
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
                Delete Product
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete this product? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
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

      {/* QR Code Details Modal */}
      <ProductQrModal
        isOpen={showQrModal}
        onClose={handleCloseQrModal}
        product={selectedQrProduct}
      />
    </div>
  );
}
