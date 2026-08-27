"use client";

import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldIcon, HashIcon } from "./icons";

export function VerifyEmailForm({
  isLoading,
  message,
  isError,
  handleSubmit,
}: {
  isLoading: boolean;
  message: string;
  isError: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const locked = isLoading || (!isError && !!message && message.includes("berhasil"));

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {message ? (
        <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {message}
        </div>
      ) : null}

      <div className='space-y-2'>
        <Label htmlFor='otp'>Kode OTP</Label>
        <div className='relative'>
          <FieldIcon><HashIcon /></FieldIcon>
          <Input
            id='otp'
            name='otp'
            type='text'
            maxLength={6}
            placeholder='123456'
            className='h-12 rounded-xl pl-10 focus-visible:ring-emerald-500 font-mono tracking-widest text-center text-xl'
            required
            disabled={locked}
          />
        </div>
      </div>

      <Button
        variant='success'
        className='h-12 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800 mt-4'
        disabled={locked}
        type='submit'
      >
        {isLoading ? (
          <><span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white mr-2' />Memverifikasi...</>
        ) : "Verifikasi"}
      </Button>
    </form>
  );
}
