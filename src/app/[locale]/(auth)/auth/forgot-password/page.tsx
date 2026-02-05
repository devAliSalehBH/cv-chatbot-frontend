"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordForm>();

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    try {
      console.log("Forgot password for:", data.email);
      // TODO: Implement API call to send reset email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success dialog
      setShowSuccessDialog(true);

      // Start countdown
      let timeLeft = 60;
      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToLogin = () => {
    router.push(`/${locale}/auth/login`);
  };

  return (
    <div className="w-full max-w-[440px] animate-fade-in-up">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/images/auth/logo.svg"
          alt="CV Bot"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-[28px] font-semibold text-gray-900 mb-3 text-center">
        {t("title")}
      </h1>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-8 text-center">
        {t("description")}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            {t("emailLabel")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            {...register("email", {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            className="h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("emailButton")}
            </span>
          ) : (
            t("emailButton")
          )}
        </Button>

        {/* Remember Password Link */}
        <p className="text-sm text-center text-gray-600">
          {t("rememberPassword")}{" "}
          <Link
            href={`/${locale}/auth/login`}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t("loginLink")}
          </Link>
        </p>
      </form>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("successTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 pt-2">
              {t("successMessage")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            {/* Countdown */}
            <p className="text-sm text-center text-gray-600">
              {t("resentIn")} {countdown} sec
            </p>

            {/* Return to Login Button */}
            <Button
              onClick={handleReturnToLogin}
              className="w-full h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-lg"
            >
              {t("returnToLogin")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
