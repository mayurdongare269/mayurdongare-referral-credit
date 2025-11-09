"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import DashboardCard from "@/components/DashboardCard";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DashboardData {
  referralCode: string;
  credits: number;
  referredUsers: number;
  convertedUsers: number;
  hasPurchased: boolean;
}

interface PurchasedCourse {
  _id: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  creditsEarned: number;
  purchaseDate: string;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    } else if (user) {
      fetchDashboard();
    }
  }, [user, isLoaded]);

  const fetchDashboard = async () => {
    try {
      console.log("📊 Fetching dashboard data from:", API_URL);
      const token = await getToken();
      
      if (!token) {
        console.error("❌ No authentication token available");
        setLoading(false);
        return;
      }

      console.log("✅ Token obtained, making API calls...");

      const [dashboardResponse, purchasesResponse] = await Promise.all([
        axios.get(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      
      console.log("📥 Dashboard response:", dashboardResponse.data);
      
      if (dashboardResponse.data.success) {
        console.log("✅ Setting dashboard data:", dashboardResponse.data.data);
        setData(dashboardResponse.data.data);
      }

      if (purchasesResponse.data.success) {
        console.log("✅ Setting purchases:", purchasesResponse.data.data);
        setPurchasedCourses(purchasesResponse.data.data);
      }
    } catch (error: any) {
      console.error("❌ Failed to fetch dashboard:", error);
      console.error("Error details:", error.response?.data);
      
      // If user not found, try to create profile first
      if (error.response?.status === 404) {
        console.log("👤 User not found, creating profile...");
        await createUserProfile();
        // Retry fetching dashboard
        setTimeout(() => fetchDashboard(), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async () => {
    try {
      console.log("👤 Creating user profile...");
      const profileData = {
        clerkUserId: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName || user?.firstName || "User",
        referralParam: null,
      };
      console.log("📤 Profile data:", profileData);
      
      const response = await axios.post(`${API_URL}/api/profile`, profileData);
      console.log("✅ Profile created:", response.data);
    } catch (error: any) {
      console.error("❌ Failed to create profile:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const copyReferralLink = () => {
    if (!data?.referralCode) {
      alert("Referral code not loaded yet. Please wait...");
      return;
    }
    const link = `${window.location.origin}/?r=${data.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = () => {
    if (!data?.referralCode) {
      alert("Referral code not loaded yet. Please wait...");
      return;
    }
    const link = `${window.location.origin}/?r=${data.referralCode}`;
    const text = `Join me on ReferralHub and earn credits! Use my referral link: ${link}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Join ReferralHub",
        text: text,
        url: link,
      });
    } else {
      copyReferralLink();
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-gray-600 text-lg">
              Track your referrals and credits in one place
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Credits"
              value={data?.credits || 0}
              icon={<span className="text-2xl">💰</span>}
              color="gray"
              delay={0.1}
            />
            <DashboardCard
              title="Referred Users"
              value={data?.referredUsers || 0}
              icon={<span className="text-2xl">👥</span>}
              color="gray"
              delay={0.2}
            />
            <DashboardCard
              title="Converted Users"
              value={data?.convertedUsers || 0}
              icon={<span className="text-2xl">✅</span>}
              color="gray"
              delay={0.3}
            />
            <DashboardCard
              title="Conversion Rate"
              value={
                data?.referredUsers
                  ? `${Math.round((data.convertedUsers / data.referredUsers) * 100)}%`
                  : "0%"
              }
              icon={<span className="text-2xl">📈</span>}
              color="gray"
              delay={0.4}
            />
          </div>

          {/* Referral Link Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Referral Link
                </h2>
                <p className="text-gray-600">
                  Share this link with friends to earn credits
                </p>
              </div>
              <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-3xl">🔗</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={data?.referralCode ? `${window.location.origin}/?r=${data.referralCode}` : "Loading..."}
                  readOnly
                  className="flex-1 p-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-mono text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyReferralLink}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareReferralLink}
                  className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Share
                </motion.button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">How Referrals Work:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>You earn 2 credits per successful referral</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Your friend earns 4 credits (2 + 2 bonus)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Credits awarded on first purchase only</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Referral Performance Chart - Circular Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 mb-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Referral Performance</h3>
            
            {/* Circular Progress Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Conversion Rate Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-32 h-32">
                  {/* Background Circle */}
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient-green)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 352" }}
                      animate={{ 
                        strokeDasharray: `${(data?.referredUsers ? (data.convertedUsers / data.referredUsers) * 352 : 0)} 352`
                      }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {data?.referredUsers ? Math.round((data.convertedUsers / data.referredUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-gray-900">Conversion</div>
                  <div className="text-xs text-gray-500">Rate</div>
                </div>
              </motion.div>

              {/* Referred Users Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient-blue)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 352" }}
                      animate={{ 
                        strokeDasharray: `${Math.min((data?.referredUsers || 0) * 35.2, 352)} 352`
                      }}
                      transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {data?.referredUsers || 0}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-gray-900">Referred</div>
                  <div className="text-xs text-gray-500">Users</div>
                </div>
              </motion.div>

              {/* Total Credits Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient-purple)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 352" }}
                      animate={{ 
                        strokeDasharray: `${Math.min((data?.credits || 0) * 17.6, 352)} 352`
                      }}
                      transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {data?.credits || 0}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-gray-900">Total</div>
                  <div className="text-xs text-gray-500">Credits</div>
                </div>
              </motion.div>

              {/* Courses Purchased Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient-orange)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 352" }}
                      animate={{ 
                        strokeDasharray: `${Math.min(purchasedCourses.length * 29.3, 352)} 352`
                      }}
                      transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {purchasedCourses.length}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-gray-900">Courses</div>
                  <div className="text-xs text-gray-500">Purchased</div>
                </div>
              </motion.div>
            </div>

            {/* Stats Cards with Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-green-700">{data?.convertedUsers || 0}</div>
                <div className="text-xs text-green-600 font-medium">Converted</div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-blue-700">{data?.referredUsers || 0}</div>
                <div className="text-xs text-blue-600 font-medium">Referred</div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-purple-700">{data?.credits || 0}</div>
                <div className="text-xs text-purple-600 font-medium">Credits</div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-orange-700">{purchasedCourses.length}</div>
                <div className="text-xs text-orange-600 font-medium">Courses</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Referral Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Tips to Maximize Your Earnings</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Share on Social Media</div>
                <p className="text-gray-600">Post your link on LinkedIn, Twitter, or Facebook to reach more people.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Email Your Network</div>
                <p className="text-gray-600">Send personalized emails to friends and colleagues who might be interested.</p>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Join Communities</div>
                <p className="text-gray-600">Share in relevant online communities, forums, or Slack groups.</p>
              </div>
            </div>
          </motion.div>

          {/* Referral Activity */}
          {data && data.referredUsers > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-8 border border-gray-200 mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Referral Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Total Referrals</div>
                      <div className="text-sm text-gray-500">{data.referredUsers} people signed up</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.referredUsers}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Converted</div>
                      <div className="text-sm text-gray-500">{data.convertedUsers} made purchases</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.convertedUsers}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Credits Earned</div>
                      <div className="text-sm text-gray-500">From referrals</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.convertedUsers * 2}</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center mb-8 border border-gray-200"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Referrals Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start sharing your referral link to earn credits! Every successful referral earns you 2 credits.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyReferralLink}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
              >
                Copy Referral Link
              </motion.button>
            </motion.div>
          )}

          {/* Purchased Courses Section */}
          {purchasedCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-8 border border-gray-200 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">My Purchased Courses</h3>
                  <p className="text-gray-600">
                    You have purchased {purchasedCourses.length} {purchasedCourses.length === 1 ? 'course' : 'courses'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
              </div>

              <div className="space-y-4">
                {purchasedCourses.map((purchase, index) => (
                  <motion.div
                    key={purchase._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate">
                          {purchase.courseTitle}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="font-medium">${purchase.coursePrice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {purchase.creditsEarned > 0 && (
                        <div className="text-right">
                          <div className="text-green-600 font-bold text-lg">
                            +{purchase.creditsEarned}
                          </div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
                      >
                        View Course
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gray-900 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-3">Browse Courses</h3>
              <p className="mb-6 opacity-90">
                Explore our collection of 12 expert-led courses across 6 categories.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/courses")}
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                View Courses →
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white rounded-2xl p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {data?.hasPurchased ? "Purchase Complete! 🎉" : "Make Your First Purchase"}
              </h3>
              <p className="text-gray-600 mb-6">
                {data?.hasPurchased
                  ? "You've earned your purchase credits. Keep referring to earn more!"
                  : "Purchase your first course and earn 2 credits instantly!"}
              </p>
              {!data?.hasPurchased && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/courses")}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
                >
                  Browse Courses →
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}