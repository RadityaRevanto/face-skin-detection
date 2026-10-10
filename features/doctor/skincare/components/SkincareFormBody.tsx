"use client";

import { AlertCircle } from "lucide-react";
import { SkincareFormBasicInfo } from "./SkincareFormBasicInfo";
import { SkincareFormClinicalDetails } from "./SkincareFormClinicalDetails";
import { SkincareFormActionBar } from "./SkincareFormActionBar";

type SkincareFormBodyProps = {
  message: string;
  concernId: string;
  setConcernId: (v: string) => void;
  skinTypeId: string;
  setSkinTypeId: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  genderSuitability: string;
  setGenderSuitability: (v: string) => void;
  keyIngredients: string;
  setKeyIngredients: (v: string) => void;
  usageInstruction: string;
  setUsageInstruction: (v: string) => void;
  warning: string;
  setWarning: (v: string) => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  concerns: { id: string; name: string }[];
  skinTypes: { id: string; name: string }[];
  submitLabel: string;
};

export function SkincareFormBody({
  message,
  concernId,
  setConcernId,
  skinTypeId,
  setSkinTypeId,
  name,
  setName,
  category,
  setCategory,
  genderSuitability,
  setGenderSuitability,
  keyIngredients,
  setKeyIngredients,
  usageInstruction,
  setUsageInstruction,
  warning,
  setWarning,
  isActive,
  setIsActive,
  isSubmitting,
  onCancel,
  concerns,
  skinTypes,
  submitLabel,
}: SkincareFormBodyProps) {
  return (
    <div className="space-y-6 pb-28">
      {message && (
        <div className="flex items-center gap-3 rounded-xl bg-error-container/30 border border-error/30 p-4 text-error font-body-default text-body-default font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <SkincareFormBasicInfo
        name={name}
        setName={setName}
        category={category}
        setCategory={setCategory}
        genderSuitability={genderSuitability}
        setGenderSuitability={setGenderSuitability}
      />

      <SkincareFormClinicalDetails
        concernId={concernId}
        setConcernId={setConcernId}
        skinTypeId={skinTypeId}
        setSkinTypeId={setSkinTypeId}
        concerns={concerns}
        skinTypes={skinTypes}
        keyIngredients={keyIngredients}
        setKeyIngredients={setKeyIngredients}
        usageInstruction={usageInstruction}
        setUsageInstruction={setUsageInstruction}
        warning={warning}
        setWarning={setWarning}
      />

      <SkincareFormActionBar
        isActive={isActive}
        setIsActive={setIsActive}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        submitLabel={submitLabel}
      />
    </div>
  );
}
