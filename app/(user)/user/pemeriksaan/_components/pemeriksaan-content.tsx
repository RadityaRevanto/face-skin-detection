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

type PemeriksaanContentProps = {
  initialPrediction?: PredictionHistory | null;
  initialRecommendations?: Recommendation[];
};

function toPredictionHistory(result: LiveScanResult): PredictionHistory {
  return {
    id: result.history_id ?? "live",
    scan_mode: result.scan_mode ?? "livecam_yolo",
    image_url: result.image_url ?? result.cropped_image_url ?? null,
    cropped_image_url: result.cropped_image_url ?? null,
    predicted_class: result.prediction.predicted_class,
    confidence: result.prediction.confidence,
    probabilities: result.prediction.probabilities,
    severity_score: result.prediction.severity_score,
    severity_level: normalizeSeverityLevel(result.prediction.severity_level),
    model_used: result.prediction.model_used,
    created_at: new Date().toISOString(),
  };
}

export function PemeriksaanContent({
  initialPrediction = null,
  initialRecommendations = [],
}: PemeriksaanContentProps) {
  const [liveScan, setLiveScan] = useState<LiveScanResult | null>(null);

  const activePrediction = liveScan
    ? toPredictionHistory(liveScan)
    : initialPrediction;

  const recommendations = liveScan?.recommendations ?? initialRecommendations;
  const confidencePercent = getConfidencePercent(activePrediction?.confidence);
  const tone = getToneBySeverity(
    activePrediction?.severity_level ?? null,
    activePrediction?.severity_score ?? null,
  );
  const skinProblems = getSkinProblemsFromPrediction(activePrediction);

  return (
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
  );
}
