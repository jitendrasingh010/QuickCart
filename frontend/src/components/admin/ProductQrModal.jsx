"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductQrModal({ isOpen, onClose, product }) {
  const [imgError, setImgError] = useState(false);

  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset image error state when product changes
  useEffect(() => {
    setImgError(false);
  }, [product]);

  if (!isOpen || !product) return null;

  const qrCodeUrl = product.qrCode || "";
  const hasValidQr = Boolean(qrCodeUrl && !imgError);

  const getProductImage = (p) => p.productImage || p.image || "";
  const categoryName =
    product.Category?.categoryName ||
    product.category?.categoryName ||
    product.categoryName ||
    (product.categoryId ? `Category #${product.categoryId}` : "Uncategorized");

  const handleDownload = async () => {
    if (!hasValidQr) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const fileName = `${(product.productName || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "_")}_qr.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback for cross-origin or direct download
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.target = "_blank";
      link.download = `${(product.productName || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "_")}_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product QR Code</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scan or download this code for customer checkout</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
          {/* QR Code Container (250x250) */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-[250px] w-[250px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2 shadow-inner">
              {hasValidQr ? (
                <img
                  src={qrCodeUrl}
                  alt={`QR code for ${product.productName}`}
                  onError={() => setImgError(true)}
                  className="h-[250px] w-[250px] rounded-xl object-contain bg-white p-2 shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">QR Not Available</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">No QR code was generated for this product</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                {getProductImage(product) ? (
                  <img
                    src={getProductImage(product)}
                    alt={product.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                  {product.productName || "Unnamed Product"}
                </h3>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{product.description || "No description provided."}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200/80 dark:border-slate-700/80 pt-3 text-center">
              <div className="rounded-xl bg-white dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Price</span>
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                  ₹{Number(product.price || 0).toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Category</span>
                <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-100" title={categoryName}>
                  {categoryName}
                </span>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800">
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Stock</span>
                <span className={`block text-sm font-bold ${(product.stock ?? 0) <= 5 ? "text-amber-600 dark:text-amber-400" : "text-slate-800 dark:text-slate-100"}`}>
                  {product.stock ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasValidQr}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR
          </button>
        </div>
      </motion.div>
    </div>
  );
}
