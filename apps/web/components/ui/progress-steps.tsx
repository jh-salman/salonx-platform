"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium",
                    isCompleted && "bg-blue-600 border-blue-600 text-white",
                    isCurrent && "border-blue-600 text-blue-600 bg-blue-50",
                    !isCompleted && !isCurrent && "border-gray-300 text-gray-500"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2",
                      stepNumber < currentStep ? "bg-blue-600" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={cn("text-sm font-medium", isCurrent ? "text-blue-600" : "text-gray-500")}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 hidden sm:block">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
