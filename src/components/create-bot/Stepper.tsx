import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Upload Info" },
  { id: 2, label: "Answer Questions" },
  { id: 3, label: "CV AI Bot Creating" },
  { id: 4, label: "Preview" },
  { id: 5, label: "Share CV Bot" },
];

interface StepperProps {
  currentStep: number;
}

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="w-full flex justify-between items-center px-4 md:px-20 py-6">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="flex flex-col items-center flex-1">
            {/* Label */}
            <span
              className={cn(
                "text-[10px] md:text-sm font-medium mb-2 text-center",
                isActive ? "text-gray-900" : "text-gray-400",
              )}
            >
              {step.label}
            </span>

            {/* Progress Bar Segment */}
            <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden relative">
              <div
                className={cn(
                  "absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-in-out",
                  isActive ? "w-1/2" : isCompleted ? "w-full" : "w-0",
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
