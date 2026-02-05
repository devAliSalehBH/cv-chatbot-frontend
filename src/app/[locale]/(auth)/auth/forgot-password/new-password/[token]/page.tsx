"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const t = useTranslations("auth.resetPassword");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>();

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
      console.log("Reset password with token:", token);
      console.log("New password:", data.password);
      // TODO: Implement API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to login on success
      router.push(`/${locale}/auth/login`);
    } catch (error) {
      console.error("Reset password error:", error);
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
                required: true,
                minLength: 8,
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
          {errors.password?.type === "minLength" && (
            <p className="text-sm text-red-600">
              {t("errors.passwordTooShort")}
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
                required: true,
                validate: (value) => value === password,
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
          {errors.confirmPassword?.type === "validate" && (
            <p className="text-sm text-red-600">
              {t("errors.passwordMismatch")}
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
