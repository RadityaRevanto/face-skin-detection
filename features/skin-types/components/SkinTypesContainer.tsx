"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ErrorState } from "@/components/ui/error-state";
import { customToast } from "@/lib/custom-toast";
import type { SkinType } from "../types";
import {
  getSkinTypes,
  createSkinType,
  updateSkinType,
  deleteSkinType,
} from "../services/skinTypesService";

import { SkinTypesHeader } from "./SkinTypesHeader";
import { SkinTypesInformationalBanner } from "./SkinTypesInformationalBanner";
import { SkinTypesTable } from "./SkinTypesTable";
import { SkinTypesEducationalCard } from "./SkinTypesEducationalCard";
import { SkinTypeModal } from "./SkinTypeModal";
import { SkinTypeDeleteModal } from "./SkinTypeDeleteModal";

export function SkinTypesContainer() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkinType, setEditingSkinType] = useState<SkinType | null>(null);
  const [deletingSkinType, setDeletingSkinType] = useState<SkinType | null>(null);

  // TanStack Query for skin types
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ["skin-types"],
    queryFn: () => getSkinTypes(1, 50),
  });

  const skinTypes = response?.data ?? [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) => createSkinType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skin-types"] });
      customToast.success("Skin type berhasil ditambahkan");
      setModalOpen(false);
    },
    onError: (err: unknown) => {
      customToast.error(err instanceof Error ? err.message : "Gagal menambahkan skin type");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: { name: string; description?: string } }) =>
      updateSkinType(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skin-types"] });
      customToast.success("Skin type berhasil diperbarui");
      setModalOpen(false);
      setEditingSkinType(null);
    },
    onError: (err: unknown) => {
      customToast.error(err instanceof Error ? err.message : "Gagal memperbarui skin type");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => deleteSkinType(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skin-types"] });
      customToast.success("Skin type berhasil dihapus");
      setDeletingSkinType(null);
    },
    onError: (err: unknown) => {
      customToast.error(err instanceof Error ? err.message : "Gagal menghapus skin type");
    },
  });

  async function handleModalSubmit(data: { name: string; description?: string }) {
    if (editingSkinType) {
      await updateMutation.mutateAsync({ uuid: editingSkinType.uuid, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingSkinType) return;
    await deleteMutation.mutateAsync(deletingSkinType.uuid);
  }

  if (isError) {
    return <ErrorState message="Gagal memuat data klasifikasi skin types." onRetry={() => refetch()} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Bar Header */}
      <SkinTypesHeader
        activeCount={skinTypes.length}
        totalCount={skinTypes.length}
        onAddClick={() => {
          setEditingSkinType(null);
          setModalOpen(true);
        }}
      />

      {/* Clinical Informational Banner & Micro Visuals */}
      <SkinTypesInformationalBanner totalCount={skinTypes.length} />

      {/* Data Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <SkinTypesTable
          skinTypes={skinTypes}
          onEdit={(st) => {
            setEditingSkinType(st);
            setModalOpen(true);
          }}
          onDelete={(st) => {
            setDeletingSkinType(st);
          }}
        />
      )}

      {/* Medical Educational Insight Card */}
      <SkinTypesEducationalCard />

      {/* Modal CRUD Dialog */}
      <SkinTypeModal
        isOpen={modalOpen}
        skinType={editingSkinType}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          setModalOpen(false);
          setEditingSkinType(null);
        }}
        onSubmit={handleModalSubmit}
      />

      {/* Confirm Delete Dialog */}
      <SkinTypeDeleteModal
        skinType={deletingSkinType}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeletingSkinType(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
