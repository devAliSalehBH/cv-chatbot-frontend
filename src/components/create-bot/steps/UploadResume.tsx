"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { FileUpload } from "@/components/create-bot/FileUpload";
import { Button } from "@/components/ui/button";

export const UploadResume = () => {
  const { setResume, setStep, resume } = useCreateBotStore();

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setResume(files[0]);
    }
  };

  const handleNext = () => {
    if (resume) {
      setStep("upload-certificates");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Upload Your Resume
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Let's start by uploading your resume. We'll analyze it to create your AI
        chatbot.
      </p>

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <FileUpload onDrop={handleDrop} />
        {resume && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-green-700">
              Selected: {resume.name}
            </span>
            <button
              onClick={() => setResume(null)}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end w-full max-w-2xl">
        <Button
          onClick={handleNext}
          disabled={!resume}
          className="bg-[#0F172A] text-white px-8 py-2 rounded-lg hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
