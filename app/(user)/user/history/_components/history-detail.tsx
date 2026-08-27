import type { PredictionHistory } from "../_lib/history-types";
import { ScanImageCard } from "./scan-image-card";
import { SeverityScoreCard } from "./severity-score-card";
import { ProbabilityChart } from "./probability-chart";
import { OtherConcernsCard } from "./other-concerns-card";
import { ScanFeedbackCard } from "./scan-feedback-card";
import { DisclaimerNotice } from "./disclaimer-notice";

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
