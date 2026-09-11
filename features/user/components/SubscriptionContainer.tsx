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
import { SubscriptionHero } from "./SubscriptionHero";
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

  // Email user (untuk CTA verifikasi) — dari cache ["profile"] yang dipakai
  // bersama halaman lain (scan, home). Tidak fetch ulang bila sudah ada.
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
      <main className="min-h-[calc(100vh-72px)] bg-shell p-4 sm:p-6 lg:p-10 flex flex-col items-center">
        <SubscriptionErrorBanner
          message={errorMsg}
          verifyEmail={profile?.email ?? null}
        />
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-emerald-100/50 overflow-hidden">
          <SubscriptionHero />
          <div className="p-6 sm:p-10">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <SubscriptionCardSkeleton />
              </div>
            ) : activeSubscription ? (
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
        </div>
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
