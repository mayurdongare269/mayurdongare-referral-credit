"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !isCreatingProfile) {
      createUserProfile();
    }
  }, [user, isLoaded]);

  const createUserProfile = async () => {
    setIsCreatingProfile(true);
    try {
      const referralParam = searchParams.get("r");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      await axios.post(`${API_URL}/api/profile`, {
        clerkUserId: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName || user?.firstName || "User",
        referralParam,
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create profile:", error);
      setIsCreatingProfile(false);
    }
  };

  if (!isLoaded || (user && isCreatingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Together,{" "}
            <span className="text-gray-600">
              Earn Together
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of learners. Share courses with friends and earn credits. 
            Get 2 credits for your first purchase and 2 credits for each successful referral.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all">
              Browse Courses
            </button>
            <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all">
              How It Works
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">50,000+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">12+</div>
            <div className="text-gray-600">Expert Courses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">$10k+</div>
            <div className="text-gray-600">Credits Earned</div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
          >
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🎓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Expert-Led Courses</h3>
            <p className="text-gray-600">
              Learn from industry professionals with real-world experience and proven track records.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
          >
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">🔗</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Referral Rewards</h3>
            <p className="text-gray-600">
              Share courses with friends and earn credits for every successful referral purchase.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
          >
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Learning</h3>
            <p className="text-gray-600">
              Access courses anytime, anywhere. Learn at your own pace with lifetime access.
            </p>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="how-it-works"
          className="bg-gray-50 rounded-2xl p-10 max-w-4xl mx-auto border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Create Account</h4>
                <p className="text-gray-600">
                  Sign up in seconds and get your unique referral link instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Share with Friends</h4>
                <p className="text-gray-600">
                  Send your referral link to friends who want to learn new skills.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">They Purchase</h4>
                <p className="text-gray-600">
                  When your friend buys their first course, you both earn 2 credits.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Track & Earn</h4>
                <p className="text-gray-600">
                  Monitor your referrals and watch your credits grow in real-time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of learners and start earning credits today
          </p>
          <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all">
            Get Started Free
          </button>
        </motion.div>
      </div>
    </div>
  );
}