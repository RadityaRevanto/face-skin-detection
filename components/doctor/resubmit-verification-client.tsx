"use client";

import { useState } from "react";
import { ResubmitVerificationModal } from "./resubmit-verification-modal";

export function ResubmitVerificationClient({ verificationId }: { verificationId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    // Reload page to fetch new verification status
    window.location.reload();
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        Upload Ulang Dokumen (Resubmit)
      </button>

      <ResubmitVerificationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        verificationId={verificationId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
