"use client";

import { type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, FieldIcon, MailIcon, LockIcon } from "./icons";

export function LoginForm({
  showPassword,
  setShowPassword,
  isLoading,
  errorMessage,
  handleSubmit,
}: {
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  isLoading: boolean;
  errorMessage: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {errorMessage ? (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'>
          {errorMessage}
        </div>
      ) : null}

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <div className='relative'>
          <FieldIcon>
            <MailIcon />
          </FieldIcon>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Masukkan email'
            autoComplete='email'
            className='h-12 rounded-xl pl-10 focus-visible:ring-emerald-500'
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <div className='relative'>
          <FieldIcon>
            <LockIcon />
          </FieldIcon>
          <Input
            id='password'
            name='password'
            type={showPassword ? "text" : "password"}
            placeholder='Masukkan password'
            autoComplete='current-password'
            className='h-12 rounded-xl pl-10 pr-10 focus-visible:ring-emerald-500'
            required
            disabled={isLoading}
          />
          <button
            type='button'
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60'
            disabled={isLoading}
          >
            <EyeIcon hidden={showPassword} />
          </button>
        </div>

        <div className='text-right'>
          <Link
            href='/forgot-password'
            className='text-xs font-semibold text-emerald-700 underline-offset-4 hover:underline'
          >
            Lupa password?
          </Link>
        </div>
      </div>

      <Button
        variant='success'
        className='h-12 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800'
        disabled={isLoading}
        type='submit'
      >
        {isLoading ? (
          <>
            Memproses...
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
          </>
        ) : (
          "Masuk"
        )}
      </Button>
    </form>
  );
}
