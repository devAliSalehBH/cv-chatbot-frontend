"use client";

import { useEffect } from "react";
import { useAlertStore } from "@/store/useAlertStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useLocale } from "next-intl";

export default function GlobalAlert() {
  const { show, message, type, hideAlert } = useAlertStore();
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, hideAlert]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? 100 : -100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-20 z-[9999] w-[350px] ${
            isRTL ? "right-5" : "left-5"
          }`}
        >
          <div
            className={`flex items-center justify-between gap-2 rounded-lg shadow-2xl ${
              type === "success" ? "bg-green-600" : "bg-red-600"
            } p-0 overflow-hidden`}
          >
            {/* Icon Section */}
            <div
              className={`flex items-center justify-center w-14 h-14 ${
                type === "success" ? "bg-green-700" : "bg-red-700"
              }`}
            >
              {type === "success" ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>

            {/* Message Section */}
            <p className="flex-1 text-sm text-white font-medium px-3">
              {message}
            </p>

            {/* Close Button */}
            <button
              onClick={hideAlert}
              className="mr-2 p-1 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
