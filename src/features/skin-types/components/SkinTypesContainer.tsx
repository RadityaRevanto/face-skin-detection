"use client";

import { useState, useEffect, useCallback } from "react";
import type { SkinType } from "../types";
import { getSkinTypes } from "../lib/skinTypesService";
import { SkinTypeTable } from "./SkinTypeTable";
import { SkinTypeForm } from "./SkinTypeForm";

export function SkinTypesContainer() {
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkinType, setEditingSkinType] = useState<SkinType | null>(
    null
  );

  const fetchSkinTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getSkinTypes();
      setSkinTypes(data);
    } catch (error) {
      console.error("Failed to fetch skin types:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkinTypes();
  }, [fetchSkinTypes]);

  function handleEdit(skinType: SkinType) {
    setEditingSkinType(skinType);
    setShowForm(true);
  }

  function handleSuccess() {
    setShowForm(false);
    setEditingSkinType(null);
    fetchSkinTypes();
  }

  function handleCancel() {
    setShowForm(false);
    setEditingSkinType(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Skin Types
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola jenis kulit yang digunakan dalam sistem rekomendasi
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
          >
            + Tambah Skin Type
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {editingSkinType ? "Edit Skin Type" : "Tambah Skin Type Baru"}
          </h2>
          <SkinTypeForm
            skinType={editingSkinType}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : (
        <SkinTypeTable
          skinTypes={skinTypes}
          onEdit={handleEdit}
          onRefresh={fetchSkinTypes}
        />
      )}
    </div>
  );
}
