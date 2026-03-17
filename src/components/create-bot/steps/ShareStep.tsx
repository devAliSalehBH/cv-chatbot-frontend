"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateBotStore } from "@/store/create-bot-store";
import { getUserProfile } from "@/lib/auth";

export const ShareStep = () => {
  const t = useTranslations("createBot.share");
  const locale = useLocale();
  const router = useRouter();
  const { setIsSharePhase } = useCreateBotStore();
  
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Client-only URL generation
    const profile = getUserProfile();
    const botId = profile?.id;
    // Standard localized URL for the public CV Chatbot page
    const url = `${window.location.origin}/${locale}/cvchat/${botId}`;
    setShareUrl(url);
  }, [locale]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "cvbot-qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Centered Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
        
        {/* Header Container */}
        <div className="flex flex-col items-center w-full max-w-4xl text-center mb-10 md:mb-12">
           <h2 className="text-[28px] md:text-[36px] font-semibold text-[#111827] mb-2 leading-tight">
            {t("title")}
          </h2>
          <p className="text-[14px] md:text-[18px] text-[#64748B] max-w-[500px] mx-auto text-center font-normal leading-relaxed opacity-80">
            {t("subtitle")}
          </p>
        </div>

        {/* Share Card */}
        <div className="w-full max-w-[440px] bg-[#FCFCFC] rounded-[40px] border border-[#E5E7EB] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex flex-col items-center transition-all">
            
            {/* Scan QR Section */}
            <h3 className="text-[24px] font-semibold text-[#333333] mb-1">
                {t("scanTitle")}
            </h3>
            <p className="text-[14px] font-normal text-[#64748B] mb-8 text-center opacity-70">
                {t("scanSubtitle")}
            </p>

            {/* QR Code Double Border Wrapper */}
            <div className="p-5 bg-white rounded-[32px] border border-[#E5E7EB] mb-8 shadow-sm">
              <div ref={qrRef} className="p-1.5 bg-white rounded-[16px] border-[5px] border-[#2C85FE] flex items-center justify-center">
                <QRCodeCanvas 
                  value={shareUrl} 
                  size={180}
                  level="H"
                  fgColor="#000000"
                  imageSettings={{
                    src: "/images/logo.svg",
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="w-full h-[54px] bg-[#2C85FE] rounded-[9px] text-[#FEFEFE] text-[16px] font-medium flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(44,133,254,0.25)] hover:bg-[#1C75EE] transition-all transform active:scale-[0.98]"
            >
                <Download size={18} />
                {t("downloadBtn")}
            </button>

            {/* OR Separator */}
            <div className="flex items-center gap-4 w-full my-8 text-[#E5E7EB]">
                <div className="h-px bg-[#E5E7EB] flex-1" />
                <span className="text-[13px] text-[#64748B] lowercase">{t("or")}</span>
                <div className="h-px bg-[#E5E7EB] flex-1" />
            </div>

            {/* Copy Field */}
            <div 
                onClick={handleCopy}
                className="w-full h-[58px] bg-[#FCFCFC] rounded-2xl border border-[#E5E7EB] flex items-center gap-3 px-4 shadow-[0_4px_10px_rgba(0,0,0,0.01)] cursor-pointer group hover:border-[#2C85FE] transition-all"
            >
                <div className="flex-1 truncate text-[#383838] text-[15px] font-medium text-left">
                    {shareUrl.replace(/^https?:\/\//, "")}
                </div>
                {copied ? (
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                ) : (
                    <Copy size={18} className="text-gray-400 shrink-0 group-hover:text-[#2C85FE] transition-colors" />
                )}
            </div>
            
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="flex items-center justify-between px-6 md:px-8 py-5 w-full max-w-7xl mx-auto gap-4">
        <button
          onClick={() => setIsSharePhase(false)}
          className="flex-1 md:flex-none md:min-w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] text-[#101828] border border-[#101828] bg-transparent hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
        >
          {t("back")}
        </button>

        <button
          onClick={() => router.push(`/${locale}/dashboard`)}
          className="flex-1 md:flex-none md:min-w-[240px] h-[60px] rounded-[16px] font-semibold text-[16px] bg-[#101828] text-white hover:bg-[#1E293B] transition-all duration-200 shadow-md transform active:scale-[0.98]"
        >
          {t("goToDashboard")}
        </button>
      </div>
    </div>
  );
};
