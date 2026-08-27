"use client";

import { useState } from "react";

import {
  getConfidencePercent,
  getSkinProblemsFromPrediction,
  getToneBySeverity,
  normalizeSeverityLevel,
} from "../_lib/pemeriksaan-utils";
import type {
  LiveScanResult,
  PredictionHistory,
  Recommendation,
} from "../_lib/pemeriksaan-types";
import { CameraPanel } from "./camera-panel";
import { ProblemDetectionCard } from "./problem-detection-card";
import { RecommendationCard } from "./recommendation-card";
import { SkinStatusCard } from "./skin-status-card";
import { StepsCard } from "./steps-card";
import { UploadImagePanel } from "./upload-image-panel";

import { ProfileIncompleteModal } from "./profile-incomplete-modal";

type PemeriksaanContentProps = {
  initialPrediction?: PredictionHistory | null;
  initialRecommendations?: Recommendation[];
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
  };
}

export function PemeriksaanContent({
  initialPrediction = null,
  initialRecommendations = [],
  initialProfile = null,
}: PemeriksaanContentProps) {
  const [liveScan, setLiveScan] = useState<LiveScanResult | null>(null);
  
  // Periksa apakah profile memiliki gender dan date_of_birth
  const isProfileComplete = 
    initialProfile && 
    initialProfile.gender && 
    initialProfile.date_of_birth;
    
  const [showProfileModal, setShowProfileModal] = useState(!isProfileComplete);

  const activePrediction = liveScan
    ? toPredictionHistory(liveScan)
    : initialPrediction;

  // Endpoint scan backend tidak mengembalikan rekomendasi;
  // setelah scan live tampilkan kosong sampai user membuka halaman rekomendasi.
  const recommendations = liveScan ? [] : initialRecommendations;
  const confidencePercent = getConfidencePercent(activePrediction?.confidence);
  const tone = getToneBySeverity(
    activePrediction?.severity_level ?? null,
    activePrediction?.severity_score ?? null,
  );
  const skinProblems = getSkinProblemsFromPrediction(activePrediction);

  return (
    <>
      {showProfileModal && (
        <ProfileIncompleteModal onSuccess={() => setShowProfileModal(false)} />
      )}
      <div className='grid gap-6 xl:grid-cols-[1.65fr_0.75fr] xl:gap-8'>
        <div className='min-w-0 space-y-6'>
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

      <aside className='min-w-0 space-y-6'>
        <SkinStatusCard
          latestPrediction={activePrediction}
          confidencePercent={confidencePercent}
          tone={tone}
          isLiveResult={Boolean(liveScan)}
        />

        <ProblemDetectionCard
          skinProblems={skinProblems}
          probabilities={activePrediction?.probabilities ?? null}
        />

        <RecommendationCard recommendations={recommendations} />
      </aside>
    </div>
    </>
  );
}
