"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";

export const LinkedInProfile = () => {
  const { linkedinUrl, setLinkedinUrl, setStep } = useCreateBotStore();

  const handleNext = () => {
    // Validation logic can go here
    console.log("Finished Phase 1 with:", { linkedinUrl });
    // TODO: Move to next main phase
  };

  const handleBack = () => {
    setStep("upload-certificates");
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Add Your LinkedIn Profile
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Enter your LinkedIn profile URL to enhance your CV Bot with professional
        details.
      </p>

      <div className="w-full max-w-2xl bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <div className="bg-[#0077b5] p-3 rounded-lg mb-4">
          <Linkedin className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          LinkedIn Profile URL
        </h3>

        <div className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="bg-[#0077b5] rounded p-0.5">
              <span className="text-[10px] font-bold text-white">in</span>
            </div>
          </div>
          <Input
            type="url"
            placeholder="Paste your LinkedIn profile URL"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="pl-10 h-12 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between w-full max-w-2xl">
        <Button
          variant="outline"
          onClick={handleBack}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
        >
          Back
        </Button>
        <div className="flex gap-4">
          <button
            onClick={handleNext}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4"
          >
            Skip
          </button>
          <Button
            onClick={handleNext}
            className="bg-[#0F172A] text-white px-8 py-2 rounded-lg hover:bg-[#1E293B]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
