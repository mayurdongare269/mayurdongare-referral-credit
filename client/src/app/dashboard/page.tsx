"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";

interface DashboardData {
  referralCode: string;
  credits: number;
  referredUsers: number;
  convertedUsers: number;
  hasPurchased: boolean;
}

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const token = await getToken();
      const response = await fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?r=${data?.referralCode}`;
    navigator.clipboard.writeText(link);
    alert("Referral link copied!");
  };

  const handlePurchase = async () => {
    try {
      const token = await getToken();
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        alert("Purchase successful! You earned 2 credits!");
        fetchDashboard(); // Refresh data
      } else {
        alert(result.error || "Purchase failed");
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-blue-900">Total Credits</h3>
              <p className="text-3xl font-bold text-blue-600">{data?.credits || 0}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-green-900">Referred Users</h3>
              <p className="text-3xl font-bold text-green-600">{data?.referredUsers || 0}</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-purple-900">Converted Users</h3>
              <p className="text-3xl font-bold text-purple-600">{data?.convertedUsers || 0}</p>
            </motion.div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={`${window.location.origin}/?r=${data?.referralCode}`}
                readOnly
                className="flex-1 p-3 border rounded-lg bg-white"
              />
              <button
                onClick={copyReferralLink}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>

          {!data?.hasPurchased && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePurchase}
              className="w-full py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Make Your First Purchase - Earn 2 Credits!
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}