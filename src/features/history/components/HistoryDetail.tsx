import type { PredictionHistory } from "../types";
import { ScanImageCard } from "./ScanImageCard";
import { SeverityScoreCard } from "./SeverityScoreCard";
import { ProbabilityChart } from "./ProbabilityChart";
import { OtherConcernsCard } from "@/src/features/scan/components/OtherConcernsCard";
import { ScanFeedbackCard } from "@/src/features/scan/components/ScanFeedbackCard";
import { DisclaimerNotice } from "./DisclaimerNotice";

type HistoryDetailProps = {
  history: PredictionHistory;
};

export function HistoryDetail({ history }: HistoryDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ScanImageCard history={history} />

        <div className="space-y-6">
          {history.severity_score != null && (
            <SeverityScoreCard severityScore={history.severity_score} severityLevel={history.severity_level} />
          )}
          {history.probabilities && <ProbabilityChart probabilities={history.probabilities} />}
          {history.other_concerns && <OtherConcernsCard concerns={history.other_concerns} />}
        </div>
      </div>

      <ScanFeedbackCard historyId={history.id} />
      <DisclaimerNotice disclaimer={history.disclaimer} notice={history.notice} />
    </div>
  );
}
