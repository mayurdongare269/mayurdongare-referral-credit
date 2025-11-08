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
    // Suppress Clerk development warning in console
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.('Clerk has been loaded with development keys')) {
        return; // Suppress this specific warning
      }
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    // Only create profile if user just signed up, don't auto-redirect
    if (isLoaded && user && !isCreatingProfile) {
      const hasCreatedProfile = sessionStorage.getItem('profileCreated');
      if (!hasCreatedProfile) {
        createUserProfile();
      }
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

      sessionStorage.setItem('profileCreated', 'true');
      // Don't auto-redirect, let user explore
    } catch (error) {
      console.error("Failed to create profile:", error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Eye-catching */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(229 231 235) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              50,000+ Active Learners
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              Learn. Share.
              <br />
              <span className="bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                Earn Rewards.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              The only learning platform that rewards you for sharing knowledge.
              <br />
              <span className="font-semibold text-gray-900">Earn 2-4 credits</span> on every course purchase.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/courses")}
                className="group px-10 py-5 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-2xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Learning Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById("how-it-works");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-10 py-5 border-2 border-gray-900 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                See How It Works
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats - More Impressive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-4 gap-6 mb-24 max-w-5xl mx-auto"
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-lg"
        >
          <div className="text-5xl font-black text-gray-900 mb-2">50K+</div>
          <div className="text-gray-600 font-medium">Active Learners</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-lg"
        >
          <div className="text-5xl font-black text-gray-900 mb-2">12</div>
          <div className="text-gray-600 font-medium">Expert Courses</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-lg"
        >
          <div className="text-5xl font-black text-gray-900 mb-2">$10K+</div>
          <div className="text-gray-600 font-medium">Credits Earned</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-lg"
        >
          <div className="text-5xl font-black text-gray-900 mb-2">4.8★</div>
          <div className="text-gray-600 font-medium">Average Rating</div>
        </motion.div>
      </motion.div>

      {/* Features Grid - More Impressive */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          className="bg-white rounded-3xl p-10 border border-gray-200 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900 rounded-full -mr-16 -mt-16 opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🎓</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert-Led Courses</h3>
            <p className="text-gray-600 leading-relaxed">
              Learn from industry professionals with real-world experience. Get practical skills that matter.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          className="bg-white rounded-3xl p-10 border border-gray-200 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900 rounded-full -mr-16 -mt-16 opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🔗</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Earn While Learning</h3>
            <p className="text-gray-600 leading-relaxed">
              Share courses with friends and earn 2 credits per referral. Everyone wins together.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          className="bg-white rounded-3xl p-10 border border-gray-200 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900 rounded-full -mr-16 -mt-16 opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-4xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Learn Your Way</h3>
            <p className="text-gray-600 leading-relaxed">
              Access courses anytime, anywhere. Learn at your own pace with lifetime access.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Value Proposition - Eye-catching */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 rounded-3xl p-12 md:p-16 text-white mb-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-5 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full opacity-5 -ml-48 -mb-48"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Why Choose EduShare?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            We're not just another learning platform. We reward you for growing together.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-black mb-3">2-4</div>
              <div className="text-gray-300">Credits per purchase</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black mb-3">∞</div>
              <div className="text-gray-300">Unlimited referrals</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black mb-3">100%</div>
              <div className="text-gray-300">Free to join</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works - Enhanced Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        id="how-it-works"
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Start earning credits in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Create Your Account</h4>
                <p className="text-gray-600 mb-4">
                  Sign up in seconds with your email. No credit card required. Get instant access to your personalized dashboard and unique referral link.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free forever</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-3 text-xl">Share Your Link</h4>
                <p className="text-gray-600 mb-4">
                  Copy your unique referral link and share it with friends, family, or on social media. Anyone who signs up using your link becomes your referral.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Unlimited referrals</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-3 text-xl">They Purchase a Course</h4>
                <p className="text-gray-600 mb-4">
                  When your referral makes their first course purchase, the magic happens! They earn 4 credits (2 for purchase + 2 referral bonus).
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>First purchase only</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-3 text-xl">You Earn Credits Too!</h4>
                <p className="text-gray-600 mb-4">
                  Automatically receive 2 credits when your referral makes their first purchase. Track all your earnings in your dashboard in real-time.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Instant rewards</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Credit Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gray-900 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Credit Breakdown</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-sm opacity-90">Credits for your first purchase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4</div>
              <div className="text-sm opacity-90">Credits if you were referred (2+2 bonus)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-sm opacity-90">Credits per successful referral</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-20"
      >
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Learners Say
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-sm text-gray-500">Web Developer</div>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600">
              "The referral system is genius! I've earned 12 credits just by sharing courses with my friends. The courses are top-notch too!"
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Michael Chen</div>
                <div className="text-sm text-gray-500">Product Manager</div>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600">
              "Best investment in my career. The courses are practical, and earning credits while learning makes it even better!"
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                E
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                <div className="text-sm text-gray-500">UX Designer</div>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600">
              "Love the platform! Clean interface, great content, and the referral program is a nice bonus. Highly recommend!"
            </p>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-20 max-w-3xl mx-auto"
      >
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <details className="bg-white rounded-xl p-6 border border-gray-200">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              How do I earn credits?
            </summary>
            <p className="mt-3 text-gray-600">
              You earn 2 credits for your first course purchase. If you signed up using a referral link, you get 4 credits (2 + 2 bonus). You also earn 2 credits every time someone you referred makes their first purchase.
            </p>
          </details>

          <details className="bg-white rounded-xl p-6 border border-gray-200">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I refer multiple people?
            </summary>
            <p className="mt-3 text-gray-600">
              Yes! You can refer unlimited people. Each person who makes a purchase earns you 2 credits. The more you share, the more you earn.
            </p>
          </details>

          <details className="bg-white rounded-xl p-6 border border-gray-200">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Do credits expire?
            </summary>
            <p className="mt-3 text-gray-600">
              No, credits never expire. They stay in your account forever and can be used for future course purchases or discounts.
            </p>
          </details>

          <details className="bg-white rounded-xl p-6 border border-gray-200">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What if my friend doesn't use my referral link?
            </summary>
            <p className="mt-3 text-gray-600">
              The referral link must be used during sign-up to track the referral. Make sure your friend clicks your link before creating their account.
            </p>
          </details>
        </div>
      </motion.div>

      {/* Final CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="text-center mt-20 bg-gray-900 rounded-2xl p-12 text-white"
      >
        <h3 className="text-4xl font-bold mb-4">
          Ready to Start Learning?
        </h3>
        <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
          Join thousands of learners, earn credits by sharing, and advance your career with expert-led courses.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/courses")}
          className="px-10 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
        >
          Get Started Free →
        </motion.button>
        <p className="mt-4 text-sm text-gray-400">
          No credit card required • Free forever • Cancel anytime
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold">EduShare</span>
              </div>
              <p className="text-gray-400 text-sm">
                Learn together, earn together. The best online learning platform with rewards.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/courses" className="hover:text-white transition-colors">Browse Courses</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 EduShare. All rights reserved. Built for FileSure Internship.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}