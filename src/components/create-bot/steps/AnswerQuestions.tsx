"use client";

import { useEffect, useState } from "react";
import { useCreateBotStore } from "@/store/create-bot-store";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations, useLocale } from "next-intl";
import { apiGet, apiPost } from "@/lib/api";
import { useAlertStore } from "@/store/useAlertStore";
import { triggerQueueWork } from "@/lib/queueWork";

// ── Types ──────────────────────────────────────────────────────────────────────

// answers[questionId] = string (radio/text) | string[] (checkbox)
type AnswersMap = Record<number, string | string[]>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface AnswerQuestionsProps {
  /** API endpoint to fetch questions from. Defaults to static questions. */
  fetchUrl?: string;
  /** API endpoint to submit answers to. Defaults to static questions answers. */
  submitUrl?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

export const AnswerQuestions = ({
  fetchUrl = "/users/questions",
  submitUrl = "/users/questions/answers",
}: AnswerQuestionsProps) => {
  const t = useTranslations("createBot");
  const locale = useLocale();
  const { showAlert } = useAlertStore();

  const {
    questions,
    currentQuestionIndex,
    setQuestions,
    nextQuestion,
    prevQuestion,
  } = useCreateBotStore();

  // Local answers state — lives here, not in the global store
  const [answers, setAnswers] = useState<AnswersMap>({});

  // Fetch loading / submit loading
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch questions on mount ─────────────────────────────────────────────────

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsFetching(true);
      try {
        const response = await apiGet(fetchUrl, { locale });
        const data = response.data?.data;
        if (Array.isArray(data)) {
          setQuestions(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch questions:", err);
        showAlert("Failed to load questions. Please refresh.", false);
      } finally {
        setIsFetching(false);
      }
    };

    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const getAnswer = (id: number) => answers[id];

  const setAnswer = (questionId: number, value: string | string[]) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  /** Format a single answer value for submission */
  const formatAnswerValue = (questionId: number): string => {
    const val = answers[questionId];
    if (Array.isArray(val)) return val.join(", ");
    return val ?? "";
  };

  // ── Submit all answers ───────────────────────────────────────────────────────

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      questions.forEach((q, index) => {
        formData.append(`answers[${index}][question_id]`, String(q.id));
        formData.append(`answers[${index}][answer_value]`, formatAnswerValue(q.id));
      });

      await apiPost(submitUrl, formData, {
        locale,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await triggerQueueWork(locale);

      // Firebase / backend will update question_session_type to the next phase
      console.log("✅ Answers submitted successfully");
    } catch (err: any) {
      console.error("❌ Failed to submit answers:", err);
      const message = err?.response?.data?.message || "Failed to submit answers.";
      showAlert(message, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Navigation ───────────────────────────────────────────────────────────────

  const handleNext = async () => {
    if (isLastQuestion) {
      await handleSubmitAll();
    } else {
      nextQuestion();
    }
  };

  const handleBack = () => {
    prevQuestion();
  };

  // ── Loading state ─────────────────────────────────────────────────────────────

  if (isFetching || !question) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1e293b] animate-spin" />
        </div>
      </div>
    );
  }

  const answer = getAnswer(question.id);
  const questionText = locale === "ar" ? question.question_ar : question.question_en;

  const isAnswerValid = () => {
    if (!answer) return false;
    if (question.type === "checkbox") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return typeof answer === "string" && answer.trim().length > 0;
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full max-w-7xl mx-auto">
  
        {/* Desktop: Question X of Y */}
        <p className="hidden md:block text-[#2E87FE] font-normal text-[14px] mb-3 text-center">
          {t("stepper.question")} {currentQuestionIndex + 1} {t("stepper.of")} {questions.length}
        </p>

        {/* Last question label */}
        {isLastQuestion && (
          <p className="font-normal text-[22px] text-[#111827] mb-4 text-center">
            {t("answerQuestions.lastQuestionTitle")}
          </p>
        )}

        {/* Question text */}
        <h1 className="font-medium text-[32px] text-[#111827] mb-10 text-center max-w-2xl leading-tight">
          {questionText}
        </h1>

        {/* Input area */}
        <div className="w-full max-w-3xl">

          {/* ── Checkbox ─────────────────────────────────────────────────────── */}
          {question.type === "checkbox" && (
            <div className="space-y-3">
              {question.options.map((opt) => {
                const selected = Array.isArray(answer) ? answer : [];
                const isSelected = selected.includes(opt.value);
                const label = locale === "ar" ? opt.ar : opt.en;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 px-6 h-[72px] rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#2D86FE] bg-[#ECF4FF]"
                        : "border-[#E5E7EB] hover:border-blue-300 bg-[#FCFCFC]"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAnswer(question.id, [...selected, opt.value]);
                        } else {
                          setAnswer(question.id, selected.filter((v) => v !== opt.value));
                        }
                      }}
                      className="w-5 h-5 rounded-md border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <span className="font-normal text-[16px] text-[#101828] leading-tight flex-1">
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* ── Radio ────────────────────────────────────────────────────────── */}
          {question.type === "radio" && (
            <RadioGroup
              value={typeof answer === "string" ? answer : ""}
              onValueChange={(val) => setAnswer(question.id, val)}
              className="space-y-3"
            >
              {question.options.map((opt) => {
                const isSelected = answer === opt.value;
                const label = locale === "ar" ? opt.ar : opt.en;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 px-6 h-[72px] rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#2D86FE] bg-[#ECF4FF]"
                        : "border-[#E5E7EB] hover:border-blue-300 bg-[#FCFCFC]"
                    }`}
                  >
                    <RadioGroupItem
                      value={opt.value}
                      className="w-5 h-5 border-gray-300 text-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:border-[6px]"
                    />
                    <span className="font-normal text-[16px] text-[#101828] leading-tight flex-1">
                      {label}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
          )}

          {/* ── Text ─────────────────────────────────────────────────────────── */}
          {question.type === "text" && (
            <div className="relative bg-white rounded-xl shadow-sm">
              <Textarea
                placeholder="Enter your answer here"
                value={typeof answer === "string" ? answer : ""}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                className="min-h-[240px] resize-none w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl p-6 text-[15px] bg-transparent"
                maxLength={500}
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400">
                {((answer as string) || "").length}/500
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 md:px-8 py-5 w-full max-w-7xl mx-auto gap-4 md:gap-0 mt-8">
        {/* Back */}
        {currentQuestionIndex > 0 ? (
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex-1 md:flex-none md:w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] text-[#101828] border border-[#101828] bg-transparent hover:bg-gray-50 transition-all duration-200 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("common.back")}
          </button>
        ) : (
          <div className="flex-1 md:flex-none md:w-[184px]" />
        )}

        {/* Center: Empty space after removing skip */}
        <div className="flex-1 md:hidden" />

        <div className="flex-1 md:flex-none flex items-center justify-end">
          <button
            onClick={handleNext}
            disabled={isSubmitting || !isAnswerValid()}
            className="flex-1 md:flex-none md:w-[184px] h-[60px] rounded-[16px] font-normal text-[16px] transition-all duration-200 bg-[#101828] text-[#FCFCFC] hover:bg-[#1E293B] flex items-center justify-center gap-2 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("common.next")}
              </>
            ) : isLastQuestion ? (
              t("common.submit") ?? "Submit"
            ) : (
              t("common.next")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
