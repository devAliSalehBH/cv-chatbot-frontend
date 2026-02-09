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
    <div className="hidden lg:flex lg:w-[60%] items-center justify-center  relative overflow-hidden bg-[linear-gradient(136.37deg,#0A0A0A_0%,#1E3A8A_25.18%,#2B84FF_72.57%)]">
      {/* Grid Pattern Overlay */}
      <div
        className="
    absolute inset-0
    bg-[url('/images/auth/side-bg.png')]
    bg-size-[100%_100%]
    bg-no-repeat 
    opacity-20
   "
      />
      <div
        className="
    absolute
    top-0 right-0
    w-[60%]
    aspect-square
    bg-[url('/images/auth/vector.svg')]
    bg-no-repeat
    bg-top-right
  "
      />
      <div className=" w-full z-10  h-full flex flex-col justify-between">
        {/* Testimonial Content with Fade Transition - Text Only Changes */}
        <div className="text-white max-w-[80%] space-y-4 px-10 pt-16">
          <h2
            key={`quote-${currentTestimonialIndex}`}
            className="text-[32px] font-bold leading-tight animate-fade-in-up"
          >
            {currentTestimonial.quote}
          </h2>
          {currentTestimonial.description && (
            <p
              key={`desc-${currentTestimonialIndex}`}
              className="text-[22px] text-[#FCFCFC] whitespace-pre-wrap leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              {currentTestimonial.description}
            </p>
          )}
          {currentTestimonial.author && (
            <div
              key={`author-${currentTestimonialIndex}`}
              className="flex items-center gap-3 pt-2 animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              <Image
                src="/images/auth/container.svg"
                alt="user avatar"
                width={56}
                height={56}
              />
              <div>
                <p className="text-lg text-white">
                  {currentTestimonial.author}
                </p>
                <p className="text-sm text-[#C4C4C4]">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Mockup Image - Always Visible & Static */}
        <div className="relative flex justify-end p-5">
          <div className=" w-[75%] max-w-200">
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
