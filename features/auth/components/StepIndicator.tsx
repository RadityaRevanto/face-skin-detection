"use client";

import { Check } from "lucide-react";

type Step = {
  label: string;
  shortLabel?: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
};

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={i} className="flex items-center gap-1 sm:gap-2">
            {/* Step circle + label */}
            <button
              type="button"
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={[
                "flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3",
                isCurrent
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : isCompleted
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-zinc-100 text-zinc-400",
                isClickable ? "cursor-pointer hover:ring-2 hover:ring-emerald-300" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  isCurrent
                    ? "bg-white/20 text-white"
                    : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-200 text-zinc-500",
                ].join(" ")}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              {/* Label: short on mobile, full on desktop */}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.shortLabel ?? step.label}</span>
            </button>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={[
                  "h-px w-4 sm:w-8",
                  i < currentStep ? "bg-emerald-300" : "bg-zinc-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
