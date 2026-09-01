"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { scanService, type ScanListParams } from "../services/scanService";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

export function useScans(params?: ScanListParams) {
  return useQuery({
    queryKey: ["scans", params],
    queryFn: () => scanService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useScanDetail(id: string | null | undefined) {
  return useQuery({
    queryKey: ["scan", id],
    queryFn: () => scanService.detail(id!),
    enabled: !!id,
  });
}

export function useScanFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, isAccurate }: { uuid: string; isAccurate: boolean }) =>
      scanService.feedback(uuid, isAccurate),
    onSuccess: (_data, variables) => {
      customToast.success("Terima kasih!", {
        description: "Masukan Anda telah kami terima.",
      });
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      queryClient.invalidateQueries({ queryKey: ["scan", variables.uuid] });
    },
    onError: (error) => {
      customToast.error("Gagal mengirim masukan", {
        description: getUserFriendlyErrorMessage(error),
      });
    },
  });
}

export function useScanUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: File) => scanService.upload(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });
}

export function useScanLivecam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blob: Blob) => scanService.livecam(blob),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });
}
