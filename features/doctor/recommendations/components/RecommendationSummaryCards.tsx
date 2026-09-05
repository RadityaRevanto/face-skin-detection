import { GradientSummaryCards } from "@/features/shared/components/GradientSummaryCards";

import type { RecommendationSummary } from "@/features/doctor/recommendations/lib/recommendationsTypes";

type RecommendationSummaryCardsProps = {
  summary: RecommendationSummary;
};

function ListWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function FaceWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0-1.007-.8-1.8-1.8-1.8s-1.8.793-1.8 1.8.8 1.8 1.8 1.8 1.8-.793 1.8-1.8zm7.5 0c0-1.007-.8-1.8-1.8-1.8s-1.8.793-1.8 1.8.8 1.8 1.8 1.8 1.8-.793 1.8-1.8z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function SunMoonWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export function RecommendationSummaryCards({
  summary,
}: RecommendationSummaryCardsProps) {
  const cards = [
    {
      label: "Total Rekomendasi",
      value: String(summary.totalRecommendations),
      helper: "Mapping rekomendasi aktif",
      variant: "navy" as const,
      icon: <ListWatermark />,
    },
    {
      label: "Skin Concern",
      value: String(summary.totalConcerns),
      helper: "Concern yang memiliki rule",
      variant: "emerald" as const,
      icon: <FaceWatermark />,
    },
    {
      label: "Routine Step",
      value: String(summary.totalRoutineSteps),
      helper: "Pagi dan malam",
      variant: "amber" as const,
      icon: <SunMoonWatermark />,
    },
  ];

  return <GradientSummaryCards cards={cards} />;
}
