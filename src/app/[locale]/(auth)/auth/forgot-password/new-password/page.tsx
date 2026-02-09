"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  getValidationPatterns,
  getPasswordMatchValidator,
} from "@/lib/validationRules";
import { apiPost } from "@/lib/api";
import { useAlertStore } from "@/store/useAlertStore";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const tValidation = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { showAlert } = useAlertStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationPatterns = getValidationPatterns(tValidation);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>({
    mode: "onBlur",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: ResetPasswordForm) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      return;
    }

    // Validate password length
    if (data.password.length < 8) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Call reset password API with custom token
      const response = await apiPost(
        "/auth/reset-password",
        {
          password: data.password,
          password_confirmation: data.confirmPassword,
        },
        {
          locale: locale,
          token: token, // Use token from URL
        },
      );

      // Show message from backend using success flag
      showAlert(response.data.message, response.data.success !== false);

      // Redirect to login after 2 seconds if successful
      if (response.data.success !== false) {
        setTimeout(() => {
          router.replace(`/${locale}/auth/login`);
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        showAlert(errorMessage, false);
      }
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            {t("passwordLabel")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              {...register("password", {
                required: validationPatterns.required.message,
                minLength: {
                  value: validationPatterns.minLength8.value,
                  message: validationPatterns.minLength8.message,
                },
              })}
              className="h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            {t("confirmPasswordLabel")}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              {...register("confirmPassword", {
                required: validationPatterns.required.message,
                ...getPasswordMatchValidator(tValidation, password),
              })}
              className="h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword ||
            password.length < 8
          }
          className="w-full h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("resetButton")}
            </span>
          ) : (
            t("resetButton")
          )}
        </Button>
      </form>
    </div>
  );
}
