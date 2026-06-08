"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ActionIcon } from "./action-icon";

type VerificationDecisionCardProps = {
  verificationId: string;
};

export function VerificationDecisionCard({
  verificationId,
}: VerificationDecisionCardProps) {
  const router = useRouter();

  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitAction(type: "approve" | "reject") {
    setMessage("");

    const trimmedNote = note.trim();

    if (type === "reject" && !trimmedNote) {
      setMessage("Alasan penolakan wajib diisi sebelum reject.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/admin/doctor-verifications/${verificationId}/${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:
            type === "approve"
              ? JSON.stringify({})
              : JSON.stringify({ reason: trimmedNote }),
        },
      );

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non JSON response:", text);

        setMessage(
          `Response API bukan JSON. Status: ${response.status}. Cek console/browser network.`,
        );
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || `Aksi gagal. Status: ${response.status}`);
        return;
      }

      setMessage(result.message || "Aksi berhasil diproses.");

      if (type === "approve") {
        router.push("/admin/doctors");
      } else {
        router.push("/admin/doctor-verifications/rejected");
      }

      router.refresh();
    } catch (error) {
      console.error("Submit verification action error:", error);
      setMessage("Terjadi kesalahan saat memproses aksi. Cek console browser.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>
          Keputusan Verifikasi
        </h3>
        <p className='mt-0.5 text-sm text-gray-400'>
          Approve dokter jika dokumen valid, atau reject dengan alasan
          penolakan.
        </p>
      </div>

      <div className='space-y-4 p-6'>
        {message ? (
          <div className='rounded-xl bg-gray-50/80 px-4 py-3 text-sm font-semibold text-gray-600'>
            {message}
          </div>
        ) : null}

        <div>
          <label
            htmlFor='review-note'
            className='mb-2 block text-xs font-semibold text-gray-400'
          >
            Alasan Penolakan
          </label>

          <textarea
            id='review-note'
            name='review-note'
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder='Wajib diisi jika melakukan reject. Contoh: Dokumen STR tidak terbaca jelas atau tidak sesuai identitas.'
            className='w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm leading-6 text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
          />
        </div>

        <div className='grid gap-3 sm:grid-cols-2'>
          <Button
            type='button'
            variant='ghost'
            disabled={isLoading}
            onClick={() => submitAction("approve")}
            className='h-12 rounded-xl bg-emerald-50! text-emerald-700! hover:bg-emerald-100!'
          >
            <ActionIcon type='approve' />
            Approve
          </Button>

          <Button
            type='button'
            variant='ghost'
            disabled={isLoading}
            onClick={() => submitAction("reject")}
            className='h-12 rounded-xl bg-rose-50! text-rose-600! hover:bg-rose-100!'
          >
            <ActionIcon type='reject' />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
}
