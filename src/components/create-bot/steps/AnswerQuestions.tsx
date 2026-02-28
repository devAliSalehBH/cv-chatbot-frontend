"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

export const AnswerQuestions = () => {
  const t = useTranslations("createBot");
  const {
    questions,
    currentQuestionIndex,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    setStep,
  } = useCreateBotStore();

  const question = questions[currentQuestionIndex];
  const answer = answers[question.id];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      // Finished all questions, move to Phase 3 (we'll assume the string is cv-ai-bot-creating)
      // Actually, looking at Stepper, the label is "CV AI Bot Creating" but step id is 3. 
      // We haven't defined it in the store's Step types yet, so let's log it for now or add it to store soon.
      console.log("Finished all questions!");
      // setStep("cv-ai-bot-creating");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      prevQuestion();
    } else {
      setStep("linkedin-profile");
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full max-w-7xl mx-auto">
        
        {/* Desktop ONLY Question X of Y */}
        <p className="hidden md:block text-blue-500 text-sm font-semibold mb-3 text-center">
          {t("stepper.question")} {currentQuestionIndex + 1} {t("stepper.of")} {questions.length}
        </p>

        {/* Special Top Text for Q15 */}
        {currentQuestionIndex === questions.length - 1 && (
          <p className="text-gray-900 font-bold mb-4 text-[15px] text-center">
            {t("answerQuestions.lastQuestionTitle")}
          </p>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center max-w-2xl leading-tight">
          {question.question}
        </h1>
        {question.subtitle && (
          <p className="text-sm md:text-base text-gray-500 mb-10 text-center max-w-lg">
            {question.subtitle}
          </p>
        )}

        {/* Input area */}
        <div className="w-full max-w-3xl">
          {question.type === "checkbox" && (
            <div className="space-y-3">
              {question.options?.map((opt, i) => {
                const selected = Array.isArray(answer) ? answer : [];
                const isSelected = selected.includes(opt);
                return (
                  <label
                    key={i}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAnswer(question.id, [...selected, opt]);
                        } else {
                          setAnswer(
                            question.id,
                            selected.filter((item) => item !== opt)
                          );
                        }
                      }}
                      className="w-5 h-5 rounded-md border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <span className="text-[15px] font-medium text-gray-800 leading-tight">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === "radio" && (
            <RadioGroup
              value={answer || ""}
              onValueChange={(val) => setAnswer(question.id, val)}
              className="space-y-3"
            >
              {question.options?.map((opt, i) => {
                const isSelected = answer === opt;
                return (
                  <label
                    key={i}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <RadioGroupItem
                      value={opt}
                      className="w-5 h-5 border-gray-300 text-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:border-[6px]"
                    />
                    <span className="text-[15px] font-medium text-gray-800 leading-tight">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
          )}

          {question.type === "text" && (
            <div className="relative bg-white rounded-xl shadow-sm">
              <Textarea
                placeholder="Enter your answer here"
                value={answer || ""}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                className="min-h-[240px] resize-none w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl p-6 text-[15px] bg-transparent"
                maxLength={500}
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400">
                {(answer || "").length}/500
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar with Back, Skip, Next buttons */}
      <div className="flex items-center justify-between px-6 md:px-8 py-5 w-full max-w-7xl mx-auto gap-4 md:gap-0 mt-8">
        {/* Left: Back */}
        <button
          onClick={handleBack}
          className="w-24 md:w-auto px-4 md:px-7 py-3 md:py-2.5 rounded-xl text-[15px] md:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm bg-white"
        >
          {t("common.back")}
        </button>

        {/* Mobile Skip (visually centered in available space) */}
        <div className="flex-1 flex justify-center md:hidden">
          <button
            onClick={handleNext}
            className="text-[15px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("common.skip")}
          </button>
        </div>

        <div className="flex-1 md:flex-none flex items-center justify-end gap-2 md:gap-6">
          <button
            onClick={handleNext}
            className="hidden md:block text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("common.skip")}
          </button>
          <button
            onClick={handleNext}
            // Optional: You could disable Next if answer is empty, but the screenshots show users skipping.
            className="flex-1 md:flex-none md:w-auto px-4 md:px-10 py-3 md:py-2.5 rounded-xl text-[15px] md:text-sm font-semibold transition-all duration-200 bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm whitespace-nowrap"
          >
            {t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
};
