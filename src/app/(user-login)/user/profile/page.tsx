"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import profileApi from "@/frontend/api/profile";
import { toast } from "react-hot-toast";
import { IconLoader2, IconLock } from "@tabler/icons-react";
import { useAuth } from "@/frontend/composable/useAuth";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import Link from "next/link";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus";
const inputClass = `min-h-[52px] w-full rounded-xl border border-brand-muted bg-white px-4 text-base text-brand-ink ${focusRing}`;

export default function ProfilePage() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { setUserName } = useAuth();

  const {
    data: user,
    refetch: refetchUser,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => profileApi.getUser(),
    select: (data) => data.data.data,
  });

  const { mutate: updateUser, isPending: isPendingUpdate } = useMutation({
    mutationFn: (body: { fullname: string; phone: string }) =>
      profileApi.updateUser(body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Perubahan berhasil disimpan");
        refetchUser();
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Perubahan gagal disimpan. Coba lagi.");
    },
  });

  const whatsappRegex = /^\+?\d{9,}$/;

  const changeNoPhone = (phone: string) => {
    if (phone.startsWith("0")) {
      return phone.replace("0", "+62");
    }
    if (phone.startsWith("62")) {
      return phone.replace("62", "+62");
    }
    if (phone.startsWith("+620")) {
      return phone.replace("+620", "+62");
    }
    return phone;
  };

  const handleSubmit = () => {
    if (!whatsappRegex.test(phone)) {
      toast.error("Nomor Whatsapp tidak valid");
      return;
    }

    updateUser({ fullname, phone: changeNoPhone(phone) });
  };

  useEffect(() => {
    if (user) {
      setUserName(user.fullname);
      setFullname(user.fullname);
      setPhone(user.phone);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <main className="min-h-[80vh] bg-brand-cream pt-[88px] text-brand-ink">
      <header className="bg-brand-mint py-9 sm:py-12">
        <div className="container grid items-center gap-6 sm:grid-cols-[1.4fr_1fr] sm:gap-14">
          <div>
            <p className="mb-3.5 text-sm font-bold">Akun kamu</p>
            <h1 className="font-recoleta-alt text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.2] tracking-[-0.025em] wrap-anywhere">
              Atur profil
              <br />
              <span className="text-brand-leaf">akun kamu.</span>
            </h1>
            <p className="mt-4 max-w-[480px] leading-[1.8] text-brand-muted">
              Perbarui nama dan nomor WhatsApp yang terhubung ke akun kamu.
            </p>
          </div>
          <div
            className="relative isolate order-first mx-auto min-h-40 w-[180px] sm:order-none sm:min-h-[240px] sm:w-full sm:max-w-[300px]"
            aria-hidden="true"
          >
            <div className="absolute inset-x-[4%] top-[10%] bottom-0 -z-10 rounded-[48%_48%_20px_20px] bg-brand-yellow" />
            <BrandCharacter character="host" className="absolute bottom-0 left-[14%] w-[72%]" />
          </div>
        </div>
      </header>

      <div className="container grid items-start gap-6 pt-8 pb-20 sm:pt-12 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
        <section
          aria-labelledby="profile-data-heading"
          className="rounded-2xl border border-brand-line bg-white p-5 sm:p-8"
        >
          <h2 id="profile-data-heading" className="text-[22px] font-bold">
            Data diri
          </h2>

          <dl className="mt-5 rounded-xl bg-brand-cream px-4 py-3.5">
            <dt className="text-sm font-bold">Email</dt>
            <dd className="mt-0.5 wrap-anywhere">
              {isLoading ? <span className="inline-block h-5 w-48 rounded bg-brand-line motion-safe:animate-pulse" /> : email}
            </dd>
            <dd className="mt-1 text-[13px] text-brand-muted">
              Email dipakai untuk masuk, jadi tidak bisa diubah.
            </dd>
          </dl>

          <form
            className="mt-6 grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isPendingUpdate) handleSubmit();
            }}
          >
            <div>
              <label htmlFor="fullname" className="mb-2.5 block text-sm font-bold">
                Nama lengkap
              </label>
              <input
                type="text"
                id="fullname"
                autoComplete="name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                disabled={isLoading}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2.5 block text-sm font-bold">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                id="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                aria-describedby="phone-hint"
                className={`${inputClass} placeholder:text-brand-muted/60`}
              />
              <p id="phone-hint" className="mt-2 text-[13px] leading-[1.7] text-brand-muted">
                Boleh diawali 0, 62, atau +62. Kami simpan dalam format +62.
              </p>
            </div>
            <div>
              <button
                type="submit"
                disabled={isPendingUpdate || isLoading || !fullname || !phone}
                className={`inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-green px-6 font-bold text-white transition-colors duration-150 hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-brand-green ${focusRing}`}
              >
                {isPendingUpdate ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
                    Menyimpan…
                  </>
                ) : (
                  "Simpan perubahan"
                )}
              </button>
            </div>
          </form>
        </section>

        <section aria-labelledby="security-heading" className="rounded-2xl bg-brand-sky p-5 sm:p-8">
          <span className="grid size-11 place-items-center rounded-full bg-white text-brand-focus" aria-hidden="true">
            <IconLock size={20} />
          </span>
          <h2 id="security-heading" className="mt-4 text-[22px] font-bold">
            Password
          </h2>
          <p className="mt-2 text-sm leading-[1.8] text-brand-muted">
            Ganti password kalau kamu merasa ada orang lain yang tahu, atau kalau sudah lama tidak menggantinya.
          </p>
          <Link
            href="/user/profile/change-password"
            className={`mt-5 inline-flex min-h-11 items-center text-[15px] font-bold text-brand-green underline underline-offset-[6px] ${focusRing}`}
          >
            Ubah password
          </Link>
        </section>
      </div>
    </main>
  );
}
