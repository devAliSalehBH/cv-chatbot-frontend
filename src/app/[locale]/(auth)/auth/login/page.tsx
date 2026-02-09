"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { useAlertStore } from "@/store/useAlertStore";
import { setAuthToken, setUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getValidationPatterns } from "@/lib/validationRules";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlertStore();
  const tValidation = useTranslations();
  const validationPatterns = getValidationPatterns(tValidation);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const response = await apiPost(
        "/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          locale: locale,
        },
      );
      console.log(response);

      // Show success alert
      showAlert(response.data.message, response.data.success !== false);

      // Store token and user profile
      if (response.data.data.token) {
        setAuthToken(response.data.data.token);
      }

      if (response.data.data) {
        setUserProfile(response.data.data);
      }

      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.replace(`/${locale}/dashboard`);
      }, 1500);
    } catch (error: any) {
      // Check if it's email not verified error (403)
      if (
        error.response?.data?.code === 403 &&
        error.response?.data?.data?.reason === "email_not_verified"
      ) {
        // Store email for OTP verification
        localStorage.setItem("pending_verification_email", data.email);

        // Show info alert
        const message =
          t("auth.email_not_verified") || error.response?.data?.message;
        if (message) {
          showAlert(message, false);
        }

        // Navigate to OTP page
        setTimeout(() => {
          router.replace(`/${locale}/auth/verify-otp`);
        }, 1000);
        return;
      }

      // Handle other errors
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        showAlert(errorMessage, false);
      }
    } finally {
      setIsSubmitting(false);
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

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: validationPatterns.required,
              pattern: validationPatterns.email,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  {t("email")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("placeholders.email")}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-xs animate-slide-down" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: validationPatterns.required,
              minLength: validationPatterns.minLength8,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  {t("password")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("placeholders.password")}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg pe-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs animate-slide-down" />
              </FormItem>
            )}
          />

          {/* Forgot Password Link */}
          <div className="flex justify-start">
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-sm text-[#2E87FE] hover:text-blue-700 transition-colors"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-16 h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 "
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("loginButton")}
              </span>
            ) : (
              t("loginButton")
            )}
          </Button>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600 pt-4">
            {t("noAccount")}{" "}
            <Link
              href={`/${locale}/auth/signup`}
              className="text-[#2E87FE] hover:text-blue-700 font-medium transition-colors"
            >
              {t("signUp")}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
