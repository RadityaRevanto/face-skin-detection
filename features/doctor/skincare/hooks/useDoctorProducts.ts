"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import type { DoctorProductRow } from "../types";

type ProductsResponse = {
  data: DoctorProductRow[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};
export type { ProductsResponse };

export function useDoctorProducts(page = 1, perPage = 10, search = "") {
  return useQuery({
    queryKey: ["doctor", "products", page, perPage, search],
    queryFn: async (): Promise<ProductsResponse> => {
      const response = await api.get("/doctor/products", {
        params: {
          page,
          per_page: perPage,
          ...(search ? { search } : {}),
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useDoctorProduct(uuid: string | null | undefined) {
  return useQuery({
    queryKey: ["doctor", "product", uuid],
    queryFn: async () => {
      const response = await api.get(`/skincare-products/${uuid}`);
      return response.data.data;
    },
    enabled: !!uuid,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/skincare-products", payload).then((r) => r.data),
    onSuccess: () => {
      customToast.success("Produk tersimpan", {
        description: "Produk skincare baru berhasil ditambahkan.",
      });
      queryClient.invalidateQueries({ queryKey: ["doctor", "products"] });
    },
    onError: (error) => {
      customToast.error("Gagal menyimpan produk", {
        description: getUserFriendlyErrorMessage(error),
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: Record<string, unknown> }) =>
      api.patch(`/skincare-products/${uuid}`, payload).then((r) => r.data),
    onSuccess: () => {
      customToast.success("Produk diperbarui", {
        description: "Perubahan produk berhasil disimpan.",
      });
      queryClient.invalidateQueries({ queryKey: ["doctor", "products"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", "product"] });
    },
    onError: (error) => {
      customToast.error("Gagal memperbarui produk", {
        description: getUserFriendlyErrorMessage(error),
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) =>
      api.delete(`/skincare-products/${uuid}`).then((r) => r.data),
    onSuccess: () => {
      customToast.success("Produk dihapus", {
        description: "Produk skincare telah dihapus.",
      });
      queryClient.invalidateQueries({ queryKey: ["doctor", "products"] });
    },
    onError: (error) => {
      customToast.error("Gagal menghapus produk", {
        description: getUserFriendlyErrorMessage(error),
      });
    },
  });
}
