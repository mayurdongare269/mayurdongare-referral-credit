"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import PurchaseModal from "@/components/PurchaseModal";
import axios from "axios";
import { courses, categories, Course } from "@/data/courses";

export default function CoursesPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (isLoaded && user) {
      checkPurchaseStatus();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const checkPurchaseStatus = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        console.error("No authentication token available");
        setLoading(false);
        return;
      }

      const [dashboardResponse, purchasesResponse] = await Promise.all([
        axios.get(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      
      if (dashboardResponse.data.success) {
        setHasPurchased(dashboardResponse.data.data.hasPurchased);
      }

      if (purchasesResponse.data.success) {
        const purchasedIds = purchasesResponse.data.data.map((p: any) => p.courseId);
        setPurchasedCourseIds(purchasedIds);
      }
    } catch (error: any) {
      console.error("Failed to check purchase status:", error);
      
      // If user not found, try to create profile first
      if (error.response?.status === 404) {
        await createUserProfile();
        // Retry checking status
        setTimeout(() => checkPurchaseStatus(), 1000);
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

  const handlePurchaseClick = (course: Course) => {
    if (!user) {
      // Redirect to sign in if not logged in
      alert("Please sign in to purchase courses and earn credits!");
      router.push("/");
      return;
    }
    
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === "All Courses" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConfirmPurchase = async () => {
    if (!selectedCourse) return;

    try {
      const token = await getToken();
      
      if (!token) {
        alert("Authentication error. Please sign in again.");
        setIsModalOpen(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/purchase`,
        {
          courseId: selectedCourse.id,
          courseTitle: selectedCourse.title,
          coursePrice: selectedCourse.price
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsModalOpen(false);
        
        // Update purchase status if it was first purchase
        if (response.data.creditsEarned > 0) {
          setHasPurchased(true);
        }
        
        // Show success message with credits earned
        const creditsEarned = response.data.creditsEarned || 0;
        const message = response.data.message || `Purchase successful!`;
        
        setTimeout(() => {
          alert(`🎉 ${message}`);
          router.push("/dashboard");
        }, 300);
      }
    } catch (error: any) {
      console.error("Purchase failed:", error);
      const errorMessage = error.response?.data?.error || "Purchase failed. Please try again.";
      alert(errorMessage);
      setIsModalOpen(false);
    }
  };

  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Explore Our Course Library
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {user && !hasPurchased
              ? "Make your first purchase and earn 2 credits instantly!"
              : "Learn from industry experts and advance your career"}
          </p>
        </motion.div>

        {/* First Purchase Banner */}
        {user && !hasPurchased && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-2xl p-6 mb-12 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">First Purchase Bonus!</h3>
                  <p className="opacity-90">
                    Earn 2 credits on your first course purchase
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">+2</div>
                <div className="text-sm opacity-90">Credits</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Course Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              price={course.price}
              image={course.image}
              onPurchase={() => handlePurchaseClick(course)}
              delay={0.05 * (index + 1)}
              level={course.level}
              duration={course.duration}
              students={course.students}
              rating={course.rating}
              isPurchased={purchasedCourseIds.includes(course.id)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-2xl text-gray-400 mb-4">No courses found</p>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Courses?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl mb-2">🎓</div>
                <h4 className="font-semibold text-gray-900 mb-1">Expert Instructors</h4>
                <p className="text-sm text-gray-600">
                  Learn from industry professionals
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">⏰</div>
                <h4 className="font-semibold text-gray-900 mb-1">Lifetime Access</h4>
                <p className="text-sm text-gray-600">
                  Learn at your own pace, anytime
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">📜</div>
                <h4 className="font-semibold text-gray-900 mb-1">Certificate</h4>
                <p className="text-sm text-gray-600">
                  Get certified upon completion
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {selectedCourse && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmPurchase}
          courseName={selectedCourse.title}
          price={selectedCourse.price}
          isFirstPurchase={!hasPurchased}
        />
      )}
    </div>
  );
}
