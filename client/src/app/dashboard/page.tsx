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

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
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
      const token = await getToken();
      
      if (!token) {
        console.error("No authentication token available");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard:", error);
      
      // If user not found, try to create profile first
      if (error.response?.status === 404) {
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
      await axios.post(`${API_URL}/api/profile`, {
        clerkUserId: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName || user?.firstName || "User",
        referralParam: null,
      });
    } catch (error) {
      console.error("Failed to create profile:", error);
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

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Earn 2 credits per referral</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Your friend earns 2 credits</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span>
                <span>Credits on first purchase only</span>
              </div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-900 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-3">Browse Courses</h3>
              <p className="mb-6 opacity-90">
                Explore our collection of expert-led courses and start learning today.
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
              transition={{ delay: 0.7 }}
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