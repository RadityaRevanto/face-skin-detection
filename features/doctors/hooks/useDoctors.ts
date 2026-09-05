"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { doctorsService } from "../services/doctorsService";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

export function useDoctors(page = 1, perPage = 5) {
  return useQuery({
    queryKey: ["doctors", page, perPage],
    queryFn: () => doctorsService.list({ page, per_page: perPage }),
    placeholderData: keepPreviousData,
  });
}

export function useDoctorProfile(uuid: string | null | undefined) {
  return useQuery({
    queryKey: ["doctor", uuid],
    queryFn: () => doctorsService.profile(uuid!),
    enabled: !!uuid,
  });
}

export function useDoctorReviews(uuid: string | null | undefined, page = 1) {
  return useQuery({
    queryKey: ["doctor-reviews", uuid, page],
    queryFn: () => doctorsService.ratings(uuid!, { page }),
    enabled: !!uuid,
    placeholderData: keepPreviousData,
  });
}

export function useRateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      rating,
      review,
    }: {
      uuid: string;
      rating: number;
      review?: string;
    }) => doctorsService.rate(uuid, { rating, review }),
    onSuccess: (_data, variables) => {
      customToast.success("Ulasan terkirim", {
        description: "Terima kasih atas ulasan Anda.",
      });
      queryClient.invalidateQueries({ queryKey: ["doctor", variables.uuid] });
      queryClient.invalidateQueries({ queryKey: ["doctor-reviews", variables.uuid] });
    },
    onError: (error) => {
      customToast.error("Gagal mengirim ulasan", {
        description: getUserFriendlyErrorMessage(error),
      });
    },
  });
}
