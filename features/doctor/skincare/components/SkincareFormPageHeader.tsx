import { PageHeader } from "@/components/ui/page-header";
import { ROUTES } from "@/lib/constants";

export function SkincareFormPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <PageHeader
      backHref={ROUTES.DOCTOR.SKINCARE}
      backLabel="Kembali ke Data Skincare"
      title={title}
      description={description}
    />
  );
}