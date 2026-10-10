"use client";

import { useState } from "react";
import type { SkinConcern } from "../types";
import { SkinConcernDetailHeader } from "./SkinConcernDetailHeader";
import { SkinConcernDetailMetadata } from "./SkinConcernDetailMetadata";
import { SkinConcernDetailEditor } from "./SkinConcernDetailEditor";

type SkinConcernDetailProps = {
  skinConcern: SkinConcern;
};

export function SkinConcernDetail({ skinConcern }: SkinConcernDetailProps) {
  const [currentDescription, setCurrentDescription] = useState(
    skinConcern.description || "",
  );

  function handleScrollToEditor() {
    const editorElement = document.getElementById("inlineEditorCard");
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: "smooth", block: "start" });
      const textarea = document.getElementById("medicalDescriptionInput");
      if (textarea) {
        textarea.focus();
      }
    }
  }

  function handleSuccess(newDesc: string) {
    setCurrentDescription(newDesc);
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Block */}
      <SkinConcernDetailHeader
        name={skinConcern.name ?? "Detail Skin Concern"}
        onEditClick={handleScrollToEditor}
      />

      {/* Dual Workspace: Mode Baca */}
      <SkinConcernDetailMetadata
        skinConcern={skinConcern}
        currentDescription={currentDescription}
      />

      {/* Dual Workspace: Mode Edit Inline */}
      <SkinConcernDetailEditor
        concernId={skinConcern.uuid}
        initialDescription={currentDescription}
        onSuccess={handleSuccess}
        onCancel={() => {
          const topElement = document.querySelector("h1");
          if (topElement) {
            topElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
      />
    </div>
  );
}
