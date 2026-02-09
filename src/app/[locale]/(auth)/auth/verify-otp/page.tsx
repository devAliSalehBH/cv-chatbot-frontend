"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import { useAlertStore } from "@/store/useAlertStore";
import { setAuthToken, setUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOtpPage() {
  const t = useTranslations("auth.verifyOtp");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlertStore();

  // Get email from URL params or localStorage
  const urlEmail = searchParams.get("email");
  const [email, setEmail] = useState(urlEmail || "");

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Load email from localStorage if not in URL
  useEffect(() => {
    if (!urlEmail) {
      const storedEmail = localStorage.getItem("pending_verification_email");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        // No email found, redirect to signup
        router.replace(`/${locale}/auth/signup`);
      }
    }
  }, [urlEmail, locale, router]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 4) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiPost(
        "/auth/verify-email",
        {
          email: email,
          otp: otp,
        },
        {
          locale: locale,
        },
      );

      // Show success alert
      showAlert(response.data.message, response.data.success !== false);

      // Store token and user profile
      if (response.data.token) {
        setAuthToken(response.data.token);
      }

      if (response.data.user) {
        setUserProfile(response.data.user);
      }

      // Clear pending email
      localStorage.removeItem("pending_verification_email");

      // Redirect to dashboard
      setTimeout(() => {
        router.replace(`/${locale}/dashboard`);
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        showAlert(errorMessage, false);
      }
      setOtp(""); // Clear OTP on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await apiPost(
        "/auth/resend-otp",
        {
          email: email,
        },
        {
          locale: locale,
        },
      );

      // Show success alert
      showAlert(response.data.message, response.data.success !== false);

      // Reset timer
      setCanResend(false);
      setTimer(60);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        showAlert(errorMessage, false);
      }
    }
  };

  return (
    <div className="w-full max-w-120 animate-fade-in-up">
      {/* Logo */}
      <div className="mb-8 flex justify-center lg:justify-start">
        <Image
          src={`/images/logo-${locale}.svg`}
          alt="CV Bot"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-[32px] text-center text-[#111827] mb-8">
        {t("title")}
      </h1>

      {/* Description with email */}
      <p className="text-[16px] text-[#64748B] mb-8 text-center">
        {t("description")}{" "}
        <span className="font-medium text-gray-900">{email}</span>
      </p>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Input using Shadcn Component */}
        <div className="flex justify-center" dir="ltr">
          <InputOTP maxLength={4} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Resend Code */}
        <div className="text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-[#2E87FE] hover:text-blue-700 transition-colors"
            >
              {t("resendNow")}
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              {t("resendCode")} <span className="font-medium">{timer}s</span>
            </p>
          )}
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          disabled={isSubmitting || otp.length !== 4}
          className="w-full h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("verifyButton")}
            </span>
          ) : (
            t("verifyButton")
          )}
        </Button>

        {/* Go Back Link */}
        <p className="text-sm text-center text-gray-600">
          {t("wrongEmail")}{" "}
          <Link
            href={`/${locale}/auth/signup`}
            className="text-[#2E87FE] hover:text-blue-700 font-medium transition-colors"
          >
            {t("goBack")}
          </Link>
        </p>
      </form>
    </div>
  );
}
