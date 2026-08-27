import { type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FormFooterProps = {
  isLoading?: boolean;
  submitLabel: string;
  loadingLabel: string;
  termsLink?: string;
  termsLabel?: string;
  privacyLink?: string;
  privacyLabel?: string;
  buttonClassName?: string;
  children?: ReactNode;
};

export function FormFooter({
  isLoading,
  submitLabel,
  loadingLabel,
  termsLink = "#",
  termsLabel = "Terms of Service",
  privacyLink = "#",
  privacyLabel = "Privacy Policy",
  buttonClassName = "h-12 w-full rounded-xl bg-emerald-600 text-base shadow-xl shadow-emerald-600/25 hover:bg-emerald-700",
  children,
}: FormFooterProps) {
  return (
    <>
      {children}

      <label className='flex items-center gap-3 text-sm text-zinc-600'>
        <input
          type='checkbox'
          required
          defaultChecked
          disabled={isLoading}
          className='h-4 w-4 rounded border-emerald-300 accent-emerald-600 disabled:cursor-not-allowed disabled:opacity-60'
        />
        <span>
          Saya menyetujui{" "}
          <Link href={termsLink} className='font-semibold text-emerald-700'>
            {termsLabel}
          </Link>{" "}
          &{" "}
          <Link href={privacyLink} className='font-semibold text-emerald-700'>
            {privacyLabel}
          </Link>
        </span>
      </label>

      <Button
        variant='success'
        className={buttonClassName}
        disabled={isLoading}
        type='submit'
      >
        {isLoading ? (
          <>
            {loadingLabel}
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </>
  );
}
