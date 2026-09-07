"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Edit3,
  AlertCircle,
  Sparkles,
  X,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Camera,
  Upload,
  RefreshCw,
  Clock,
  Check,
  Save,
  Activity,
  ShoppingBag,
  Zap,
} from "lucide-react";
import api from "@/lib/axios";

export default function CustomerProfilePage() {
  // Profile Data & Loading States
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Global Toast State
  const [toast, setToast] = useState({
    type: "", // 'success' | 'error'
    message: "",
  });

  // Inline Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "Male",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const pwd = passwordData.newPassword;
    if (!pwd) return { score: 0, label: "", color: "" };

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
  }, [passwordData.newPassword]);

  // Passwords match check
  const passwordsMatch = useMemo(() => {
    if (!passwordData.confirmPassword) return null;
    return passwordData.newPassword === passwordData.confirmPassword;
  }, [passwordData.newPassword, passwordData.confirmPassword]);

  // Profile Completion Percentage
  const completionPercentage = useMemo(() => {
    if (!profile) return 0;
    let completed = 0;
    const total = 5;
    if (profile.firstName) completed += 1;
    if (profile.lastName) completed += 1;
    if (profile.email) completed += 1;
    if (profile.phone) completed += 1;
    if (profile.profileImage || profile.image) completed += 1;
    return Math.round((completed / total) * 100);
  }, [profile]);

  // ==========================================
  // Fetch Profile API
  // ==========================================
  const fetchProfile = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError(null);

      let response;
      try {
        response = await api.get("/userapi/profile");
      } catch (err) {
        response = await api.get("/auth/profile");
      }

      const userData = response.data?.user || response.data?.data || null;
      setProfile(userData);

      if (userData) {
        setEditFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          gender: userData.gender || "Male",
        });
        setImagePreview(userData.profileImage || userData.image || "");

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (err) {
      console.error("Error fetching customer profile:", err);
      setError(err.response?.data?.message || "Failed to load profile details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Listen for Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isPasswordModalOpen) setIsPasswordModalOpen(false);
        if (isEditing) handleCancelEdit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPasswordModalOpen, isEditing]);

  // ==========================================
  // Profile Update Handlers
  // ==========================================
  const handleStartEdit = () => {
    if (profile) {
      setEditFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        gender: profile.gender || "Male",
      });
      setImagePreview(profile.profileImage || profile.image || "");
      setImageFile(null);
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(profile?.profileImage || profile?.image || "");
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!editFormData.firstName.trim()) {
      setToast({ type: "error", message: "First name is required." });
      return;
    }

    try {
      setSavingProfile(true);

      const formData = new FormData();
      formData.append("firstName", editFormData.firstName.trim());
      formData.append("lastName", editFormData.lastName.trim());
      formData.append("phone", editFormData.phone.trim());
      formData.append("gender", editFormData.gender);

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      let res;
      try {
        res = await api.put("/userapi/updateprofile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        res = await api.put("/auth/updateprofile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setToast({
        type: "success",
        message: res.data?.message || "Profile updated successfully!",
      });

      setIsEditing(false);
      await fetchProfile(true);

      setTimeout(() => setToast({ type: "", message: "" }), 4000);
    } catch (err) {
      console.error("Error updating customer profile:", err);
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile",
      });
      setTimeout(() => setToast({ type: "", message: "" }), 4000);
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // Change Password Handlers
  // ==========================================
  const handleOpenPasswordModal = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess(false);
    setIsPasswordModalOpen(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and Confirm password do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      let res;
      try {
        res = await api.put("/userapi/change-password", {
          oldPassword,
          newPassword,
          confirmPassword,
        });
      } catch (err) {
        res = await api.put("/auth/change-password", {
          oldPassword,
          newPassword,
          confirmPassword,
        });
      }

      setPasswordSuccess(true);
      setToast({
        type: "success",
        message: res.data?.message || "Password changed successfully!",
      });

      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }, 1000);

      setTimeout(() => setToast({ type: "", message: "" }), 4000);
    } catch (err) {
      console.error("Error changing customer password:", err);
      setPasswordError(
        err.response?.data?.message ||
        "Failed to change password. Please check your current password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // Helper date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "Active customer";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fullName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : "Customer User";
  const initial = fullName.charAt(0).toUpperCase() || "C";
  const displayImage = imagePreview || profile?.profileImage || profile?.image;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Toast Alert Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className={`p-4 rounded-2xl flex items-center justify-between shadow-lg border ${toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10"
                : "bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10"
              }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" ? (
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast({ type: "", message: "" })}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
            Loading customer profile...
          </p>
        </div>
      )}

      {/* API Error State */}
      {!loading && error && (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-3xl text-rose-800 dark:text-rose-200 flex items-start gap-4">
          <AlertCircle size={24} className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold">Failed to load profile details</h3>
            <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{error}</p>
            <button
              type="button"
              onClick={() => fetchProfile(true)}
              className="mt-3 text-xs font-bold bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Profile Hero Header Banner (Animated SaaS Gradient)       */}
      {/* ========================================================= */}
      {!loading && !error && profile && (
        <>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white border border-slate-800 shadow-xl shadow-blue-950/10">
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 -mb-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge & Live Refresh */}
            <div className="p-6 sm:p-8 pb-4 flex items-center justify-between relative z-10 border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200">
                <Sparkles size={13} className="text-blue-400" />
                <span>Verified Shopper Profile</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Session</span>
                </span>

                <button
                  type="button"
                  onClick={() => fetchProfile(true)}
                  disabled={refreshing}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer border border-white/10"
                  title="Refresh profile data"
                >
                  <RefreshCw size={15} className={refreshing ? "animate-spin text-blue-400" : ""} />
                </button>
              </div>
            </div>

            {/* Profile Avatar & Identity Card */}
            <div className="p-6 sm:p-8 pt-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Large Avatar with Hover Upload trigger */}
                <div className="relative group self-start sm:self-auto">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl shadow-blue-500/30 overflow-hidden border-4 border-white/20 ring-4 ring-black/20"
                  >
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </motion.div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {/* Camera overlay trigger button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditing) setIsEditing(true);
                      fileInputRef.current?.click();
                    }}
                    className="absolute bottom-0 right-0 p-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-slate-900 transition-transform duration-200 hover:scale-110 cursor-pointer"
                    title="Change profile picture"
                  >
                    <Camera size={15} />
                  </button>
                </div>

                {/* Name, Email, Role */}
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {fullName}
                    </h1>
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] px-3 py-0.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
                      <ShieldCheck size={13} /> {profile.role || "Customer"}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1">
                    {profile.email}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-400" />
                      <span>Member since {formatDate(profile.createdAt)}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-emerald-400" />
                      <span>Verified Shopper</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                      <Edit3 size={16} />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenPasswordModal}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer border border-white/15 backdrop-blur-md hover:-translate-y-0.5"
                    >
                      <KeyRound size={16} />
                      <span>Change Password</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer border border-white/15"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-600/30 disabled:opacity-50 hover:-translate-y-0.5"
                    >
                      {savingProfile ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Account Summary Stats Bar                                 */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Profile Completion
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  <CountUp end={completionPercentage} duration={1} />%
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold text-xs">
                  {completionPercentage === 100 ? "Complete" : "Good"}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Account Status
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 truncate">
                Full In-Store Shopping Privileges
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Assigned Role
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                  {profile.role || "Customer"}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  Shopper
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 truncate">
                QR Instant Checkout Access
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Security Standard
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck size={24} className="text-blue-600 dark:text-blue-400" />
                  JWT Auth
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-bold text-xs">
                  Secure
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 truncate">
                HttpOnly Token Protected
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Profile Information (Transformable Cards / Form)          */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User size={20} className="text-blue-600 dark:text-blue-400" />
                  <span>Personal & Contact Credentials</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEditing
                    ? "Update your profile details below and click Save Changes."
                    : "Your contact details and shopper identity credentials."}
                </p>
              </div>

              {isEditing && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold self-start">
                  <Edit3 size={13} />
                  <span>Editing Mode Active</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. First Name */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 transition group shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    First Name
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleProfileInputChange}
                      required
                      placeholder="Enter first name"
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 outline-none px-3.5 py-2 transition"
                    />
                  ) : (
                    <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profile.firstName || "N/A"}
                    </p>
                  )}
                </div>

                {/* 2. Last Name */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 transition group shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Last Name
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleProfileInputChange}
                      placeholder="Enter last name"
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 outline-none px-3.5 py-2 transition"
                    />
                  ) : (
                    <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profile.lastName || "N/A"}
                    </p>
                  )}
                </div>

                {/* 3. Email Address (Protected) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> Email Address
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Protected</span>
                  </span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 truncate">
                    {profile.email || "N/A"}
                  </p>
                </div>

                {/* 4. Phone Number */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 transition group shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Phone size={12} /> Phone Number
                  </span>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleProfileInputChange}
                      placeholder="9876543210"
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 outline-none px-3.5 py-2 transition"
                    />
                  ) : (
                    <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profile.phone || "Not Provided"}
                    </p>
                  )}
                </div>

                {/* 5. Gender */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 transition group shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Gender
                  </span>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editFormData.gender}
                      onChange={handleProfileInputChange}
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 outline-none px-3.5 py-2 transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-base font-bold text-slate-900 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profile.gender || "Male"}
                    </p>
                  )}
                </div>

                {/* 6. Account Created Date */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Calendar size={12} /> Registration Date
                  </span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>

              {/* Bottom Actions if Editing */}
              {isEditing && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={savingProfile}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* ========================================================= */}
          {/* Security & Access Overview Section                        */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span>Security & Account Protection</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Overview of authentication protocols, in-store permissions, and credential security.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Lock size={16} />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Encrypted Password</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Bcrypt salted hash stored securely on database
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <CheckCircle2 size={16} />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Email Verified</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  OTP authenticated customer account email
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                  <Activity size={16} />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">QR Self-Checkout</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Instant scan, pay online, and skip billing queue privileges
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* Change Password Animated Glass Modal                      */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsPasswordModalOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800 p-6 sm:p-7"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Update your account password</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, oldPassword: e.target.value }))
                      }
                      required
                      placeholder="Enter current password"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 outline-none pl-3.5 pr-10 py-2.5 transition"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowOldPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                      }
                      required
                      placeholder="Enter new password (min 6 characters)"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 outline-none pl-3.5 pr-10 py-2.5 transition"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {passwordData.newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Strength:</span>
                        <span className={`font-bold ${passwordStrength.text}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"
                            }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"
                            }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"
                            }`}
                        />
                        <div
                          className={`h-full rounded-full transition-all ${passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"
                            }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                      placeholder="Confirm new password"
                      className={`w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium rounded-xl border outline-none pl-3.5 pr-10 py-2.5 transition ${passwordsMatch === false
                          ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                          : passwordsMatch === true
                            ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                            : "border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                        }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Match Indicator */}
                  {passwordsMatch === false && (
                    <p className="text-rose-600 dark:text-rose-400 text-[11px] font-medium mt-1">
                      Passwords do not match.
                    </p>
                  )}
                  {passwordsMatch === true && (
                    <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                      <Check size={12} /> Passwords match!
                    </p>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    disabled={changingPassword}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={changingPassword || passwordsMatch === false}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
                  >
                    {changingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : passwordSuccess ? (
                      <>
                        <Check size={16} />
                        <span>Updated!</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
