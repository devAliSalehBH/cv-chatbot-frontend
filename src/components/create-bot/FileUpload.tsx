"use client";

import { useCallback, useState } from "react";
import { UploadCloud, FileText, Trash2, CheckCircle2, Upload } from "lucide-react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface FileUploadProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  files?: File[];
  onRemove?: (index: number) => void;
  compactLabel?: string;
  dropzoneLabel?: React.ReactNode;
}

export const FileUpload = ({
  onDrop,
  accept = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/plain": [".txt"],
  },
  multiple = false,
  files = [],
  onRemove,
  compactLabel = "Drop Another File",
  dropzoneLabel,
}: FileUploadProps) => {
  const t = useTranslations("createBot.fileUpload");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const getFileType = (file: File) => {
    if (file.type === "application/pdf") return "PDF Document";
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "Word Document";
    if (file.type === "text/plain") return "Text File";
    return "Document";
  };

  // Show uploaded files state
  if (files.length > 0) {
    return (
      <div className="w-full space-y-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5"
          >
            {/* File info row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Check icon */}
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />

                {/* File icon */}
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>

                {/* Name + meta */}
                <div>
                  <p className="font-normal text-[18px] text-[#111827] leading-tight">
                    {file.name}
                  </p>
                  <p className="font-normal text-[14px] text-[#64748B] mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} MB &nbsp;·&nbsp;{" "}
                    {getFileType(file)}
                  </p>
                </div>
              </div>

              {/* Delete button */}
              {onRemove && (
                <button
                  onClick={() => onRemove(index)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Progress bar - full green */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full w-full bg-[#12B76A] rounded-full" />
            </div>

            {/* Upload complete */}
            <p className="font-normal text-[14px] text-[#12B76A]">
              Upload complete
            </p>
          </div>
        ))}

        {/* Compact Dropzone for multiple files */}
        {multiple && (
          <div
            {...getRootProps()}
            className={cn(
              "w-full rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 flex items-center justify-between px-5 py-4 mt-2",
              isDragActive
                ? "border-blue-400 bg-blue-50/60"
                : "bg-white hover:border-blue-300 hover:bg-blue-50/30"
            )}
          >
            <input {...getInputProps()} />
            
            <div className="flex items-center gap-4">
              {/* Upload icon in circle */}
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <UploadCloud className="w-5 h-5 text-blue-500" />
              </div>
              <p className="font-normal text-[18px] text-[#111827]">
                {compactLabel}
              </p>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <span className="text-sm text-gray-400">or</span>
              
              {/* Desktop Button */}
              <button
                type="button"
                className="hidden md:block px-6 py-2.5 bg-[#101828] text-[#FCFCFC] rounded-lg font-normal text-[16px] hover:bg-[#1E293B] transition-colors"
              >
                {t("uploadFile")}
              </button>

              {/* Mobile Icon Symbol */}
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="md:hidden text-gray-800 hover:text-black transition-colors"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Empty state - large dropzone
  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full border-[1.6px] border-dashed rounded-[32px] cursor-pointer transition-all duration-200 flex flex-col items-center justify-center py-10 md:py-16 px-6",
        isDragActive
          ? "border-blue-400 bg-blue-50/60"
          : "border-[#CBD5E1] bg-transparent hover:border-blue-300 hover:bg-blue-50/30",
      )}
    >
      <input {...getInputProps()} />

      {/* Upload icon in circle */}
      <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-5 md:mb-5">
        <UploadCloud className="w-7 h-7 text-blue-500" />
      </div>

      <div className="font-semibold text-[24px] text-[#101828] mb-1">
        {dropzoneLabel}
      </div>
      <p className="hidden md:block font-normal text-[16px] text-[#4A5565] mb-5">{t("browse")}</p>

      {/* Supported formats */}
      <div className="flex items-center justify-center gap-1.5 font-normal text-[14px] text-[#64748B] mb-6 md:mb-6 mt-3 md:mt-0 text-center w-full">
        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="hidden md:inline">PDF, DOCX, TXT</span>
        <span className="md:hidden">{t("formats")}</span>
      </div>

      {/* Upload file button */}
      <button
        type="button"
        className="px-6 py-2.5 bg-[#101828] text-[#FCFCFC] rounded-lg font-normal text-[16px] hover:bg-[#1E293B] transition-colors"
      >
        {t("uploadFile")}
      </button>
    </div>
  );
};
