"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCreateBotStore } from "@/store/create-bot-store";
import { getUserProfile } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { SYSTEM_PROMPT_TEMPLATE } from "@/lib/prompt";
import { Send } from "lucide-react";

const MAX_QUESTIONS = 5;

export const PreviewStep = () => {
  const t = useTranslations("createBot.preview");
  const locale = useLocale();
  const { setIsSharePhase } = useCreateBotStore();

  const [botData, setBotData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = getUserProfile()?.id;

  // Fetch bot data
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dataRes, infoRes] = await Promise.all([
          apiGet(`/users/chatbot/${userId}/data`, { locale }),
          apiGet(`/users/chatbot/${userId}/user-info`, { locale }),
        ]);
        setBotData(dataRes.data?.data ?? dataRes.data);
        setProfileData(infoRes.data?.data ?? infoRes.data);
      } catch (e) {
        console.error("Preview: failed to fetch bot data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, locale]);

  // Compiled system prompt
  const compiledPrompt = React.useMemo(() => {
    if (!botData) return "";
    return SYSTEM_PROMPT_TEMPLATE
      .replace("{{resume_summary}}", botData.cv_summary || "No resume summary available.")
      .replace("{{certificates_summary}}", Array.isArray(botData.certificates) ? botData.certificates.join("\n") : "No certificate data available.")
      .replace("{{qa_list}}", JSON.stringify(botData.questions_answers || []));
  }, [botData]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const limitReached = questionsUsed >= MAX_QUESTIONS;

  // Derived bot identity
  const name = profileData?.full_name || botData?.full_name || "Bot";
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const jobTitle = profileData?.job_title || botData?.job_title || "CV AI Assistant";

  const append = async (message: { role: string; content: string }) => {
    if (limitReached || isChatLoading) return;

    const newMessages = [...messages, { id: Date.now().toString(), ...message }];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, system_prompt: compiledPrompt }),
      });

      if (!response.ok) throw new Error("Chat failed");

      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: aiMessageId, role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      if (!reader) throw new Error("No reader");

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
                    msg.id === aiMessageId ? { ...msg, content: msg.content + delta } : msg
                  )
                );
              } catch {}
            }
          }
        }
      }
      setQuestionsUsed((q) => q + 1);
    } catch (err) {
      console.error("Preview chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading || limitReached) return;
    const msg = input;
    setInput("");
    append({ role: "user", content: msg });
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full px-4 py-6 overflow-y-auto">

        {/* Header text */}
        <div className="text-center mb-6 shrink-0 w-full max-w-[850px]">
          <h2 className="text-[28px] md:text-[32px] font-medium text-[#111827] mb-2 leading-tight">
            {t("title")}
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#64748B] font-normal leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* ── Chat Card ── */}
        <div
          className="w-full max-w-[850px] flex flex-col shrink-0"
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
            height: "600px",
          }}
        >
          {/* ── Section 1: Bot Header ── */}
          <div
            className="flex items-center gap-3 px-5 py-4 shrink-0"
            style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#111827 0%,#1D4ED8 100%)" }}
            >
              {loading ? "?" : initials}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#111827] leading-tight">
                {loading ? "Loading..." : name}
              </p>
              <p className="text-[12px] text-[#64748B]">
                {loading ? "" : jobTitle}
              </p>
            </div>
          </div>

          {/* ── Section 2: Messages ── */}
          <div
            className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 custom-scrollbar"
            style={{ background: "linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 100%)" }}
          >
            {/* Loading skeleton */}
            {loading && (
              <div className="flex flex-col gap-3 self-start max-w-[75%]">
                <div className="h-4 bg-white/70 rounded-full w-52 animate-pulse" />
                <div className="h-4 bg-white/70 rounded-full w-40 animate-pulse" />
              </div>
            )}

            {/* Greeting */}
            {!loading && (
              <div className="flex flex-col max-w-[75%] self-start">
                <div className="bg-white border border-[#E5E7EB] rounded-[18px] rounded-tl-none px-4 py-3 text-[14px] text-[#111827] leading-relaxed shadow-sm">
                  {t("greeting")}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m: any) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[75%] ${
                  m.role === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-[18px] text-[14px] leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-[#101828] text-white rounded-br-none"
                      : "bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-none"
                  }`}
                >
                  <span className="whitespace-pre-wrap">{m.content}</span>
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {isChatLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex flex-col max-w-[75%] self-start">
                <div className="bg-white border border-[#E5E7EB] rounded-[18px] rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* Limit reached */}
            {limitReached && (
              <div className="self-center text-center mt-1">
                <p className="text-[12px] text-[#64748B] bg-white border border-[#E5E7EB] rounded-full px-4 py-2 shadow-sm">
                  {t("limitReached")}
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Section 3: Input ── */}
          <div className="border-t border-[#E5E7EB] px-4 py-3 bg-white shrink-0">
            <div className="flex justify-end mb-1.5">
              <span className="text-[11px] text-[#94A3B8]">
                {questionsUsed}/{MAX_QUESTIONS} {t("questionsLabel")}
              </span>
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isChatLoading || limitReached || loading}
                placeholder={limitReached ? t("limitPlaceholder") : t("placeholder")}
                className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] px-4 py-3 outline-none text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:border-[#2C85FE] focus:ring-1 focus:ring-[#2C85FE] transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isChatLoading || !input.trim() || limitReached || loading}
                className="w-[44px] h-[44px] shrink-0 bg-[#2C85FE] rounded-[12px] flex items-center justify-center text-white hover:bg-[#1A73E8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="flex justify-end items-center px-6 md:px-8 py-5 w-full max-w-7xl mx-auto shrink-0">
        <button
          onClick={() => setIsSharePhase(true)}
          className="w-full md:w-[220px] h-[56px] rounded-[16px] font-medium text-[16px] transition-all duration-300 bg-[#101828] text-[#FCFCFC] hover:bg-[#1E293B] shadow-lg hover:shadow-xl flex items-center justify-center active:scale-[0.98]"
        >
          {t("goToShare")}
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
      `}</style>
    </div>
  );
};
