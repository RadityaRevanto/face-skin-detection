"use client";

import { type FormEvent, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/lib/auth/actions";
import { FieldIcon, LockIcon, MailIcon, UserIcon } from "./icons";
import { PasswordInput } from "./password-input";
import { FormFooter } from "./form-footer";
import { FormMessage } from "./form-message";

export function RegisterForm() {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setMessage("");
    setIsSuccess(false);
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("Nama, email, password, dan konfirmasi password wajib diisi.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password minimal 8 karakter.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Konfirmasi password tidak sama.");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      formData.set("full_name", fullName);
      formData.set("privacy_consent", "on");
      
      const result = await registerAction(formData);

      if (!result.success) {
        setMessage(result.message || "Registrasi gagal.");
        setIsSuccess(false);
        return;
      }

      setMessage(result.message || "Registrasi berhasil. Mengarahkan ke verifikasi email...");
      setIsSuccess(true);

      form.reset();

      window.setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
      }, 1200);
    } catch (error) {
      console.error("Register submit error:", error);
      setMessage("Terjadi kesalahan saat registrasi.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <FormMessage message={message} isSuccess={isSuccess} />

      <div className='space-y-2'>
        <Label htmlFor='fullName'>Nama Lengkap</Label>
        <div className='relative'>
          <FieldIcon>
            <UserIcon />
          </FieldIcon>
          <Input
            id='fullName'
            name='fullName'
            placeholder='Masukkan nama lengkap'
            autoComplete='name'
            className='h-12 rounded-xl border-zinc-200 bg-white pl-10 text-sm shadow-sm focus-visible:ring-emerald-500'
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Alamat Email</Label>
        <div className='relative'>
          <FieldIcon>
            <MailIcon />
          </FieldIcon>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Masukkan alamat email'
            autoComplete='email'
            className='h-12 rounded-xl border-zinc-200 bg-white pl-10 text-sm shadow-sm focus-visible:ring-emerald-500'
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <PasswordInput
          id='password'
          name='password'
          placeholder='Buat password'
          icon={<LockIcon />}
          required
          minLength={8}
          disabled={isLoading}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='confirmPassword'>Konfirmasi Password</Label>
        <PasswordInput
          id='confirmPassword'
          name='confirmPassword'
          placeholder='Konfirmasi password'
          icon={<LockIcon />}
          required
          minLength={8}
          disabled={isLoading}
          ariaLabelShow='Show confirm password'
          ariaLabelHide='Hide confirm password'
        />
      </div>

      <FormFooter
        isLoading={isLoading}
        submitLabel='Buat Akun'
        loadingLabel='Membuat Akun...'
        termsLabel='Ketentuan'
        privacyLabel='Kebijakan Privasi'
        buttonClassName='h-13 w-full rounded-xl bg-emerald-700 text-base shadow-xl shadow-emerald-700/25 hover:bg-emerald-800'
      />
    </form>
  );
}
