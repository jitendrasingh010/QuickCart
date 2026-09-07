"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import api from "@/lib/axios";
import {
  Camera,
  ShoppingCart,
  QrCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Package,
  X,
  ShieldCheck,
  CreditCard,
  ScanLine,
  Zap,
  Store,
  Receipt,
  Check,
  Smartphone,
  CheckCheck,
  Bot,
  ThumbsUp,
} from "lucide-react";

export default function ScanPage() {
  const scannerRef = useRef(null);

  // Scanner & Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState("");

  // Success & Error Toasts
  const [lastScannedProduct, setLastScannedProduct] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  /* ── 🤖 Animated Smart Shopping Assistant Mascot State (Looping Story) ── */
  // Step 0: Mascot stands & holds product with QR tag
  // Step 1: Mascot points & moves item toward scanner
  // Step 2: Blue laser scans the QR (scanner glows)
  // Step 3: Big green tick appears (scan success)
  // Step 4: Mascot smiles & gives Thumbs Up 👍
  const [mascotStep, setMascotStep] = useState(0);

  useEffect(() => {
    const stepDurations = [2200, 2000, 2200, 2000, 2400];
    const timer = setTimeout(() => {
      setMascotStep((prev) => (prev + 1) % stepDurations.length);
    }, stepDurations[mascotStep]);

    return () => clearTimeout(timer);
  }, [mascotStep]);

  /* ── Premium Animation States ── */
  const [showSparkle, setShowSparkle] = useState(false);        // Sparkle burst on scan success
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false); // Full-screen payment success overlay
  const [paymentStep, setPaymentStep] = useState(0);            // Payment success animation step (0-3)

  // Auto-dismiss scan notification after 4 seconds
  useEffect(() => {
    if (lastScannedProduct) {
      const timer = setTimeout(() => {
        setLastScannedProduct(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastScannedProduct]);

  useEffect(() => {
    if (scanError) {
      const timer = setTimeout(() => {
        setScanError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [scanError]);

  // Shared function: Fetch product by decoded QR and update cart (auto-increment on duplicate scan)
  const addProductToCart = useCallback(async (decodedText) => {
    const productId = String(decodedText).trim();
    if (!productId) return;

    try {
      setIsProcessing(true);
      setProcessingMsg("Reading Product QR Code...");
      setScanError(null);

      // Call existing product API by productId
      const res = await api.get(`/productapi/get/${productId}`);
      const productData = res.data?.product;

      if (!productData) {
        setScanError("QR not recognized. Try another QR.");
        return;
      }

      const product = {
        productId: productData.productId || Number(productId),
        name: productData.productName || "Product",
        price: Number(productData.price || 0),
        category: productData.Category?.categoryName || productData.categoryName || "General",
        image: productData.productImage || productData.image || "",
        stock: productData.stock ?? 1,
      };

      setCart((prev) => {
        const exist = prev.find((item) => item.productId === product.productId);
        if (exist) {
          return prev.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      setLastScannedProduct(product);

      /* ✨ Trigger sparkle burst on successful scan */
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1200);
    } catch (error) {
      console.error("Error fetching product:", error);
      setScanError(error.response?.data?.message || "QR not recognized. Try another QR.");
    } finally {
      setIsProcessing(false);
      setProcessingMsg("");
    }
  }, []);

  // Live Camera Scanner
  const startScanner = async () => {
    if (isScanning) return;
    setScanError(null);

    try {
      setIsScanning(true);
      // Allow DOM to render #reader container before starting Html5Qrcode
      await new Promise((resolve) => setTimeout(resolve, 80));

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
        },
        async (decodedText) => {
          await addProductToCart(decodedText);
        }
      );
    } catch (err) {
      console.error("Camera access error:", err);
      setScanError("Camera not accessible. Please grant camera permission.");
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        } catch (_) {}
        scannerRef.current = null;
      }
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Cart operations (Remove only - No +/- buttons as per instructions)
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Totals
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Razorpay Checkout
  const handlePayment = async () => {
    if (cart.length === 0) {
      setScanError("Please scan at least one product before checking out.");
      return;
    }

    try {
      setIsCheckingOut(true);
      const { data } = await api.post("/paymentapi/create-order", {
        amount: total,
      });

      // Ensure Razorpay script is loaded
      if (typeof window.Razorpay === "undefined") {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "QuickCart Smart Store",
        description: "In-Store QR Self-Checkout",
        order_id: data.order.id,
        async handler(response) {
          try {
            await api.post("/paymentapi/verify", {
              cartItems: cart,
              totalAmount: total,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            /* 🎉 Premium Payment Success Animation Sequence */
            setShowPaymentSuccess(true);
            setPaymentStep(0);

            // Step 0: "Payment Processing..." (already shown)
            // Step 1: Animated success checkmark (after 800ms)
            setTimeout(() => setPaymentStep(1), 800);
            // Step 2: Confetti + Thank You message (after 2200ms)
            setTimeout(() => setPaymentStep(2), 2200);
            // Step 3: Clean up & redirect (after 5000ms)
            setTimeout(() => {
              setShowPaymentSuccess(false);
              setPaymentStep(0);
              setCart([]);
              setLastScannedProduct(null);
            }, 5000);
          } catch (error) {
            console.error("Payment verification error:", error);
            setScanError(error.response?.data?.message || "Payment verification failed.");
          }
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Unable to create payment order:", error);
      setScanError("Unable to initiate payment order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-8 max-w-7xl mx-auto pb-20 select-none font-sans">
      {/* ========================================================================= */}
      {/* 🎉 FULL-SCREEN PAYMENT SUCCESS OVERLAY                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-950/95 via-blue-950/95 to-indigo-950/95 backdrop-blur-2xl"
          >
            {/* Animated Background Glowing Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 text-center px-6 max-w-md w-full">
              <AnimatePresence mode="wait">
                {/* Step 0: Processing */}
                {paymentStep === 0 && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-18 h-18 rounded-full border-4 border-blue-500/30 border-t-blue-400"
                    />
                    <h3 className="text-xl font-bold text-white">Settling Payment Rails...</h3>
                    <p className="text-sm text-blue-300/80">Securing your in-store transaction</p>
                  </motion.div>
                )}

                {/* Step 1: Success Checkmark */}
                {paymentStep === 1 && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-24 h-24 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                    >
                      <CheckCircle2 size={52} className="text-emerald-400" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white">Payment Approved!</h3>
                    <p className="text-sm text-emerald-300 font-semibold">Your items have been checked out ✓</p>
                  </motion.div>
                )}

                {/* Step 2: Confetti + Thank You */}
                {paymentStep === 2 && (
                  <motion.div
                    key="thankyou"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="flex flex-col items-center gap-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="text-6xl animate-bounce"
                    >
                      🎉
                    </motion.div>

                    <div className="space-y-1">
                      <h2 className="text-3xl sm:text-4xl font-black text-white">Order Verified!</h2>
                      <p className="text-blue-200 text-sm">Thank you for choosing QuickCart Smart Store</p>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-3xl">🛒</span>
                      <ArrowRight size={20} className="text-cyan-400 animate-pulse" />
                      <span className="text-3xl">🛍️</span>
                      <ArrowRight size={20} className="text-emerald-400 animate-pulse" />
                      <span className="text-3xl">✨</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 font-medium bg-white/10 px-4 py-2 rounded-2xl border border-white/15">
                      Skip all cashier lines • Collect your items • Walk out freely!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ Sparkle burst overlay on successful scan */}
      <AnimatePresence>
        {showSparkle && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI) / 4) * 120,
                  y: Math.sin((i * Math.PI) / 4) * 120,
                  opacity: [1, 0.8, 0],
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute w-3 h-3 rounded-full"
                style={{ backgroundColor: ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#a855f7'][i] }}
              />
            ))}
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 0] }} transition={{ duration: 0.6 }} className="text-4xl">✨</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 🌌 SMART QR SCANNER HERO BANNER                                           */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full relative overflow-hidden rounded-[36px] bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-7 sm:p-9 shadow-2xl shadow-blue-950/25 border border-slate-800/90"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-blue-200 mb-3 shadow-sm">
              <Sparkles size={13} className="text-blue-400 animate-pulse" />
              <span>Smart QR Self-Checkout Kiosk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Smart QR Scanner</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Aim your camera at any product packaging barcode or shelf QR tag. Items sync to your digital cart with ultra-low 0.2s latency.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href="/customer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 backdrop-blur-md cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <Package size={15} />
              <span>Browse In-Store Catalog</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 📷 MAIN SCANNER KIOSK (70%) & CART CHECKOUT SUMMARY (30%)                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left 8 Cols: Dual Mode Scanner Kiosk & Animated AI Mascot */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[36px] p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 border border-slate-200/80 dark:border-slate-800 space-y-6">

            {/* Kiosk Mode Selector Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ScanLine className="text-blue-600 dark:text-blue-400" size={20} />
                  <span>Interactive Scanner Terminal</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Scan in-store shelf QR codes and packaging barcodes with your device camera.
                </p>
              </div>

              {/* Camera Trigger Button */}
              <div className="flex items-center gap-2">
                {!isScanning ? (
                  <button
                    type="button"
                    onClick={startScanner}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Camera size={16} />
                    <span>Launch Live Camera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopScanner}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition cursor-pointer"
                  >
                    <X size={16} />
                    <span>Stop Camera</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scanner Grid: Main Viewfinder (Left 7 Cols) + Cute Animated Smart Assistant Mascot (Right 5 Cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Viewfinder Area (7 Cols) */}
              <div className="md:col-span-7 space-y-4">
                {/* Live Camera Viewfinder (When active) */}
                {isScanning ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="overflow-hidden rounded-[32px] border-2 border-blue-500/40 bg-slate-950 p-4 relative shadow-2xl shadow-blue-500/20"
                  >
                    {/* 📱 Continuous Vertical Laser Scan Beam */}
                    <div className="absolute inset-4 z-10 pointer-events-none rounded-2xl overflow-hidden">
                      <motion.div
                        animate={{ y: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/80"
                      />
                      {/* High-Tech Glowing Corner Reticle Brackets */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-cyan-400 rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-cyan-400 rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-cyan-400 rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-cyan-400 rounded-br-xl" />
                    </div>

                    <div id="reader" className="w-full min-h-[300px] rounded-2xl overflow-hidden" />
                    <div className="mt-3 text-center text-xs text-blue-200 font-bold py-1 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Aim barcode or shelf QR within the box</span>
                    </div>
                  </motion.div>
                ) : (
                  /* Camera Ready Launcher Card (When not scanning) */
                  <div
                    onClick={startScanner}
                    className="relative rounded-[32px] border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-slate-800/70 p-8 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3 border border-white/20 group-hover:scale-105 transition-transform"
                    >
                      <Camera size={30} />
                    </motion.div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      Camera Ready for QR Scanning
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                      Uses webcam on desktop or rear camera on mobile devices
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all">
                      <Camera size={14} />
                      <span>Start Camera Scanner</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 🤖 Right: Cute Animated Shopping Assistant Mascot Companion (5 Cols) */}
              <div className="md:col-span-5 h-full">
                <div className="relative rounded-[32px] bg-gradient-to-b from-blue-950/80 via-slate-950 to-indigo-950/90 border border-blue-500/30 p-5 flex flex-col items-center justify-between text-center overflow-hidden shadow-xl min-h-[310px]">
                  
                  {/* Subtle Background Glows */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Top Badge: AI Smart Shopping Guide */}
                  <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold text-blue-200">
                    <Sparkles size={11} className="text-cyan-400 animate-pulse" />
                    <span>QuickBot • Shopping Guide</span>
                  </div>

                  {/* 🤖 Mascot Character Animation Canvas */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    className="relative my-3 flex flex-col items-center"
                  >
                    {/* Floating Sparkles around Mascot */}
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-3 -right-4 text-xs"
                    >
                      ✨
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: 0.5 }}
                      className="absolute -bottom-1 -left-4 text-xs"
                    >
                      ⭐
                    </motion.span>

                    {/* Robot Head with Cute Blinking Eyes */}
                    <div className="w-20 h-18 rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-900 border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/30 flex flex-col items-center justify-center relative p-2">
                      
                      {/* Robot Antenna with Glowing Tip */}
                      <div className="absolute -top-3 w-1 h-3 bg-cyan-400 rounded-t-full flex items-start justify-center">
                        <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-sm shadow-cyan-400 animate-ping absolute -top-1" />
                        <span className="w-2 h-2 rounded-full bg-cyan-300 absolute -top-1" />
                      </div>

                      {/* Screen Visor with Animated Blinking Eyes */}
                      <div className="w-14 h-9 rounded-2xl bg-slate-950 border border-cyan-500/50 flex items-center justify-center gap-2.5 shadow-inner">
                        {/* Left Eye with Blink Animation */}
                        <motion.div
                          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                          transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }}
                          className={`rounded-full shadow-sm transition-all duration-300 ${
                            mascotStep === 4 || mascotStep === 3
                              ? "w-3 h-1.5 bg-emerald-400 rounded-t-full"
                              : "w-2.5 h-2.5 bg-cyan-400 shadow-cyan-400"
                          }`}
                        />
                        {/* Right Eye with Blink Animation */}
                        <motion.div
                          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                          transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 0.85, 0.9, 1] }}
                          className={`rounded-full shadow-sm transition-all duration-300 ${
                            mascotStep === 4 || mascotStep === 3
                              ? "w-3 h-1.5 bg-emerald-400 rounded-t-full"
                              : "w-2.5 h-2.5 bg-cyan-400 shadow-cyan-400"
                          }`}
                        />
                      </div>

                      {/* Cute Rosy Cheeks */}
                      <div className="w-12 flex justify-between px-1 mt-0.5">
                        <span className="w-1.5 h-1 rounded-full bg-pink-400/60 blur-[0.5px]" />
                        <span className="w-1.5 h-1 rounded-full bg-pink-400/60 blur-[0.5px]" />
                      </div>
                    </div>

                    {/* Robot Body with Interactive Hands */}
                    <div className="w-16 h-12 rounded-2xl bg-gradient-to-b from-blue-900 to-slate-900 border border-blue-400/50 mt-1 relative flex items-center justify-center shadow-md">
                      
                      {/* Chest Mini Status Hologram */}
                      <div className="w-7 h-5 rounded-lg bg-slate-950 border border-blue-400/40 flex items-center justify-center">
                        <Bot size={12} className="text-cyan-400" />
                      </div>

                      {/* Left Arm: Holds Product (Avocado with QR tag) */}
                      <motion.div
                        animate={
                          mascotStep === 1 || mascotStep === 2
                            ? { x: -14, y: -4, rotate: -20 }
                            : { x: 0, y: 0, rotate: 0 }
                        }
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute -left-4 top-1.5 flex items-center gap-1"
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-cyan-300" />
                        <motion.div
                          animate={mascotStep === 2 ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="p-1 rounded-lg bg-slate-900/90 border border-cyan-400/80 text-[10px] shadow-md flex items-center"
                        >
                          <span>🥑</span>
                          <QrCode size={10} className="text-cyan-300 ml-0.5" />
                        </motion.div>
                      </motion.div>

                      {/* Right Arm: Points towards scanner or gives Thumbs Up */}
                      <motion.div
                        animate={
                          mascotStep === 4
                            ? { x: 4, y: -10, rotate: 25 }
                            : mascotStep === 1 || mascotStep === 2
                            ? { x: -6, y: -2, rotate: -35 }
                            : { x: 0, y: 0, rotate: 0 }
                        }
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute -right-3 top-1.5 flex items-center"
                      >
                        {mascotStep === 4 ? (
                          <span className="text-base animate-bounce">👍</span>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-cyan-300 flex items-center justify-center text-[8px] text-white">
                            👉
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* 🎭 Mascot Dynamic Speech & Action Prompt Box */}
                  <div className="relative z-10 w-full">
                    <AnimatePresence mode="wait">
                      {mascotStep === 0 && (
                        <motion.div
                          key="m0"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="px-3 py-1.5 rounded-xl bg-blue-900/40 border border-blue-400/30 text-[11px] font-bold text-blue-200"
                        >
                          "Hi there! Grab any product QR to scan."
                        </motion.div>
                      )}

                      {mascotStep === 1 && (
                        <motion.div
                          key="m1"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-900/40 border border-cyan-400/40 text-[11px] font-bold text-cyan-200"
                        >
                          "Aim the packaging barcode at the camera 👉"
                        </motion.div>
                      )}

                      {mascotStep === 2 && (
                        <motion.div
                          key="m2"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-900/40 border border-indigo-400/40 text-[11px] font-bold text-indigo-200 flex items-center justify-center gap-1.5"
                        >
                          <Zap size={12} className="text-cyan-400 animate-spin" />
                          <span>"Blue laser scanning QR code..."</span>
                        </motion.div>
                      )}

                      {mascotStep === 3 && (
                        <motion.div
                          key="m3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-400 text-[11px] font-bold text-emerald-300 flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 size={13} className="text-emerald-400" />
                          <span>"✓ QR Verified & Added to Cart!"</span>
                        </motion.div>
                      )}

                      {mascotStep === 4 && (
                        <motion.div
                          key="m4"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-400 text-[11px] font-bold text-emerald-300 flex items-center justify-center gap-1"
                        >
                          <ThumbsUp size={12} className="text-emerald-400" />
                          <span>"Great job! Ready for your next item."</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing State Loader */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-3.5 shadow-sm"
              >
                <RefreshCw size={18} className="text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">{processingMsg || "Scanning QR..."}</h4>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400">Syncing with store shelf inventory...</p>
                </div>
              </motion.div>
            )}

            {/* Scan Success Preview Card (Auto-dismisses) */}
            <AnimatePresence>
              {lastScannedProduct && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-500/10"
                >
                  <div className="flex items-center gap-3.5">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 size={26} />
                    </motion.div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                        ✔ QR Detected & Added to Smart Cart
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lastScannedProduct.name}
                      </h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold font-mono mt-0.5">
                        ₹{Number(lastScannedProduct.price).toFixed(2)} • {lastScannedProduct.category}
                      </p>
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold self-end sm:self-auto shadow-sm">
                    Scanned & Synced
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan Error Toast Card */}
            <AnimatePresence>
              {scanError && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start gap-3"
                >
                  <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Invalid QR Code</h4>
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">{scanError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScanError(null)}
                    className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scanned Items Breakdown (NO quantity buttons, displays Scanned xN) */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[36px] p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Scanned Product List
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Scan the same QR code again to increment item quantity automatically.
                </p>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-14 px-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <ShoppingBag className="mx-auto text-slate-400 dark:text-slate-500 mb-2" size={32} />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No scanned products yet.</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Aim camera at a shelf QR code to begin shopping.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] font-bold">
                      <th className="py-3 px-3">Product</th>
                      <th className="py-3 px-3 text-center">Unit Price</th>
                      <th className="py-3 px-3 text-center">Scanned Count</th>
                      <th className="py-3 px-3 text-right">Subtotal</th>
                      <th className="py-3 px-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cart.map((item) => (
                      <tr key={item.productId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                        {/* Product info */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <Package size={18} className="text-slate-400 dark:text-slate-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                ID: #{item.productId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Unit Price */}
                        <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-300 font-mono font-medium">
                          ₹{Number(item.price).toFixed(2)}
                        </td>

                        {/* Scanned Count (No buttons - incremented by scanning) */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-2xs font-mono">
                            Scanned ×{item.quantity}
                          </span>
                        </td>

                        {/* Subtotal */}
                        <td className="py-3.5 px-3 text-right font-black text-slate-900 dark:text-white text-sm font-mono">
                          ₹{Number(item.price * item.quantity).toFixed(2)}
                        </td>

                        {/* Remove Action */}
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Sticky Self-Checkout Cart Summary */}
        <div className="lg:col-span-4 sticky top-4 space-y-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[36px] p-6 sm:p-7 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 border border-slate-200/80 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25"
                >
                  <ShoppingCart size={18} />
                </motion.div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Self-Checkout Cart
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {totalItemsCount} {totalItemsCount === 1 ? "unit" : "units"} scanned
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                Live QR Sync
              </span>
            </div>

            {/* Cost Details */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>In-Store Taxes (GST):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0.00 (Included)</span>
              </div>
              <div className="flex justify-between">
                <span>Queue Skip Pass:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Active ✓</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Total Payable
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                Instant Online Pay
              </span>
            </div>

            {/* Checkout Button */}
            <motion.button
              type="button"
              disabled={cart.length === 0 || isCheckingOut}
              onClick={handlePayment}
              whileHover={cart.length > 0 && !isCheckingOut ? { scale: 1.015, y: -1 } : {}}
              whileTap={cart.length > 0 && !isCheckingOut ? { scale: 0.98 } : {}}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 pointer-events-none" />

              {isCheckingOut ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Processing Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  <span>Pay ₹{total.toFixed(2)} & Skip Billing Queue</span>
                </>
              )}
            </motion.button>

            {/* 256-bit Security Badge */}
            <div className="pt-2 text-center">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1 font-medium">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>256-bit Encrypted Razorpay Digital Receipt</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
