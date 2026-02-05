"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SA } from "country-flag-icons/react/3x2";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
}

export default function SignupPage() {
  const t = useTranslations("auth.signup");
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "SA",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (data: SignupFormData) => {
    const errors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!data.firstName) errors.firstName = t("errors.firstNameRequired");
    if (!data.lastName) errors.lastName = t("errors.lastNameRequired");
    if (!data.email) {
      errors.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = t("errors.emailInvalid");
    }
    if (!data.phone) {
      errors.phone = t("errors.phoneRequired");
    } else if (!/^\+?[\d\s-()]+$/.test(data.phone)) {
      errors.phone = t("errors.phoneInvalid");
    }
    if (!data.password) {
      errors.password = t("errors.passwordRequired");
    } else if (data.password.length < 8) {
      errors.password = t("errors.passwordMinLength");
    }

    return errors;
  };

  const builderPageImage =
    locale === "ar"
      ? "/images/auth/signup/builderPage-ar.svg"
      : "/images/auth/signup/builderPage.svg";

  return (
    <div className="w-full max-w-[440px] animate-fade-in-up">
      {/* Logo */}
      <div className="mb-8 flex justify-center lg:justify-start">
        <Image
          src="/images/auth/logo.svg"
          alt="CV Bot"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-[28px] font-semibold text-gray-900 mb-8 text-center lg:text-start">
        {t("title")}
      </h1>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("firstName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("placeholders.firstName")}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-xs animate-slide-down" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("lastName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("placeholders.lastName")}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-xs animate-slide-down" />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
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

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  {t("phoneNumber")}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Select
                      defaultValue="SA"
                      onValueChange={(value) =>
                        form.setValue("countryCode", value)
                      }
                    >
                      <SelectTrigger className="w-[100px] h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <SA className="w-5 h-4" />
                            <span className="text-sm">SA</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SA">
                          <div className="flex items-center gap-2">
                            <SA className="w-5 h-4" />
                            <span>SA</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      {...field}
                      type="tel"
                      placeholder={t("placeholders.phone")}
                      className="flex-1 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-lg dir-ltr"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs animate-slide-down" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
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

          {/* Terms & Privacy */}
          <p className="text-xs text-gray-600 text-center leading-relaxed pt-2">
            {t("termsPrefix")}{" "}
            <Link
              href="/terms"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
            >
              {t("termsLink")}
            </Link>{" "}
            {t("and")}{" "}
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
            >
              {t("privacyLink")}
            </Link>
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("createAccount")}
              </span>
            ) : (
              t("createAccount")
            )}
          </Button>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600 pt-4">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {t("login")}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
