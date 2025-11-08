"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseName: string;
  price: number;
  isFirstPurchase?: boolean;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  courseName,
  price,
  isFirstPurchase = true,
}: PurchaseModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Purchase
                </h2>
                <p className="text-gray-600">
                  You're about to purchase <span className="font-semibold">{courseName}</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Course Price</span>
                  <span className="text-xl font-bold text-gray-900">${price}</span>
                </div>
                {isFirstPurchase ? (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium">You'll Earn</span>
                    <span className="text-lg font-bold">+2 Credits</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="text-sm">Credits earned on first purchase only</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
