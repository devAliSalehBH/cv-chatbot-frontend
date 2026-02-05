"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

interface Testimonial {
  quote: string;
  description?: string;
  author?: string;
  role?: string;
}

export function AuthRightPanel() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Get testimonials from translations
  const testimonials: Testimonial[] = [
    {
      quote: t("testimonials.0.quote"),
      description: t("testimonials.0.description"),
    },
    {
      quote: t("testimonials.1.quote"),
      author: t("testimonials.1.author"),
      role: t("testimonials.1.role"),
    },
  ];

  // Auto-rotate testimonials every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentTestimonialIndex];
  const builderPageImage =
    locale === "ar"
      ? "/images/auth/signup/builderPage-ar.svg"
      : "/images/auth/signup/builderPage.svg";

  return (
    <div className="hidden lg:flex lg:w-[60%] items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-600 to-blue-500">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-[600px] w-full z-10 space-y-8">
        {/* Testimonial Content with Fade Transition - Text Only Changes */}
        <div className="text-white space-y-4">
          <h2
            key={`quote-${currentTestimonialIndex}`}
            className="text-4xl font-bold leading-tight animate-fade-in-up"
          >
            {currentTestimonial.quote}
          </h2>
          {currentTestimonial.description && (
            <p
              key={`desc-${currentTestimonialIndex}`}
              className="text-lg text-blue-100 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              {currentTestimonial.description}
            </p>
          )}
          {currentTestimonial.author && (
            <div
              key={`author-${currentTestimonialIndex}`}
              className="flex items-center gap-3 pt-2 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {currentTestimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {currentTestimonial.author}
                </p>
                <p className="text-sm text-blue-200">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Mockup Image - Always Visible & Static */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-1">
            <Image
              src={builderPageImage}
              alt="CV Bot Chat Interface"
              width={600}
              height={400}
              className="w-full h-auto rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
