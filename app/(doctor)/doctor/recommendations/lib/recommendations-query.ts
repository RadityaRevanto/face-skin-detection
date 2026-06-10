import { requireDoctorProfile } from "@/lib/doctor-auth";
import { createClient } from "@/lib/supabase/server";

import type {
  RecommendationRow,
  RecommendationsPageData,
} from "./recommendations-types";

const PAGE_SIZE = 10;

type GetRecommendationsPageDataParams = {
  page?: number;
};

type SkinRecommendationRow = {
  id: string;
  doctor_id: string;
  concern_id: string;
  product_id: string | null;
  title: string | null;
  recommendation_text: string | null;
  priority_level: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

type SkinConcernRow = {
  id: string;
  name: string | null;
};

type SkincareProductRow = {
  id: string;
  name: string | null;
  category: string | null;
};

function formatPriority(value: string | null | undefined) {
  if (value === "high") return "High Priority";
  if (value === "medium") return "Medium Priority";
  if (value === "low") return "Low Priority";

  return "-";
}

async function countRows(
  table: "skin_recommendations" | "skin_concerns",
  doctorId?: string,
) {
  const supabase = await createClient();

  let query = supabase.from(table).select("*", {
    count: "exact",
    head: true,
  });

  if (table === "skin_recommendations" && doctorId) {
    query = query.eq("doctor_id", doctorId);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`Failed to count ${table}:`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return 0;
  }

  return count ?? 0;
}

export async function getRecommendationsPageData({
  page = 1,
}: GetRecommendationsPageDataParams = {}): Promise<RecommendationsPageData> {
  const doctor = await requireDoctorProfile();
  const supabase = await createClient();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const {
    data: recommendationData,
    error: recommendationError,
    count,
  } = await supabase
    .from("skin_recommendations")
    .select(
      `
      id,
      doctor_id,
      concern_id,
      product_id,
      title,
      recommendation_text,
      priority_level,
      is_active,
      created_at
      `,
      {
        count: "exact",
      },
    )
    .eq("doctor_id", doctor.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (recommendationError) {
    console.error("Failed to fetch doctor recommendations:", {
      message: recommendationError.message,
      details: recommendationError.details,
      hint: recommendationError.hint,
      code: recommendationError.code,
    });

    return {
      recommendations: [],
      summary: {
        totalRecommendations: 0,
        totalConcerns: 0,
        totalRoutineSteps: 0,
      },
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }

  const recommendationRows = (recommendationData ??
    []) as SkinRecommendationRow[];

  const concernIds = Array.from(
    new Set(
      recommendationRows
        .map((recommendation) => recommendation.concern_id)
        .filter(Boolean),
    ),
  );

  const productIds = Array.from(
    new Set(
      recommendationRows
        .map((recommendation) => recommendation.product_id)
        .filter(Boolean),
    ),
  ) as string[];

  let concernsById = new Map<string, SkinConcernRow>();
  let productsById = new Map<string, SkincareProductRow>();

  if (concernIds.length > 0) {
    const { data: concernData, error: concernError } = await supabase
      .from("skin_concerns")
      .select("id, name")
      .in("id", concernIds);

    if (concernError) {
      console.error("Failed to fetch skin concerns:", {
        message: concernError.message,
        details: concernError.details,
        hint: concernError.hint,
        code: concernError.code,
      });
    }

    concernsById = new Map(
      ((concernData ?? []) as SkinConcernRow[]).map((concern) => [
        concern.id,
        concern,
      ]),
    );
  }

  if (productIds.length > 0) {
    const { data: productData, error: productError } = await supabase
      .from("skincare_products")
      .select("id, name, category")
      .in("id", productIds);

    if (productError) {
      console.error("Failed to fetch skincare products:", {
        message: productError.message,
        details: productError.details,
        hint: productError.hint,
        code: productError.code,
      });
    }

    productsById = new Map(
      ((productData ?? []) as SkincareProductRow[]).map((product) => [
        product.id,
        product,
      ]),
    );
  }

  const recommendations: RecommendationRow[] = recommendationRows.map(
    (recommendation, index) => {
      const concern = concernsById.get(recommendation.concern_id);

      const product = recommendation.product_id
        ? productsById.get(recommendation.product_id)
        : null;

      return {
        id: recommendation.id,
        no: from + index + 1,
        concern: concern?.name ?? "-",
        severity: formatPriority(recommendation.priority_level),
        skinType: "Semua tipe kulit",
        productName: product?.name ?? "-",
        productBrand: product?.category ?? "-",
        routineStep: recommendation.title ?? "-",
        doctorNote: recommendation.recommendation_text ?? "-",
      };
    },
  );

  const [totalRecommendations, totalConcerns] = await Promise.all([
    countRows("skin_recommendations", doctor.id),
    countRows("skin_concerns"),
  ]);

  const uniqueRoutineSteps = new Set(
    recommendationRows.map((item) => item.title).filter(Boolean),
  );

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return {
    recommendations,
    summary: {
      totalRecommendations,
      totalConcerns,
      totalRoutineSteps: uniqueRoutineSteps.size,
    },
    pagination: {
      currentPage: safePage,
      totalPages,
      totalItems,
      pageSize: PAGE_SIZE,
    },
  };
}
