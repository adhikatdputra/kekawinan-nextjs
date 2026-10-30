"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import undanganUserApi from "@/frontend/api/undangan-user";
import { UndanganDetail, Gift } from "@/frontend/interface/undangan";
import Loading from "@/components/layouts/loading";
import { motion, MotionConfig } from "motion/react";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import styles from "./gift.module.css";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/helper/number";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/components/card/not-found";
import {
  IconGift,
  IconCheck,
} from "@tabler/icons-react";

export default function GiftView({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tamuId = searchParams.get("id") ?? undefined;
  // Drive the list/cover view from the URL so returning from a gift detail
  // page (via back) restores the list instead of resetting to the cover.
  const isOpenGiftList = searchParams.get("view") === "list";

  const openList = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "list");
    router.push(`/${slug}/gift?${params.toString()}`);
  };

  const {
    data: undanganData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => undanganUserApi.getUndangan(slug),
    select: (data) => data.data as UndanganDetail,
    // Prefetched/hydrated from the server — never refetch on the client.
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Kado list ships with the invitation payload — no separate fetch needed.
  const giftList: Gift[] = undanganData?.kado ?? [];

  useEffect(() => {
    if (isError) router.push("/");
  }, [isError]);

  if (isLoading) return <Loading />;

  if (!undanganData)
    return (
      <NotFound
        title="Waduh, undanganmu nggak ada!"
        description="Mungkin kamu salah klik link ini, atau link ini sudah tidak ada."
      />
    );

  return (
    <MotionConfig reducedMotion="user">
      {!isOpenGiftList ? (
        <GiftCover
          undanganData={undanganData}
          giftCount={giftList.length}
          onOpen={openList}
          slug={slug}
          tamuId={tamuId}
        />
      ) : (
        <GiftList
          slug={slug}
          giftList={giftList}
          isLoading={false}
          tamuId={tamuId}
          undanganData={undanganData}
        />
      )}
    </MotionConfig>
  );
}

function GiftCover({ undanganData, giftCount, onOpen, slug, tamuId }: {
  undanganData: UndanganDetail; giftCount: number; onOpen: () => void; slug: string; tamuId?: string;
}) {
  const thumbnail = undanganData.content?.imgThumbnail || undanganData.content?.imgBg;
  const title = undanganData.content?.title || "Pasangan berbahagia";
  return <main className={styles.page}>
    <div className={styles.cover}>
      <header className={styles.topbar}><Link href="/" aria-label="Kekawinan — beranda"><Image src="/images/kekawinan-logo.png" alt="Kekawinan" width={180} height={50} className={styles.logo} /></Link><span>{giftCount} pilihan kado</span></header>
      <motion.div className={styles.intro} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}>
        <p className={styles.kicker}>Titip bahagia lewat hadiah</p>
        <h1>{title}</h1>
        <p className={styles.description}>Sedikit perhatian untuk awal cerita baru mereka. Temukan kado dari daftar yang sudah mereka siapkan.</p>
        <div className={styles.portraitScene}>
          <div className={styles.portrait}>
            {thumbnail ? <Image src={thumbnail} alt={`Foto ${title}`} width={500} height={600} priority sizes="(max-width: 560px) 60vw, 280px" /> : <div className={styles.photoFallback}><IconGift size={64} aria-hidden="true" /></div>}
          </div>
          <BrandCharacter character="courier" className={styles.courier} />
          <BrandCharacter character="gift" className={styles.giftCharacter} />
        </div>
        <div className={styles.coverActions}>
          <button type="button" className={styles.primary} onClick={onOpen}><IconGift size={19} />{giftCount ? "Lihat pilihan kado" : "Lihat daftar kado"}</button>
          <Link className={styles.backLink} href={tamuId ? `/${slug}/${tamuId}` : `/${slug}/demo`}>Kembali ke undangan</Link>
        </div>
        <p className={styles.footnote}>Doa dan kehadiranmu juga berarti bagi mereka.</p>
      </motion.div>
    </div>
  </main>;
}

function GiftList({ slug, giftList, isLoading, undanganData, tamuId }: {
  slug: string; giftList: Gift[]; isLoading: boolean; undanganData: UndanganDetail; tamuId?: string;
}) {
  const available = giftList.filter(g => !g.isConfirm).length;
  const taken = giftList.length - available;
  const guestParams = tamuId ? `?id=${encodeURIComponent(tamuId)}` : "";
  return <main className={styles.page}>
    <div className={styles.listShell}>
      <header className={styles.listHeader}>
        <Link className={styles.backLink} href={`/${slug}/gift${guestParams}`}>Kembali ke pengantar</Link>
        <div className={styles.listIntro}><div><p className={styles.kicker}>Untuk {undanganData.content?.title}</p><h1>Pilih kadonya,<br /><em>titip bahagianya.</em></h1></div><BrandCharacter character="gift" className={styles.listCharacter} /></div>
        <p className={styles.listDescription}>Buka kado untuk melihat detail dan cara memberikannya. Setelah membeli, konfirmasikan agar pasangan tahu pilihanmu.</p>
        {!isLoading && <div className={styles.counts}><span><strong>{available}</strong> tersedia</span><span><strong>{taken}</strong> sudah dipilih</span></div>}
      </header>
      <section className={styles.products} aria-label="Daftar pilihan kado">
        {isLoading ? <div className={styles.grid}>{Array.from({ length: 4 }, (_, i) => <GiftCardLoading key={i} />)}</div> : giftList.length === 0 ? <div className={styles.empty}><IconGift size={36} aria-hidden="true" /><h2>Daftar kadonya belum diisi.</h2><p>Kamu tetap bisa mengirim doa dan ucapan melalui undangan.</p><Link className={styles.backLink} href={tamuId ? `/${slug}/${tamuId}` : `/${slug}/demo`}>Kembali ke undangan</Link></div> : <>
          {available === 0 && <p className={styles.notice}>Semua kado dalam daftar ini sudah dipilih. Terima kasih sudah ikut merayakan!</p>}
          <ul className={styles.grid}>{giftList.map(gift => <li key={gift.id}><Link href={`/${slug}/gift/${gift.id}${guestParams}`} className={styles.cardLink}><GiftCard gift={gift} /></Link></li>)}</ul>
        </>}
      </section>
      <footer className={styles.listFooter}><p>Terima kasih sudah ikut merayakan cerita mereka.</p><Link className={styles.backLink} href={tamuId ? `/${slug}/${tamuId}` : `/${slug}/demo`}>Kembali ke undangan</Link></footer>
    </div>
  </main>;
}

function GiftCard({ gift }: { gift: Gift }) {
  const confirmed = !!gift.isConfirm;
  return <article className={`${styles.card} ${confirmed ? styles.confirmed : ""}`}>
    <div className={styles.productImage}><Image src={gift.thumbnail || "/images/imgplace.png"} alt={gift.title} width={400} height={400} sizes="(max-width: 560px) 43vw, 290px" />{confirmed && <span className={styles.claimed}><IconCheck size={14} />Sudah dipilih</span>}</div>
    <div className={styles.productInfo}><h2>{gift.title}</h2><p className={styles.price}>{formatNumber(Number(gift.price))}</p><span className={styles.cardAction}>{confirmed ? "Lihat detail kado" : "Lihat & hadiahkan"}</span></div>
  </article>;
}

function GiftCardLoading() {
  return <div className={styles.card}><Skeleton className="w-full aspect-square" /><div className={styles.productInfo}><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 mt-3" /></div></div>;
}
