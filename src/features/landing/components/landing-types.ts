import type { ReactNode } from "react";

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface LandingStep {
  number: string;
  title: string;
  description: string;
}
