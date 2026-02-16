import { useCallback, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  label?: string;
  className?: string;
  files?: File[];
  onRemove?: (index: number) => void;
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
  label = "Drop your files here",
  className,
  files = [],
  onRemove,
}: FileUploadProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[300px]",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-white hover:bg-gray-50",
        )}
      >
        <input {...getInputProps()} />
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <UploadCloud className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-2">{label}</p>
        <p className="text-sm text-gray-500 mb-6">or click to browse</p>

        <button
          type="button"
          className="px-6 py-2 bg-[#0F172A] text-white rounded-md text-sm font-medium hover:bg-[#1E293B] transition-colors"
        >
          Upload file
        </button>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <FileText className="w-4 h-4" />
          <span>PDF, DOCX, TXT</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-blue-100 p-2 rounded">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
