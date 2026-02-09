"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { defaultCountries } from "react-international-phone";
import { apiPost } from "@/lib/api";
import { useAlertStore } from "@/store/useAlertStore";
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
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { getValidationPatterns } from "@/lib/validationRules";

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
  const tValidation = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlertStore();

  const validationPatterns = getValidationPatterns(tValidation);

  const form = useForm<SignupFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "SA",
      phone: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const phoneData = data.phone || "";

      let phone_country = "SA";
      let localPhone = phoneData.replace(/\D/g, "");

      // Parse using react-international-phone metadata
      if (phoneData.startsWith("+")) {
        const digitsOnly = phoneData.replace(/\D/g, "");

        // Find matching country from react-international-phone countries
        for (const country of defaultCountries) {
          const dialCode = country[2]; // dial code is at index 2
          const iso2 = country[1]; // ISO code is at index 1

          if (digitsOnly.startsWith(dialCode)) {
            phone_country = iso2.toUpperCase();
            localPhone = digitsOnly.substring(dialCode.length);

            console.log("Phone Debug:", {
              input: phoneData,
              dialCode: dialCode,
              country: phone_country,
              nationalNumber: localPhone,
            });
            break;
          }
        }
      }

      const response = await apiPost(
        "/auth/register",
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: localPhone,
          phone_country: phone_country,
          password: data.password,
          password_confirmation: data.password,
        },
        {
          locale: locale,
        },
      );

      // Show success alert
      showAlert(response.data.message, response.data.success !== false);

      // Store email for OTP verification
      localStorage.setItem("pending_verification_email", data.email);

      // Navigate to OTP page
      setTimeout(() => {
        router.replace(`/${locale}/auth/verify-otp`);
      }, 1000);
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
      <h1 className="text-[28px]  text-gray-900 mb-8 text-center">
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
              rules={{
                required: validationPatterns.required,
                minLength: validationPatterns.minLength2,
              }}
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
              rules={{
                required: validationPatterns.required,
                minLength: validationPatterns.minLength2,
              }}
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
                  <PhoneNumberInput {...field} />
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

          {/* Terms & Privacy */}
          <p className="text-sm text-[#64748B] text-center leading-relaxed pt-16">
            {t("termsPrefix")}{" "}
            <Link
              href={`/${locale}/terms`}
              className="text-[#2E87FE] hover:text-blue-700 underline underline-offset-2 transition-colors"
            >
              {t("termsLink")}
            </Link>{" "}
            {t("and")}{" "}
            <Link
              href={`/${locale}/privacy`}
              className="text-[#2E87FE] hover:text-blue-700 underline underline-offset-2 transition-colors"
            >
              {t("privacyLink")}
            </Link>
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
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
          <p className="text-sm text-center text-[#64748B] pt-4">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="text-[#2E87FE] hover:text-blue-700 font-medium transition-colors"
            >
              {t("login")}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
