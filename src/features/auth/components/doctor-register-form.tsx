"use client";

import { type FormEvent, useState } from "react";

import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import { BadgeIcon, LockIcon, MailIcon, StethoscopeIcon, UserIcon } from "./icons";
import { PasswordInput } from "./password-input";
import { IconInput } from "./icon-input";
import { IconSelect } from "./icon-select";
import { FileUploadField } from "./file-upload-field";
import { FormFooter } from "./form-footer";
import { FormMessage } from "./form-message";

type RegisterDoctorResponse = {
  success?: boolean;
  message?: string;
};
export function DoctorRegisterForm() {
  const [selectedFile, setSelectedFile] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const response = await fetch("/api/auth/register-doctor", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Non JSON register doctor response:", {
          status: response.status,
          statusText: response.statusText,
          body: text,
        });

        setMessage(
          `API tidak mengembalikan JSON. Status: ${response.status}. Pastikan route /api/auth/register-doctor sudah dibuat dan dev server sudah direstart.`,
        );
        setIsSuccess(false);
        return;
      }

      const result = (await response.json()) as RegisterDoctorResponse;

      if (!response.ok) {
        setMessage(result.message || "Registrasi dokter gagal.");
        setIsSuccess(false);
        return;
      }

      setMessage(
        result.message ||
          "Registrasi dokter berhasil. Silakan login untuk melihat status verifikasi.",
      );
      setIsSuccess(true);

      form.reset();
      setSelectedFile("");

      window.setTimeout(() => {
        window.location.href = ROUTES.LOGIN;
      }, 1200);
    } catch (error) {
      console.error("Doctor register submit error:", error);
      setMessage("Terjadi kesalahan saat registrasi dokter.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3.5'>
      <FormMessage message={message} isSuccess={isSuccess} />
      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='fullName'>
            Nama Lengkap <span className='text-rose-500'>*</span>
          </Label>
          <IconInput
            id='fullName'
            name='fullName'
            icon={<UserIcon />}
            placeholder='Nama lengkap'
            autoComplete='name'
            required
            disabled={isLoading}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>
            Email <span className='text-rose-500'>*</span>
          </Label>
          <IconInput
            id='email'
            name='email'
            type='email'
            icon={<MailIcon />}
            placeholder='Email aktif'
            autoComplete='email'
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>
          Password <span className='text-rose-500'>*</span>
        </Label>
        <PasswordInput
          id='password'
          name='password'
          placeholder='Buat password'
          icon={<LockIcon />}
          required
          minLength={6}
          disabled={isLoading}
          className='!h-11'
        />
      </div>
      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='strNumber' className='flex min-h-8 items-end'>
            Nomor STR / Identitas Dokter{" "}
            <span className='text-rose-500'>*</span>
          </Label>
          <IconInput
            id='strNumber'
            name='strNumber'
            icon={<BadgeIcon />}
            placeholder='Contoh: 1234567890123456'
            required
            disabled={isLoading}
          />
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='specialization'
            className='flex min-h-8 items-end'
          >
            Spesialisasi <span className='text-rose-500'>*</span>
          </Label>
          <IconSelect
            id='specialization'
            name='specialization'
            icon={<StethoscopeIcon />}
            required
            disabled={isLoading}
          >
            <option value='' disabled>
              Pilih spesialisasi
            </option>
            <option value='dermatology'>Dermatologi</option>
            <option value='aesthetic-medicine'>
              Kedokteran Estetika
            </option>
            <option value='general-practitioner'>Dokter Umum</option>
            <option value='skincare-consultant'>
              Konsultan Skincare
            </option>
          </IconSelect>
        </div>
      </div>
      <FileUploadField
        id='verificationDocument'
        name='verificationDocument'
        label='Dokumen Verifikasi'
        selectedFile={selectedFile}
        disabled={isLoading}
        onChange={(event) =>
          setSelectedFile(event.target.files?.[0]?.name ?? "")
        }
      />
      <FormFooter
        isLoading={isLoading}
        submitLabel='Daftar sebagai Dokter'
        loadingLabel='Mendaftarkan...'
      />
    </form>
  );
}
