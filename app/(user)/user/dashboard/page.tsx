import { redirect } from "next/navigation";
import {
  getCurrentUserProfile,
  getUserDashboardStats,
} from "@/features/user/services/user-service";
import { getRecommendationsByPredictedClass } from "@/features/user/services/recommendation-service";

export default async function UserDashboardPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  const stats = await getUserDashboardStats();

  const recommendations = stats.latestPrediction
    ? await getRecommendationsByPredictedClass(
        stats.latestPrediction.predicted_class,
      )
    : [];

  return (
    <div>
      {/* UI lama tetap dipakai, data dummy diganti dari variable ini */}
    </div>
  );
}
