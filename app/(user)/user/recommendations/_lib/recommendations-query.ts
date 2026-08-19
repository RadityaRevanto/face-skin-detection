import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SkinRecommendation } from "../../history/_lib/history-types";

export async function getConcernName(concernId: string) {
  const supabase = await createClient();

  const { data: concern, error } = await supabase
    .from("skin_concerns")
    .select("name")
    .eq("id", concernId)
    .maybeSingle();

  if (error || !concern) {
    return null;
  }

  return concern.name;
}

export async function getPaginatedRecommendations(
  concernId: string,
  page: number,
  limit: number = 5
) {
  const supabase = await createClient();
  
  // Hitung total rekomendasi
  const { count, error: countError } = await supabase
    .from("skin_recommendations")
    .select("*", { count: "exact", head: true })
    .eq("concern_id", concernId)
    .eq("is_active", true);

  if (countError) {
    console.error("Failed to count recommendations:", countError);
    return { data: [], totalPages: 0, currentPage: page };
  }

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / limit);
  
  // Pastikan page valid
  const currentPage = page < 1 ? 1 : page > totalPages && totalPages > 0 ? totalPages : page;
  
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  // Ambil data
  // Karena kita butuh sorting berdasarkan enum ('high', 'medium', 'low') di level database,
  // di postgres hal ini sedikit tricky tanpa fungsi khusus. 
  // Sebagai solusi cepat, kita bisa mengambil seluruh ID yang valid lalu sort di JS dan potong.
  // Tapi karena kita mau "paginasi sejati", kita ambil semua dulu untuk skin concern ini (toh datanya per concern biasanya tidak ratusan ribu)
  // lalu sort di javascript, baru kita paginasi di memori (lebih aman untuk saat ini).
  
  const { data: allRecommendations, error } = await supabase
    .from("skin_recommendations")
    .select(`
      *,
      skincare_products (*)
    `)
    .eq("concern_id", concernId)
    .eq("is_active", true);

  if (error || !allRecommendations) {
    console.error("Failed to fetch paginated recommendations:", error);
    return { data: [], totalPages: 0, currentPage };
  }

  // Sort
  const sorted = allRecommendations.sort((a, b) => {
    const priorityWeight: Record<string, number> = { high: 1, medium: 2, low: 3 };
    const weightA = priorityWeight[a.priority_level] || 3;
    const weightB = priorityWeight[b.priority_level] || 3;
    return weightA - weightB;
  });

  // Paginate di memory
  const paginatedData = sorted.slice(from, from + limit);

  return {
    data: paginatedData as unknown as SkinRecommendation[],
    totalPages,
    currentPage,
  };
}
