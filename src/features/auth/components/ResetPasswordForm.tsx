"use client";

import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, FieldIcon, HashIcon, LockIcon } from "./Icons";

export function ResetPasswordForm({
  initialEmail,
  showPassword,
  setShowPassword,
  showConfirm,
  setShowConfirm,
  isLoading,
  message,
  isError,
  handleSubmit,
}: {
  initialEmail: string;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (value: boolean) => void;
  isLoading: boolean;
  message: string;
  isError: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const locked = isLoading || (!isError && !!message);

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {message ? (
        <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {message}
        </div>
      ) : null}

      <div className='space-y-2'>
        <Label htmlFor='otp'>Kode OTP (6 digit)</Label>
        <div className='relative'>
          <FieldIcon><HashIcon /></FieldIcon>
          <Input
            id='otp'
            name='otp'
            type='text'
            maxLength={6}
            placeholder='Contoh: 123456'
            className='h-12 rounded-xl pl-10 focus-visible:ring-emerald-500 font-mono tracking-widest'
            required
            disabled={locked}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password Baru</Label>
        <div className='relative'>
          <FieldIcon><LockIcon /></FieldIcon>
          <Input
            id='password'
            name='password'
            type={showPassword ? "text" : "password"}
            placeholder='Minimal 8 karakter'
            className='h-12 rounded-xl pl-10 pr-10 focus-visible:ring-emerald-500'
            required
            minLength={8}
            disabled={locked}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-600'
            disabled={locked}
          >
            <EyeIcon hidden={showPassword} />
          </button>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password_confirmation'>Konfirmasi Password Baru</Label>
        <div className='relative'>
          <FieldIcon><LockIcon /></FieldIcon>
          <Input
            id='password_confirmation'
            name='password_confirmation'
            type={showConfirm ? "text" : "password"}
            placeholder='Ulangi password baru'
            className='h-12 rounded-xl pl-10 pr-10 focus-visible:ring-emerald-500'
            required
            minLength={8}
            disabled={locked}
          />
          <button
            type='button'
            onClick={() => setShowConfirm(!showConfirm)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-600'
            disabled={locked}
          >
            <EyeIcon hidden={showConfirm} />
          </button>
        </div>
      </div>

      <Button
        variant='success'
        className='h-12 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800 mt-4'
        disabled={locked}
        type='submit'
      >
        {isLoading ? (
          <><span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white mr-2' />Menyimpan...</>
        ) : "Simpan Sandi Baru"}
      </Button>
    </form>
  );
}
