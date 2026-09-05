"use client";

import { useState } from "react";

import {
  getConfidencePercent,
  getSkinProblemsFromPrediction,
  getToneBySeverity,
  normalizeSeverityLevel,
} from "../utils/scanHelpers";
import type {
  LiveScanResult,
  PredictionHistory,
} from "../types";
import { CameraPanel } from "@/features/scan/components/CameraPanel";
import { OtherConcernsCard } from "@/features/scan/components/OtherConcernsCard";
import { ProblemDetectionCard } from "@/features/scan/components/ProblemDetectionCard";
import { ProfileIncompleteModal } from "@/features/scan/components/ProfileIncompleteModal";
import { ScanFeedbackCard } from "@/features/scan/components/ScanFeedbackCard";
import { ScanNoticeBanner } from "@/features/scan/components/ScanNoticeBanner";
import { ScanRecommendationsSection } from "@/features/scan/components/ScanRecommendationsSection";
import { SkinStatusCard } from "@/features/scan/components/SkinStatusCard";
import { SeverityScoreCard } from "@/features/history/components/SeverityScoreCard";
import { StepsCard } from "@/features/scan/components/StepsCard";
import { UploadImagePanel } from "@/features/scan/components/UploadImagePanel";

type PemeriksaanContentProps = {
  initialPrediction?: PredictionHistory | null;
  initialProfile?: {
    uuid?: string;
    full_name?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
  } | null;
};

function toPredictionHistory(result: LiveScanResult): PredictionHistory {
  return {
    id: result.uuid,
    scan_mode: result.scan_mode,
    image_url: result.image_url,
    predicted_class: result.predicted_class,
    confidence: result.confidence,
    probabilities: result.probabilities,
    severity_score: result.severity_score,
    severity_level: normalizeSeverityLevel(result.severity_level),
    model_used: result.model_used,
    created_at: result.created_at ?? new Date().toISOString(),
    disclaimer: result.disclaimer,
    notice: result.notice,
    skin_concern: result.skin_concern,
    other_concerns: result.other_concerns,
    treatment_recommendations: result.treatment_recommendations,
    skincare_recommendations: result.skincare_recommendations,
  };
}

export function PemeriksaanContent({
  initialPrediction = null,
  initialProfile = null,
}: PemeriksaanContentProps) {
  const [liveScan, setLiveScan] = useState<LiveScanResult | null>(null);
  // Modal bisa ditutup user (onSuccess) — perlu state dismiss, default false.
  const [profileModalDismissed, setProfileModalDismissed] = useState(false);

  // Gate #2 SCAN_FLOW: scan pertama butuh DOB + gender lengkap.
  // Derived (bukan useState awal): `initialProfile` datang async dari query —
  // kalau pakai useState(!isProfileComplete) saat mount, modal terkunci true
  // untuk user yang datanya sebenarnya sudah lengkap (race condition).
  const isProfileComplete = Boolean(
    initialProfile &&
      initialProfile.gender &&
      initialProfile.date_of_birth,
  );

  // Modal hanya relevan SETELAH data profile benar-benar diambil
  // (initialProfile != null) dan terbukti belum lengkap.
  const showProfileModal =
    initialProfile != null && !isProfileComplete && !profileModalDismissed;

  const activePrediction = liveScan
    ? toPredictionHistory(liveScan)
    : initialPrediction;

  const confidencePercent = getConfidencePercent(activePrediction?.confidence);
  const tone = getToneBySeverity(
    activePrediction?.severity_level ?? null,
    activePrediction?.severity_score ?? null,
  );
  const skinProblems = getSkinProblemsFromPrediction(activePrediction);

  return (
    <>
      {showProfileModal && (
        <ProfileIncompleteModal onSuccess={() => setProfileModalDismissed(true)} />
      )}
      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.75fr] xl:gap-8">
        <div className="min-w-0 space-y-6">
          <CameraPanel
            onScanComplete={setLiveScan}
            onReset={() => setLiveScan(null)}
          />
          <UploadImagePanel
            onUploadComplete={setLiveScan}
            onReset={() => setLiveScan(null)}
          />
          <StepsCard />
        </div>

        <aside className="min-w-0 space-y-6">
          <SkinStatusCard
            latestPrediction={activePrediction}
            confidencePercent={confidencePercent}
            tone={tone}
            isLiveResult={Boolean(liveScan)}
          />

          {activePrediction?.severity_score != null && (
            <SeverityScoreCard
              severityScore={activePrediction.severity_score}
              severityLevel={activePrediction.severity_level}
            />
          )}

          {activePrediction?.notice ? (
            <ScanNoticeBanner notice={activePrediction.notice} />
          ) : null}

          <ProblemDetectionCard
            skinProblems={skinProblems}
            probabilities={activePrediction?.probabilities ?? null}
          />

          {activePrediction?.other_concerns?.length ? (
            <OtherConcernsCard concerns={activePrediction.other_concerns} />
          ) : null}

          <ScanRecommendationsSection
            treatmentRecommendations={
              activePrediction?.treatment_recommendations
            }
            skincareRecommendations={
              activePrediction?.skincare_recommendations
            }
          />

          {liveScan ? <ScanFeedbackCard historyId={liveScan.uuid} /> : null}
        </aside>
      </div>
    </>
  );
}
