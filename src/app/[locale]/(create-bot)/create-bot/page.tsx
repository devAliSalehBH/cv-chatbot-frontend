"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { useUserSession } from "@/hooks/useUserSession";
import { UploadResume } from "@/components/create-bot/steps/UploadResume";
import { UploadCertificates } from "@/components/create-bot/steps/UploadCertificates";
import { LinkedInProfile } from "@/components/create-bot/steps/LinkedInProfile";
import { AnswerQuestions } from "@/components/create-bot/steps/AnswerQuestions";
import { ProcessingScreen } from "@/components/create-bot/steps/ProcessingScreen";
import { AIGeneratingScreen } from "@/components/create-bot/steps/AIGeneratingScreen";
import { BuildingConversationFlowScreen } from "@/components/create-bot/steps/BuildingConversationFlowScreen";
import { PreviewStep } from "@/components/create-bot/steps/PreviewStep";
import { ShareStep } from "@/components/create-bot/steps/ShareStep";
import { useEffect, useState } from "react";

export default function CreateBotPage() {
  const { currentStep, isCreatingDone, setIsCreatingDone, isSharePhase } = useCreateBotStore();
  const { sessionType, loading } = useUserSession();

  useEffect(() => {
    if (sessionType === "completed") {
      const timer = setTimeout(() => {
        setIsCreatingDone(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sessionType, setIsCreatingDone]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#1e293b] animate-spin" />
      </div>
    );
  }

  const renderStep = () => {
    switch (sessionType) {
      // ── Phase 1: File upload (sub-steps driven by local Zustand) ─────────────
      case "upload_file":
      case null:
      case undefined:
        switch (currentStep) {
          case "upload-resume":      return <UploadResume />;
          case "upload-certificates": return <UploadCertificates />;
          case "linkedin-profile":   return <LinkedInProfile />;
          default:                   return <UploadResume />;
        }

      // ── Phase 1b: File summarization ─────────────────────────────────────────
      case "summarizing_files":        return <ProcessingScreen status="loading" />;
      case "failed_summarizing_files": return <ProcessingScreen status="failed" />;

      // ── Phase 2a: Static questions ───────────────────────────────────────────
      case "static_questions":
        return (
          <AnswerQuestions
            fetchUrl="/users/questions"
            submitUrl="/users/questions/answers"
          />
        );

      // ── Phase 2b: AI question generation ─────────────────────────────────────
      case "generating_ai_questions": return <AIGeneratingScreen status="loading" />;
      case "ai_generation_failed":    return <AIGeneratingScreen status="failed" />;

      // ── Phase 2c: AI questions ────────────────────────────────────────────────
      case "ai_followup":
        return (
          <AnswerQuestions
            fetchUrl="/users/questions/ai"
            submitUrl="/users/questions/ai/answers"
          />
        );

      // ── Phase 3: Final Building & Preview ──────────────────────────────────────
      case "completed":
        if (!isCreatingDone) {
          return <BuildingConversationFlowScreen />;
        }
        if (isSharePhase) {
          return <ShareStep />;
        }
        return <PreviewStep />;

      default:
        return <UploadResume />;
    }
  };


  return <div className="w-full h-full max-w-5xl mx-auto">{renderStep()}</div>;
}
