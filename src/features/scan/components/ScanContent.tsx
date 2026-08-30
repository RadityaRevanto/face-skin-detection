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
import { CameraPanel } from "@/src/features/scan/components/CameraPanel";
import { OtherConcernsCard } from "@/src/features/scan/components/OtherConcernsCard";
import { ProblemDetectionCard } from "@/src/features/scan/components/ProblemDetectionCard";
import { ProfileIncompleteModal } from "@/src/features/scan/components/ProfileIncompleteModal";
import { ScanFeedbackCard } from "@/src/features/scan/components/ScanFeedbackCard";
import { ScanNoticeBanner } from "@/src/features/scan/components/ScanNoticeBanner";
import { ScanRecommendationsSection } from "@/src/features/scan/components/ScanRecommendationsSection";
import { SkinStatusCard } from "@/src/features/scan/components/SkinStatusCard";
import { StepsCard } from "@/src/features/scan/components/StepsCard";
import { UploadImagePanel } from "@/src/features/scan/components/UploadImagePanel";

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

  // Gate #2 SCAN_FLOW: scan pertama butuh DOB + gender lengkap.
  const isProfileComplete =
    initialProfile &&
    initialProfile.gender &&
    initialProfile.date_of_birth;

  const [showProfileModal, setShowProfileModal] = useState(!isProfileComplete);

  const activePrediction = liveScan
    ? toPredictionHistory(liveScan)
    : initialPrediction;

  const confidencePercent = getConfidencePercent(activePrediction?.confidence);
  const tone = getToneBySeverity(
    activePrediction?.severity_level ?? null,
    activePrediction?.severity_score ?? null,
  );
  const skinProblems = getSkinProblemsFromPrediction(activePrediction);
  const hasScan = Boolean(activePrediction);

  return (
    <>
      {showProfileModal && (
        <ProfileIncompleteModal onSuccess={() => setShowProfileModal(false)} />
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
