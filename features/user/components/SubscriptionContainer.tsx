"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Script from "next/script";

import { subscriptionService } from "@/features/subscription/services/subscriptionService";
import { profileService } from "@/features/profile/services/profileService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { SubscriptionCardSkeleton } from "@/components/skeletons";

import type { Subscription, ReceiptData } from "./types";
import { SubscriptionErrorBanner } from "./SubscriptionErrorBanner";
import { ActiveSubscriptionCard } from "./ActiveSubscriptionCard";
import { InactiveSubscriptionCard } from "./InactiveSubscriptionCard";
import { SubscriptionHistory } from "./SubscriptionHistory";
import { ReceiptModal } from "./ReceiptModal";
import { CancelModal } from "./CancelModal";

/** window.snap di-inject oleh <Script src=".../snap.js"> Midtrans. */
type MidtransSnap = {
  pay: (
    token: string,
    callbacks: {
      onSuccess: () => void;
      onPending: () => void;
      onError: () => void;
      onClose: () => void;
    },
  ) => void;
};

export function SubscriptionContainer() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetUuid, setCancelTargetUuid] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
  const [resumingUuid, setResumingUuid] = useState<string | null>(null);

  // Email user untuk CTA verifikasi — reuse cache ["profile"] dari halaman lain.
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
    staleTime: 60 * 1000,
  });

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await subscriptionService.list();
      if (response.data) setSubscriptions(response.data);
    } catch {
      setErrorMsg("Gagal memuat data langganan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, setState di dalam callback async
    fetchSubscriptions();
  }, []);

  const activeSubscription = subscriptions.find(
    (s) => s.status === "active" && (!s.ends_at || new Date(s.ends_at) >= new Date())
  );
  // Pending bisa dilanjutkan selama <24 jam sejak dibuat.
  const pendingSubscription = subscriptions.find((s) => s.status === "pending");

  const handleCheckout = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    await openSnapPayment(() => subscriptionService.checkout());
    setIsProcessing(false);
  };

  /** Buka Snap Midtrans — dipakai checkout baru & lanjut pembayaran pending. */
  const openSnapPayment = async (
    request: () => Promise<{ data?: { snap_token?: string } }>,
  ) => {
    setErrorMsg(null);
    try {
      const data = await request();
      if (data.data?.snap_token) {
        const snap = (window as unknown as { snap?: MidtransSnap }).snap;
        snap?.pay(data.data.snap_token, {
          onSuccess: () => fetchSubscriptions(),
          onPending: () => fetchSubscriptions(),
          onError: () => setErrorMsg("Pembayaran gagal, silakan coba lagi."),
          onClose: () => fetchSubscriptions(),
        });
      }
    } catch (err: unknown) {
      setErrorMsg(getUserFriendlyErrorMessage(err));
      // Status bisa berubah di BE — sinkronkan list agar callout tidak tertinggal.
      await fetchSubscriptions();
    }
  };

  const handleContinuePayment = async (uuid: string) => {
    setResumingUuid(uuid);
    setErrorMsg(null);
    await openSnapPayment(() => subscriptionService.resumePayment(uuid));
    setResumingUuid(null);
  };

  const handleViewReceiptByUuid = async (uuid: string) => {
    setIsLoadingReceipt(true);
    try {
      const data = await subscriptionService.receipt(uuid);
      setReceipt(data as unknown as ReceiptData);
    } catch (err: unknown) {
      setErrorMsg(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoadingReceipt(false);
    }
  };

  const handleViewReceipt = async () => {
    if (!activeSubscription) return;
    await handleViewReceiptByUuid(activeSubscription.uuid);
  };

  const handleCancelClick = (uuid: string) => {
    setCancelTargetUuid(uuid);
    setIsCancelModalOpen(true);
  };

  const executeCancel = async () => {
    if (!cancelTargetUuid) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setIsCancelModalOpen(false);
    try {
      await subscriptionService.cancel(cancelTargetUuid);
      fetchSubscriptions();
    } catch (err: unknown) {
      setErrorMsg(getUserFriendlyErrorMessage(err));
    } finally {
      setIsProcessing(false);
      setCancelTargetUuid(null);
    }
  };

  return (
    <>
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      <main className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Langganan
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Kelola paket SkinCek Pro Anda — scan & konsultasi tanpa batas.
          </p>
        </div>

        <SubscriptionErrorBanner
          message={errorMsg}
          verifyEmail={profile?.email ?? null}
        />

        {isLoading ? (
          <SubscriptionCardSkeleton />
        ) : (
          <div className="space-y-6">
            {pendingSubscription && !activeSubscription ? (
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-bold text-amber-800">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    Ada pembayaran menunggu — Rp{pendingSubscription.amount.toLocaleString("id-ID")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Dibuat {new Date(pendingSubscription.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}.
                    Selesaikan pembayaran untuk mengaktifkan SkinCek Pro.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleContinuePayment(pendingSubscription.uuid)}
                  disabled={resumingUuid === pendingSubscription.uuid}
                  className="shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
                >
                  {resumingUuid === pendingSubscription.uuid ? "Membuka..." : "Lanjutkan Pembayaran"}
                </button>
              </div>
            ) : null}

            {activeSubscription ? (
              <ActiveSubscriptionCard
                subscription={activeSubscription}
                isLoadingReceipt={isLoadingReceipt}
                isProcessing={isProcessing}
                onViewReceipt={handleViewReceipt}
                onCancel={() => handleCancelClick(activeSubscription.uuid)}
              />
            ) : (
              <InactiveSubscriptionCard isProcessing={isProcessing} onCheckout={handleCheckout} />
            )}

            <SubscriptionHistory
              subscriptions={subscriptions}
              resumingUuid={resumingUuid}
              onContinuePayment={handleContinuePayment}
              onViewReceipt={handleViewReceiptByUuid}
            />
          </div>
        )}
      </main>
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      <CancelModal
        isOpen={isCancelModalOpen}
        isProcessing={isProcessing}
        onCancel={() => { setIsCancelModalOpen(false); setCancelTargetUuid(null); }}
        onConfirm={executeCancel}
      />
    </>
  );
}
