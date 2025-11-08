"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              EduShare
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Courses
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              How It Works
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
