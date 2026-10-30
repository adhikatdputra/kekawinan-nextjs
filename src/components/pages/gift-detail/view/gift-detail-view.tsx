"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import giftApi from "@/frontend/api/gift";
import GiftStore from "@/frontend/store/gift-store";
import { Gift } from "@/frontend/interface/undangan";
import Loading from "@/components/layouts/loading";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/helper/number";
import { Input } from "@/components/ui/input";
import NotFound from "@/components/card/not-found";
import {
  IconArrowLeft,
  IconCheck,
  IconExternalLink,
  IconGift,
  IconMapPin,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { motion, MotionConfig } from "motion/react";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import styles from "./gift-detail.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GiftDetailView({ id, slug, tamuId }: { id: string; slug: string; tamuId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { confirm } = GiftStore();
  const { mutate: confirmGift, isPending: isPendingConfirm } = confirm;

  const { data: giftData, isError, isLoading, refetch } = useQuery({
    queryKey: ["gift-detail", id],
    queryFn: () => giftApi.getPublicDetail(id),
    select: (data) => data.data.data as Gift,
  });

  const handleConfirm = () => {
    confirmGift({ id, data: { name, phone } }, {
      onSuccess: () => {
        refetch();
        queryClient.invalidateQueries({ queryKey: ["undangan-user-page"] });
        setIsOpen(false);
      },
    });
  };

  useEffect(() => {
    if (isError) router.push("/");
  }, [isError, router]);

  if (isLoading) return <Loading />;
  if (!giftData) return <NotFound title="Waduh, kado ini nggak ada!" description="Mungkin kamu salah klik link ini, atau kado ini sudah tidak tersedia." />;

  const confirmed = !!giftData.isConfirm;
  const recipient = giftData.recipientAddress?.nameAddress || giftData.recipientAddress?.phone || giftData.recipientAddress?.address
    ? giftData.recipientAddress
    : null;
  const returnHref = `/${slug}/gift?view=list${tamuId ? `&id=${encodeURIComponent(tamuId)}` : ""}`;
  const invitationHref = tamuId ? `/${slug}/${tamuId}` : `/${slug}/demo`;

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <div className={styles.shell}>
          <header className={styles.topbar}>
            <Link href={returnHref} className={styles.backLink}><IconArrowLeft size={19} aria-hidden="true" /> Kembali ke daftar kado</Link>
            <Link href="/" className={styles.wordmark}><Image src="/images/kekawinan-logo.png" alt="Kekawinan" width={160} height={46} /></Link>
          </header>

          <div className={styles.columns}>
            <motion.section className={styles.visual} aria-label={`Foto ${giftData.title}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
              <div className={styles.photoFrame}>
                <Image src={giftData.thumbnail || "/images/imgplace.png"} alt={giftData.title} width={900} height={900} priority sizes="(max-width: 760px) 100vw, 54vw" className={`${styles.photo} ${confirmed ? styles.photoConfirmed : ""}`} />
                {confirmed && <div className={styles.confirmedOverlay}><span><IconCheck size={17} /> Sudah dipilih</span></div>}
                <BrandCharacter character={confirmed ? "host" : "gift"} className={styles.character} />
              </div>
              <p className={styles.photoCaption}><IconGift size={16} aria-hidden="true" /> Satu pilihan kecil, banyak arti.</p>
            </motion.section>

            <motion.div className={styles.details} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .08 }}>
              <p className={styles.eyebrow}>{confirmed ? "Cerita bahagia bertambah" : "Pilihan kado untuk mereka"}</p>
              <h1>{giftData.title}</h1>
              {giftData.description && <p className={styles.description}>{giftData.description}</p>}

              <div className={styles.pricePanel}>
                <div><p className={styles.label}>Harga</p><p className={styles.price}>{formatNumber(Number(giftData.price))}</p></div>
                <span className={`${styles.status} ${confirmed ? styles.statusChosen : ""}`}>
                  {confirmed ? <IconCheck size={17} /> : <IconGift size={17} />}
                  {confirmed ? "Sudah dipilih" : "Tersedia"}
                </span>
              </div>

              {confirmed ? (
                <div className={styles.selectedNote}><span className={styles.noteIcon}><IconCheck size={18} /></span><div><strong>Hadiah ini sudah dipilih</strong><p>Terima kasih sudah ikut merayakan hari bahagia mereka.</p>{giftData.name && <small>Atas nama {giftData.name}</small>}</div></div>
              ) : (
                <div className={styles.howTo}><strong>Cara memberikan</strong><p>Beli melalui toko online, lalu kembali ke sini untuk mengonfirmasi pilihanmu.</p></div>
              )}

              {recipient && <RecipientAddressCard recipient={recipient} />}

              <div className={styles.actions}>
                {!confirmed ? <>
                  {giftData.linkProduct ? (
                    <a href={giftData.linkProduct} target="_blank" rel="noreferrer" className={styles.primary}>
                      <IconExternalLink size={18} aria-hidden="true" /> Beli kado di toko
                    </a>
                  ) : (
                    <button type="button" disabled className={styles.primary}>
                      Tautan toko belum tersedia
                    </button>
                  )}
                  <button type="button" onClick={() => setIsOpen(true)} className={styles.secondary}>Sudah membeli? Konfirmasi</button>
                </> : giftData.linkProduct ? <a href={giftData.linkProduct} target="_blank" rel="noreferrer" className={styles.secondary}><IconExternalLink size={17} /> Lihat produk</a> : null}
                <Link href={invitationHref} className={styles.invitationLink}>Kembali ke undangan</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f2e6] text-[#215b3b]"><IconGift size={22} /></div>
            <DialogTitle className="text-center">Konfirmasi hadiah</DialogTitle>
            <DialogDescription className="text-center text-sm leading-relaxed">Terima kasih sudah memilih hadiah ini. Isi nama dan nomor WhatsApp agar pasangan tahu siapa yang mengirimkannya.</DialogDescription>
          </DialogHeader>
          <form className="mt-2 flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); handleConfirm(); }}>
            <label className="flex flex-col gap-1.5 text-sm font-medium">Nama lengkap
              <Input type="text" autoComplete="name" placeholder="Nama lengkap kamu" value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-xl" required />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">Nomor WhatsApp
              <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-xl" required />
            </label>
            <button type="submit" disabled={isPendingConfirm || !name.trim() || !phone.trim()} className={styles.primary}>
              {isPendingConfirm ? "Menyimpan…" : "Konfirmasi hadiah"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </MotionConfig>
  );
}

function RecipientAddressCard({ recipient }: { recipient: NonNullable<Gift["recipientAddress"]> }) {
  return <section className={styles.recipient} aria-labelledby="recipient-title">
    <div className={styles.recipientHeading}><span><IconMapPin size={18} /></span><div><h2 id="recipient-title">Alamat pengiriman</h2><p>Detail untuk mengirim hadiah fisik</p></div></div>
    <div className={styles.recipientRows}>
      {recipient.nameAddress && <RecipientInfoRow icon={<IconUser size={16} />} label="Penerima" value={recipient.nameAddress} />}
      {recipient.phone && <RecipientInfoRow icon={<IconPhone size={16} />} label="Telepon" value={recipient.phone} />}
      {recipient.address && <RecipientInfoRow icon={<IconMapPin size={16} />} label="Alamat" value={recipient.address} multiline />}
    </div>
  </section>;
}

function RecipientInfoRow({ icon, label, value, multiline = false }: { icon: ReactNode; label: string; value: string; multiline?: boolean }) {
  return <div className={styles.recipientRow}><span className={styles.rowIcon}>{icon}</span><div><p>{label}</p><strong className={multiline ? styles.addressValue : ""}>{value}</strong></div></div>;
}
