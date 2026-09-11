"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";

import { subscriptionService } from "@/features/subscription/services/subscriptionService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

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
    try {
      const data = await subscriptionService.checkout();
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewReceipt = async () => {
    if (!activeSubscription) return;
    setIsLoadingReceipt(true);
    try {
      const data = await subscriptionService.receipt(activeSubscription.uuid);
      setReceipt(data as unknown as ReceiptData);
    } catch (err: unknown) {
      setErrorMsg(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoadingReceipt(false);
    }
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
        <SubscriptionErrorBanner message={errorMsg} />
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-emerald-100/50 overflow-hidden">
          <SubscriptionHero />
          <div className="p-6 sm:p-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Memuat data langganan...</p>
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
            <SubscriptionHistory subscriptions={subscriptions} />
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
