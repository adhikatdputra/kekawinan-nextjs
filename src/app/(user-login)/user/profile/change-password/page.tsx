"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import profileApi from "@/frontend/api/profile";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconCheck, IconEye, IconEyeOff, IconLoader2, IconPoint } from "@tabler/icons-react";
import { BrandCharacter } from "@/components/pages/home/brand-visual";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";

// Same rule as passwordRegex below, split up so each one can be ticked off while typing
const PASSWORD_RULES: { label: string; test: (v: string) => boolean }[] = [
  { label: "Minimal 8 karakter", test: (v) => v.length >= 8 },
  { label: "Ada huruf besar dan huruf kecil", test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  { label: "Ada angka", test: (v) => /\d/.test(v) },
  { label: "Ada simbol: @ $ ! % * ? &", test: (v) => /[@$!%*?&]/.test(v) },
];

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  describedBy,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  describedBy?: string;
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-sm font-bold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={`min-h-[52px] w-full rounded-xl border bg-white pr-14 pl-4 text-base text-brand-ink ${
            invalid ? "border-brand-rose" : "border-brand-muted"
          } ${focusRing}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}
          aria-pressed={visible}
          className={`absolute top-1/2 right-1.5 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-brand-muted hover:text-brand-ink ${focusRing}`}
        >
          {visible ? <IconEyeOff size={20} aria-hidden="true" /> : <IconEye size={20} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}



export default function ChangePasswordPage() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: updateUser, isPending: isPendingUpdate } = useMutation({
    mutationFn: (body: { old_password: string; new_password: string }) =>
      profileApi.updatePassword(body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Password berhasil diubah");
        setTimeout(() => {
          router.push("/user/profile");
        }, 2000);
      } else {
        toast.error(response.message);
      }
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError?.response?.data?.message ?? "Password gagal diubah. Coba lagi.");
    },
  });

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = () => {
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password harus mengandung setidaknya 8 karakter, satu huruf besar, satu huruf kecil, satu angka, dan satu simbol"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi password tidak sama");
      return;
    }

    updateUser({ old_password: oldPassword, new_password: newPassword });
  };

  // The regex only accepts letters, digits, and these symbols
  const hasOtherCharacters = /[^A-Za-z\d@$!%*?&]/.test(newPassword);
  const confirmMismatch = !!confirmPassword && newPassword !== confirmPassword;

  return (
    <main className="min-h-[80vh] bg-brand-cream pt-[88px] text-brand-ink">
      <header className="bg-brand-sky py-9 sm:py-12">
        <div className="container grid items-center gap-6 sm:grid-cols-[1.4fr_1fr] sm:gap-14">
          <div>
            <Link
              href="/user/profile"
              className={`mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold underline underline-offset-4 ${focusRing}`}
            >
              <IconArrowLeft size={16} aria-hidden="true" />
              Kembali ke profil
            </Link>
            <h1 className="font-recoleta-alt text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.2] tracking-[-0.025em]">
              Ganti password
              <br />
              <span className="text-brand-focus">akun kamu.</span>
            </h1>
            <p className="mt-4 max-w-[480px] leading-[1.8] text-brand-muted">
              Masukkan password yang sekarang, lalu buat password baru yang belum pernah kamu pakai di sini.
            </p>
          </div>
          <div
            className="relative isolate order-first mx-auto min-h-40 w-[180px] sm:order-none sm:min-h-[240px] sm:w-full sm:max-w-[300px]"
            aria-hidden="true"
          >
            <div className="absolute inset-x-[4%] top-[10%] bottom-0 -z-10 rounded-[48%_48%_20px_20px] bg-brand-yellow" />
            <BrandCharacter character="courier" className="absolute -bottom-1 left-[12%] w-[78%]" />
          </div>
        </div>
      </header>

      <div className="container pt-8 pb-20 sm:pt-12">
        <form
          className="grid max-w-[640px] gap-5 rounded-2xl border border-brand-line bg-white p-5 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isPendingUpdate) handleSubmit();
          }}
        >
          <PasswordField
            id="old-password"
            label="Password sekarang"
            value={oldPassword}
            onChange={setOldPassword}
            autoComplete="current-password"
          />

          <div>
            <PasswordField
              id="new-password"
              label="Password baru"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              describedBy="new-password-rules"
              invalid={hasOtherCharacters}
            />
            <ul id="new-password-rules" className="mt-3 grid gap-1.5 text-[13px] sm:grid-cols-2">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(newPassword);
                return (
                  <li key={rule.label} className={`flex items-center gap-1.5 ${met ? "text-brand-green" : "text-brand-muted"}`}>
                    {met ? <IconCheck size={15} aria-hidden="true" /> : <IconPoint size={15} aria-hidden="true" />}
                    {rule.label}
                    <span className="sr-only">{met ? "(terpenuhi)" : "(belum)"}</span>
                  </li>
                );
              })}
            </ul>
            {hasOtherCharacters && (
              <p className="mt-2 text-[13px] text-brand-rose" role="alert">
                Ada karakter yang tidak bisa dipakai. Gunakan huruf, angka, dan simbol @ $ ! % * ? & saja.
              </p>
            )}
          </div>

          <div>
            <PasswordField
              id="confirm-password"
              label="Ulangi password baru"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              describedBy={confirmMismatch ? "confirm-password-error" : undefined}
              invalid={confirmMismatch}
            />
            {confirmMismatch && (
              <p id="confirm-password-error" className="mt-2 text-[13px] text-brand-rose">
                Belum sama dengan password baru.
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isPendingUpdate || !oldPassword || !newPassword || !confirmPassword}
              className={`inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-green px-6 font-bold text-white transition-colors duration-150 hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-brand-green ${focusRing}`}
            >
              {isPendingUpdate ? (
                <>
                  <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
                  Menyimpan…
                </>
              ) : (
                "Simpan password baru"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
