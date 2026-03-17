"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { apiGet } from "@/lib/api";
import { useParams } from "next/navigation";
import { SYSTEM_PROMPT_TEMPLATE } from "@/lib/prompt";
import Image from "next/image";
import { ref, runTransaction, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { 
  Send, 
  Check, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Download,
  HelpCircle,
  FileText
} from "lucide-react";

export default function CVChatPage() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations("cvchat");

  const [botData, setBotData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Fetch candidate AI data (CV summary, certs, Q&A)
  useEffect(() => {
    const fetchBotData = async () => {
      try {
        setLoading(true);
        // Fetch AI content data
        const [dataRes, infoRes] = await Promise.all([
          apiGet(`/users/chatbot/${id}/data`, { locale }),
          apiGet(`/users/chatbot/${id}/user-info`, { locale }),
        ]);
        setBotData(dataRes.data?.data ?? dataRes.data);
        setProfileData(infoRes.data?.data ?? infoRes.data);
      } catch (err: any) {
        console.error("Failed to fetch bot data:", err);
        setError(err.response?.data?.message || t("notFound"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBotData();
    }
  }, [id, locale]);

  // ── Firebase Stats ───────────────────────────────────────────────────────────

  // 1. Increment total_views on mount
  useEffect(() => {
    if (!id) return;
    const statsRef = ref(db, `users/${id}/stats`);
    // Ensure stats node exists then increment
    runTransaction(statsRef, (current) => {
      if (current === null) {
        return {
          total_views: 1,
          cv_downloads: 0,
          questions_answered: 0,
          last_interaction: null,
        };
      }
      return { ...current, total_views: (current.total_views || 0) + 1 };
    });
  }, [id]);

  // 2. Update last_interaction when user leaves the page
  useEffect(() => {
    if (!id) return;
    const updateLastInteraction = () => {
      const statsRef = ref(db, `users/${id}/stats/last_interaction`);
      set(statsRef, new Date().toISOString());
    };
    window.addEventListener("beforeunload", updateLastInteraction);
    return () => {
      updateLastInteraction(); // also update on component unmount (navigate away)
      window.removeEventListener("beforeunload", updateLastInteraction);
    };
  }, [id]);

  // Construct System Prompt
  const compiledPrompt = React.useMemo(() => {
    if (!botData) return "";
    return SYSTEM_PROMPT_TEMPLATE
      .replace("{{resume_summary}}", botData.cv_summary || "No resume summary available.")
      .replace("{{certificates_summary}}", Array.isArray(botData.certificates) ? botData.certificates.join("\n") : "No certificate data available.")
      .replace("{{qa_list}}", JSON.stringify(botData.questions_answers || []));
  }, [botData]);

  // Native chat streaming logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const append = async (message: { role: string; content: string }) => {
    const newMessages = [...messages, { id: Date.now().toString(), ...message }];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          system_prompt: compiledPrompt,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: aiMessageId, role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      
      if (!reader) throw new Error("No reader available");

      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") continue;
              try {
                const data = JSON.parse(dataStr);
                const delta = data.choices[0]?.delta?.content || "";
                
                setMessages((prev) => 
                  prev.map((msg) => 
                    msg.id === aiMessageId 
                      ? { ...msg, content: msg.content + delta } 
                      : msg
                  )
                );
              } catch (e) {
                // ignore parse errors from partial json
              }
            }
          }
        }
      }
      // Stream fully complete — increment questions_answered
      if (id) {
        const qRef = ref(db, `users/${id}/stats`);
        runTransaction(qRef, (current) => {
          if (current === null) return current;
          return { ...current, questions_answered: (current.questions_answered || 0) + 1 };
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const userMsg = input;
    setInput("");
    append({ role: "user", content: userMsg });
  };

  // ── CV Download (with Firebase counter) ───────────────────────────────────
  const handleCvDownload = () => {
    if (!cvUrl) return;
    // Increment cv_downloads in Firebase
    if (id) {
      const statsRef = ref(db, `users/${id}/stats`);
      runTransaction(statsRef, (current) => {
        if (current === null) return current;
        return { ...current, cv_downloads: (current.cv_downloads || 0) + 1 };
      });
    }
    window.open(cvUrl, "_blank");
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const handleQuickQuestion = (question: string) => {
    append({
      role: "user",
      content: question,
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C85FE]"></div>
          <p className="text-[#64748B] font-medium animate-pulse">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !botData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-10 rounded-[24px] shadow-sm border border-[#E5E7EB]">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t("error")}</h1>
          <p className="text-gray-600 mb-6">{error || t("notFound")}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors font-medium"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  // Extract variables for UI
  const name = profileData?.full_name || botData?.full_name || "Applicant";
  const firstName = name.split(" ")[0];
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const jobTitle = profileData?.job_title || botData?.job_title || "Professional";
  const yearsExperience = profileData?.years_of_experience || botData?.years_of_experience || "X";
  const skills = profileData?.skills || botData?.skills || [];
  const email = profileData?.email || botData?.email || null;
  // API returns 'phone' not 'phone_number'
  const phone = profileData?.phone || profileData?.phone_number || botData?.phone || botData?.phone_number || null;
  const location = profileData?.location || botData?.location || null;
  // CV url is nested: data.cv.url
  const cvUrl = profileData?.cv?.url || profileData?.file_url || botData?.cv?.url || botData?.file_url || null;
  const cvFileName = cvUrl ? decodeURIComponent(cvUrl.split("/").pop()?.split("?")[0] || "CV.pdf") : "CV.pdf";

  
  const suggestions = [
    t("suggestion1", { name: firstName }),
    t("suggestion2"),
    t("suggestion3"),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden absolute inset-0" dir={locale === "ar" ? "rtl" : "ltr"}>
      
      {/* ─── LEFT PANEL: Chat Interface ─── */}
      <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] border-r border-[#E5E7EB] relative">
        
        {/* Header */}
        <header className="h-[60px] bg-[#F5F8FFE5] shadow-card border-b border-[#E5E7EB] flex items-center px-4 md:px-6 justify-between shrink-0">
          {/* Logo */}
          <div className="w-[90px] md:w-[120px] relative">
            <Image
              src={`/images/logo-${locale}.svg`}
              alt="CV Bot"
              width={120}
              height={32}
              className="object-contain"
            />
          </div>

          {/* Mobile: avatar button to open sidebar */}
          <button
            className="md:hidden flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 text-[13px] font-medium text-[#111827] shadow-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white bg-[linear-gradient(135deg,#111827_0%,#1D4ED8_100%)]"
            >
              {initials}
            </div>
            <span className="max-w-[100px] truncate">{firstName}</span>
          </button>

          {/* Desktop: help icon */}
          <button className="hidden md:flex w-10 h-10 rounded-full hover:bg-gray-100 items-center justify-center text-gray-500 transition-colors">
            <HelpCircle size={20} />
          </button>
        </header>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-8 pb-[100px] flex flex-col gap-6 custom-scrollbar">
          
          {/* Default Greeting & Suggestions (Always visible at top) */}
          <div className="flex flex-col gap-4 max-w-[85%] self-start">
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] rounded-tl-none p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <p className="text-[#111827] text-[15px] leading-relaxed mb-4">
                {t("greeting")}
              </p>
              
              {/* If no user messages yet, show suggestions immediately below greeting */}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleQuickQuestion(suggestion)}
                      className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[13px] text-[#64748B] hover:border-[#2C85FE] hover:text-[#2C85FE] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actual Messages */}
          {messages.map((m: any) => {
            const hasCvDownload = m.role === "assistant" && m.content.includes("[with_cv_download]");
            const displayContent = m.content.replace("[with_cv_download]", "").trim();

            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] animate-fade-in ${
                  m.role === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[15px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#101828] text-white rounded-br-none"
                      : "bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-none"
                  }`}
                >
                  <span className="whitespace-pre-wrap">{displayContent}</span>

                  {/* CV Download Card */}
                  {hasCvDownload && (
                    <div className="mt-4 flex items-center justify-between gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-[48px] h-[48px] bg-[#ECF4FF] rounded-full flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-[#2C85FE]" />
                        </div>
                        <span className="text-[14px] text-[#111827] font-normal truncate max-w-[160px]">
                          {cvFileName}
                        </span>
                      </div>
                      <button
                        onClick={handleCvDownload}
                        disabled={!cvUrl}
                        className="w-[18px] h-[18px] shrink-0 flex items-center justify-center text-[#6B7280] hover:text-[#2C85FE] transition-colors disabled:opacity-40"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}


          {/* Typing Indicator */}
          {isChatLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex flex-col max-w-[85%] self-start animate-fade-in">
              <div className="p-5 rounded-[24px] rounded-tl-none bg-white border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="absolute bottom-0 left-0 w-full bg-[#F8FAFC]/95 border-t border-[#E5E7EB] px-4 py-3 md:px-6 md:py-4 backdrop-blur-sm z-10">
          <div className="max-w-[990px] mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                disabled={isChatLoading}
                placeholder={t("placeholder")}
                className="flex-1 bg-white border border-[#E5E7EB] rounded-[12px] px-4 py-[1.2rem] outline-none text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:border-[#2C85FE] focus:ring-1 focus:ring-[#2C85FE] transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={isChatLoading || !input.trim()}
                className="w-[60px] h-[60px] shrink-0 bg-[#2C85FE] rounded-[12px] flex items-center justify-center text-white hover:bg-[#1A73E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send size={24}  />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* ─── RIGHT PANEL: Profile Sidebar ─── */}
      {/* Mobile: overlay drawer | Desktop: always-visible panel */}

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed md:relative top-0 right-0 h-full
        w-[300px] md:w-[360px] lg:w-[400px]
        bg-white flex flex-col z-40
        shadow-[-4px_0_24px_rgba(0,0,0,0.06)]
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>
        {/* Mobile close button */}
        <div className="md:hidden flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
          <span className="text-[14px] font-semibold text-[#111827]">{name}</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col items-center text-center mt-2 mb-8">
            <div
              className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full flex items-center justify-center text-[28px] md:text-[36px] font-semibold tracking-wide mb-4 shadow-lg text-white bg-[linear-gradient(135deg,#111827_0%,#1D4ED8_100%)]"
            >
              {initials}
            </div>
            <h2 className="text-[20px] md:text-[24px] font-semibold text-[#111827] mb-1">{name}</h2>
            <p className="text-[14px] text-[#64748B] font-medium">{jobTitle}</p>
          </div>

          {/* Match & Experience Overview */}
          <div className="space-y-5 mb-8">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <Check size={18} className="text-[#2C85FE]" />
              </div>
              <div>
                <p className="text-[13px] text-[#111827] font-medium mb-1">{t("strongMatch")}</p>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  {skills.length > 0 ? skills.join(", ") : t("variousSkills")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <Briefcase size={18} className="text-[#2C85FE]" />
              </div>
              <p className="text-[13px] text-[#111827] font-medium leading-relaxed">
                {t("experience", { years: yearsExperience })}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-4">{t("contactInfo")}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#64748B]">
                <Mail size={16} />
                <span className="text-[13px] truncate">{email || t("noEmail")}</span>
              </div>
              <div className="flex items-center gap-3 text-[#64748B]">
                <Phone size={16} />
                <span className="text-[13px]">{phone || t("noPhone")}</span>
              </div>
              <div className="flex items-center gap-3 text-[#64748B]">
                <MapPin size={16} />
                <span className="text-[13px]">{location || t("remote")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Download Button Bottom */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white">
          <button
            disabled={!cvUrl}
            onClick={handleCvDownload}
            className="w-full h-[60px] bg-[#2C85FE] hover:bg-[#1A73E8] text-white rounded-[14px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md transform active:scale-[0.98]"
          >
            <Download size={24} />
            {t("downloadResume")}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}

