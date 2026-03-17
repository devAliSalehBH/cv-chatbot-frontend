"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useUserSession } from "@/hooks/useUserSession";
import { 
  Eye, 
  Download, 
  MessageSquare, 
  Clock, 
  Info, 
  Share2, 
  Copy, 
  FileEdit,
  CheckCircle2
} from "lucide-react";
import { ref, onValue, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Stats Types ──────────────────────────────────────────────────────────────

interface UserStats {
  total_views: number;
  cv_downloads: number;
  questions_answered: number;
  last_interaction: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const profile = getUserProfile();
  const { sessionType, loading } = useUserSession();

  const [stats, setStats] = useState<UserStats>({
    total_views: 0,
    cv_downloads: 0,
    questions_answered: 0,
    last_interaction: null,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const userName = profile?.full_name || "User";
  const userId = profile?.id;
  const hasBot = sessionType === "completed" || profile?.question_session_type === "completed";
  const botUrl = typeof window !== "undefined" ? `${window.location.host}/${locale}/cvchat/${userId}` : "";
  const fullBotUrl = typeof window !== "undefined" ? `${window.location.origin}/${locale}/cvchat/${userId}` : "";

  // ── Fetch & Initialize Stats ─────────────────────────────────────────────────

  useEffect(() => {
    if (!userId || !hasBot) {
      setIsStatsLoading(false);
      return;
    }

    const statsRef = ref(db, `users/${userId}/stats`);

    // First try to get existing stats
    get(statsRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // Initialize stats if they don't exist
        const initialStats: UserStats = {
          total_views: 0,
          cv_downloads: 0,
          questions_answered: 0,
          last_interaction: null,
        };
        set(statsRef, initialStats);
      }
    });

    // Listen for changes
    const unsubscribe = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.val());
      }
      setIsStatsLoading(false);
    });

    return () => unsubscribe();
  }, [userId, hasBot]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const handleCopy = () => {
    navigator.clipboard.writeText(fullBotUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Relative Time Formatter ───────────────────────────────────────────────────

  const formatRelativeTime = (isoString: string | null): string => {
    if (!isoString) return t("stats.lastInteraction.never");
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffSec < 60)    return rtf.format(-diffSec, "seconds");
    if (diffSec < 3600)  return rtf.format(-Math.floor(diffSec / 60), "minutes");
    if (diffSec < 86400) return rtf.format(-Math.floor(diffSec / 3600), "hours");
    if (diffSec < 2592000) return rtf.format(-Math.floor(diffSec / 86400), "days");
    if (diffSec < 31536000) return rtf.format(-Math.floor(diffSec / 2592000), "months");
    return rtf.format(-Math.floor(diffSec / 31536000), "years");
  };

  // ── Loading state ─────────────────────────────────────────────────────────────

  if (loading || (hasBot && isStatsLoading)) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1e293b] animate-spin" />
        </div>
      </div>
    );
  }

  // ── Render Helpers ────────────────────────────────────────────────────────────

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    tooltip 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    tooltip: string;
  }) => (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 flex flex-col gap-4 relative shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-start">
        <div className="w-[48px] h-[48px] bg-[#ECF4FF] rounded-[12px] flex items-center justify-center">
          <Icon size={20} className="text-[#2C85FE]" />
        </div>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="outline-none">
                <Info size={18} className="text-[#E5E7EB] hover:text-[#BCC1C8] transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#101828] text-white border-none rounded-lg p-2 max-w-[220px] text-[12px] shadow-xl">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        <p className="text-[16px] font-normal text-[#64748B] mb-1">{label}</p>
        <h3 className="text-[32px] font-medium text-[#111827]">{value}</h3>
      </div>
    </div>
  );

  // ── Main Layout ───────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 max-w-7xl animate-fade-in">
      
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-2">
          {t("welcome", { name: userName })}
        </h1>
        <p className="text-[16px] md:text-[18px] text-[#64748B] font-normal">
          {t("subtitle")}
        </p>
      </div>

      {!hasBot ? (
        // Empty State: Create Bot
        <div className="rounded-[24px] bg-[#F9FAFB] border border-[#E5E7EB] p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3">
              <h2 className="text-[22px] md:text-[24px] font-medium text-[#111827]">
                {t("emptyState.title")}
              </h2>
              <p className="text-[#64748B] text-[15px] md:text-[16px] leading-relaxed max-w-lg">
                {t("emptyState.description")}
              </p>
            </div>

            <Link href="/create-bot">
              <Button className="bg-[#101828] hover:bg-[#1E293B] px-8 h-[52px] rounded-[16px] shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98]">
                <span className="text-[#FCFCFC] text-[16px] font-medium">
                  {t("emptyState.button")}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        // Bot Created: Active Dashboard
        <div className="space-y-10 animate-slide-up">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard 
              icon={Eye} 
              label={t("stats.totalViews.title")} 
              value={stats.total_views} 
              tooltip={t("stats.totalViews.tooltip")}
            />
            <StatCard 
              icon={Download} 
              label={t("stats.cvDownloads.title")} 
              value={stats.cv_downloads} 
              tooltip={t("stats.cvDownloads.tooltip")}
            />
            <StatCard 
              icon={MessageSquare} 
              label={t("stats.questionsAnswered.title")} 
              value={stats.questions_answered} 
              tooltip={t("stats.questionsAnswered.tooltip")}
            />
            <StatCard 
              icon={Clock} 
              label={t("stats.lastInteraction.title")} 
              value={formatRelativeTime(stats.last_interaction)} 
              tooltip={t("stats.lastInteraction.tooltip")}
            />

          </div>

          {/* Live Status Card */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#12B76A] shadow-[0_0_8px_rgba(18,183,106,0.4)]" />
                <span className="text-[13px] font-medium text-[#12B76A] uppercase tracking-wider">
                  {t("liveCard.status")}
                </span>
              </div>
              <div>
                <h2 className="text-[22px] md:text-[24px] font-semibold text-[#111827] mb-1">
                  {t("liveCard.title")}
                </h2>
                <div className="text-[#64748B] text-[12px] font-normal opacity-80">
                  {fullBotUrl}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Reset/Update CV Button (white with black border) */}
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 w-full md:w-auto h-[44px] px-5 rounded-[12px] bg-white border border-[#101828] text-[#101828] text-[14px] font-medium hover:bg-gray-50 transition-colors">
                <FileEdit size={18} />
                {t("liveCard.updateCv")}
              </button>
              
              {/* Share Button (white with black border) */}
              <button 
                onClick={() => {}} // TODO
                className="flex flex-1 md:flex-none items-center justify-center gap-2 h-[44px] px-5 rounded-[12px] bg-white border border-[#101828] text-[#101828] text-[14px] font-medium hover:bg-gray-50 transition-colors"
              >
                <Share2 size={18} />
                {t("liveCard.share")}
              </button>

              {/* Copy Button (Black) */}
              <button 
                onClick={handleCopy}
                className="flex flex-1 md:flex-none items-center justify-center gap-2 h-[44px] px-6 rounded-[12px] bg-[#101828] text-white text-[14px] font-medium hover:bg-gray-900 transition-all shadow-md active:scale-[0.98]"
              >
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {t("liveCard.copy")}
              </button>
            </div>
          </div>

          {/* Chatbot Preview Section */}
          <div className="w-full relative mt-10">
             {/* Desktop Preview */}
             <div className="hidden md:block w-full">
                <Image 
                  src="/images/dashboard/web.png" 
                  alt="Dashboard Web" 
                  width={1400} 
                  height={800} 
                  className="w-full h-auto"
                />
             </div>
             {/* Mobile Preview */}
             <div className="block md:hidden w-full">
                <Image 
                  src="/images/dashboard/mobile.png" 
                  alt="Dashboard Mobile" 
                  width={400} 
                  height={800} 
                  className="w-full h-auto"
                />
             </div>
          </div>

        </div>
      )}
    </div>
  );
}
