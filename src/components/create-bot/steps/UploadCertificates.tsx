"use client";

import { useCreateBotStore } from "@/store/create-bot-store";
import { FileUpload } from "@/components/create-bot/FileUpload";
import { Button } from "@/components/ui/button";

export const UploadCertificates = () => {
  const { certificates, addCertificates, removeCertificate, setStep } =
    useCreateBotStore();

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      addCertificates(files);
    }
  };

  const handleNext = () => {
    setStep("linkedin-profile");
  };

  const handleBack = () => {
    setStep("upload-resume");
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Upload Your Certificates
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Upload your certificates to enhance your profile.
      </p>

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <FileUpload
          onDrop={handleDrop}
          multiple={true}
          label="Drop your certificates here"
        />

        {certificates.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
            {certificates.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-600 truncate">
                  {file.name}
                </span>
                <button
                  onClick={() => removeCertificate(index)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
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
