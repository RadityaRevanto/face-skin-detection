"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { DoctorProfileClientContent } from "@/features/doctors/components/DoctorProfileClientContent";

export default function DoctorProfilePage() {
  return (
    <Suspense>
      <DoctorProfilePageInner />
    </Suspense>
  );
}

function DoctorProfilePageInner() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

  return <DoctorProfileClientContent doctorUuid={uuid} />;
}
