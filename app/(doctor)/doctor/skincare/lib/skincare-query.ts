import { requireDoctorProfile } from "@/lib/doctor-auth";
import { createClient } from "@/lib/supabase/server";

import type { SkincarePageData, SkincareRow } from "./skincare-types";

const PAGE_SIZE = 10;

type GetSkincarePageDataParams = {
  page?: number;
};

type SkincareProductDatabaseRow = {
  id: string;
  doctor_id: string;
  concern_id: string | null;
  skin_type_id: string | null;
  name: string | null;
  category: string | null;
  key_ingredients: string | null;
  usage_instruction: string | null;
  warning: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type SkinConcernRow = {
  id: string;
  name: string | null;
};

type SkinTypeRow = {
  id: string;
  name: string | null;
};

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

async function countSkinConcerns() {
  const supabase = await createClient();

  const { count, error } = await supabase.from("skin_concerns").select("*", {
    count: "exact",
    head: true,
  });

  if (error) {
    console.error("Failed to count skin concerns:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return 0;
  }

  return count ?? 0;
}

export async function getSkincarePageData({
  page = 1,
}: GetSkincarePageDataParams = {}): Promise<SkincarePageData> {
  const doctor = await requireDoctorProfile();
  const supabase = await createClient();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const {
    data: productData,
    error: productError,
    count,
  } = await supabase
    .from("skincare_products")
    .select(
      `
      id,
      doctor_id,
      concern_id,
      skin_type_id,
      name,
      category,
      key_ingredients,
      usage_instruction,
      warning,
      is_active,
      created_at,
      updated_at
      `,
      {
        count: "exact",
      },
    )
    .eq("doctor_id", doctor.id)
    .order("updated_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (productError) {
    console.error("Failed to fetch skincare products:", {
      message: productError.message,
      details: productError.details,
      hint: productError.hint,
      code: productError.code,
    });

    return {
      products: [],
      summary: {
        totalProducts: 0,
        totalCategories: 0,
        totalConcerns: 0,
      },
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }

  const productRows = (productData ?? []) as SkincareProductDatabaseRow[];

  const concernIds = Array.from(
    new Set(productRows.map((product) => product.concern_id).filter(Boolean)),
  ) as string[];

  const skinTypeIds = Array.from(
    new Set(productRows.map((product) => product.skin_type_id).filter(Boolean)),
  ) as string[];

  let concernsById = new Map<string, SkinConcernRow>();
  let skinTypesById = new Map<string, SkinTypeRow>();

  if (concernIds.length > 0) {
    const { data: concernData, error: concernError } = await supabase
      .from("skin_concerns")
      .select("id, name")
      .in("id", concernIds);

    if (concernError) {
      console.error("Failed to fetch skin concerns for skincare products:", {
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

  if (skinTypeIds.length > 0) {
    const { data: skinTypeData, error: skinTypeError } = await supabase
      .from("skin_types")
      .select("id, name")
      .in("id", skinTypeIds);

    if (skinTypeError) {
      console.error("Failed to fetch skin types for skincare products:", {
        message: skinTypeError.message,
        details: skinTypeError.details,
        hint: skinTypeError.hint,
        code: skinTypeError.code,
      });
    }

    skinTypesById = new Map(
      ((skinTypeData ?? []) as SkinTypeRow[]).map((skinType) => [
        skinType.id,
        skinType,
      ]),
    );
  }

  const products: SkincareRow[] = productRows.map((product, index) => {
    const concern = product.concern_id
      ? concernsById.get(product.concern_id)
      : null;

    const skinType = product.skin_type_id
      ? skinTypesById.get(product.skin_type_id)
      : null;

    return {
      id: product.id,
      no: from + index + 1,
      name: product.name ?? "-",
      category: product.category ?? "-",
      keyIngredients: product.key_ingredients ?? "-",
      concern: concern?.name ?? "-",
      skinType: skinType?.name ?? "-",
      updatedAt: formatDate(product.updated_at ?? product.created_at),
    };
  });

  const uniqueCategories = new Set(
    productRows.map((product) => product.category).filter(Boolean),
  );

  const totalConcerns = await countSkinConcerns();

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return {
    products,
    summary: {
      totalProducts: totalItems,
      totalCategories: uniqueCategories.size,
      totalConcerns,
    },
    pagination: {
      currentPage: safePage,
      totalPages,
      totalItems,
      pageSize: PAGE_SIZE,
    },
  };
}
