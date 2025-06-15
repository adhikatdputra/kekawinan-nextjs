"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import undanganUserApi from "@/frontend/api/undangan-user";
import {
  UndanganTamu,
  UndanganDetail,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { toast } from "react-hot-toast";

const loveQuotes = [
  "Bukan tentang seberapa lama kita menunggu, tapi siapa yang akhirnya datang dan tak pernah pergi.",
  "Kisah cinta kita tak ditulis pena, tapi oleh takdir yang menyatukan dua hati.",
  "Cinta bukan tentang saling memandang, tapi tentang melihat ke arah yang sama — masa depan bersama.",
  "Kau hadir bukan untuk menyempurnakanku, tapi untuk melengkapiku.",
  "Di antara jutaan jiwa, Tuhan menuntunku padamu. Dan itu cukup bagiku untuk yakin.",
  "Cinta kita tak selalu sempurna, tapi selalu nyata.",
  "Jika mencintaimu adalah sebuah perjalanan, maka aku ingin tersesat selamanya.",
  "Sebelum bertemu kamu, aku tak tahu bahwa senyuman bisa mengubah hidup seseorang.",
  "Tuhan tahu kapan waktu terbaik — dan waktu itu adalah saat aku dan kamu dipertemukan.",
  "Pernikahan ini bukan akhir kisah cinta kita, melainkan babak terindah yang baru saja dimulai.",
];

interface ThemeComponentProps {
  undanganData: UndanganDetail;
  tamuData: UndanganTamu;
  ucapan: UndanganUcapan[];
  isPlayMusic: boolean;
  isSubmitting: boolean;
  onPlayMusic: () => void;
  onSubmitUcapan: (data: {
    name: string;
    attend: string;
    attend_total: string;
    message: string;
  }) => void;
}

export default function UndanganView({
  slug,
  id_tamu,
}: {
  slug: string;
  id_tamu: string;
}) {
  const router = useRouter();

  const [quote, setQuote] = useState("");
  const [music, setMusic] = useState<string | null>(null);
  const [isPlayMusic, setIsPlayMusic] = useState(false);
  const [ucapan, setUcapan] = useState<UndanganUcapan[]>([]);

  const {
    data: undanganData,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => undanganUserApi.getUndangan(slug),
    select: (data) => data.data as UndanganDetail,
  });

  const { data: tamu, refetch: refetchTamu } = useQuery({
    queryKey: ["undangan-user-tamu", id_tamu],
    queryFn: () => undanganUserApi.getTamu(id_tamu),
    select: (data) => data.data,
  });

  const { mutate: submitUcapan, isPending: isSubmitting } = useMutation({
    mutationFn: undanganUserApi.createUcapan,
  });

  const { mutate: changeStatusUcapan } = useMutation({
    mutationFn: undanganUserApi.changeStatusUcapan,
    onSuccess: () => {
      refetchTamu();
    },
  });

  const onSubmitUcapan = (data: {
    name: string;
    attend: string;
    attend_total: string;
    message: string;
  }) => {
    if (id_tamu != "demo") {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("attend", data.attend);
      formData.append("attend_total", data.attend_total || tamu?.max_invite);
      formData.append("message", data.message);
      formData.append("undangan_id", undanganData?.id ?? "");

      submitUcapan(formData, {
        onSuccess: (data) => {
          const res = data.data;
          if (res.success) {
            changeStatusUcapan(id_tamu);
            toast.success("Ucapan berhasil dikirim");
            refetch();
          } else {
            toast.error(res.message);
          }
        },
      });
      return;
    }

    toast.success("Ucapan berhasil dikirim");
    // Jika id_tamu adalah demo, maka tambahkan ucapan ke dalam array ucapan
    setUcapan([
      {
        name: data.name,
        attend: data.attend,
        attend_total: parseInt(data.attend_total),
        message: data.message,
      },
      ...ucapan,
    ]);
  };

  const handlePlayMusic = () => {
    console.log("isPlayMusicBefore", isPlayMusic);
    const a = document.getElementById("music") as HTMLAudioElement;
    if (isPlayMusic) {
      a.pause();
      setIsPlayMusic(false);
    } else {
      a.play();
      setIsPlayMusic(true);
    }
  };

  const [ThemeComponent, setThemeComponent] =
    useState<React.ComponentType<ThemeComponentProps> | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      const name = undanganData?.theme?.component_name;
      if (!name) {
        setThemeComponent(null);
        return;
      }

      try {
        const component = await import(
          `@/components/theme/${name.toLowerCase()}`
        );
        setTimeout(() => {
          setThemeComponent(() => component.default);
        }, 3000);
      } catch (err) {
        console.error("Theme not found:", name);
        console.error("Error:", err);
        setThemeComponent(null);
      }
    };

    setMusic(undanganData?.undangan_content?.music ?? null);
    setUcapan(undanganData?.ucapan ?? []);

    loadTheme();
  }, [undanganData]);

  useEffect(() => {
    if (isError) {
      router.push("/");
    }
  }, [isError]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    setQuote(loveQuotes[randomIndex]);
  }, []);

  return (
    <div className="max-w-[450px] mx-auto overflow-x-hidden">
      {ThemeComponent && undanganData ? (
        <ThemeComponent
          undanganData={undanganData}
          tamuData={tamu}
          ucapan={ucapan}
          isPlayMusic={isPlayMusic}
          isSubmitting={isSubmitting}
          onSubmitUcapan={onSubmitUcapan}
          onPlayMusic={handlePlayMusic}
        />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <img
            src="/images/kekawinan-icon.svg"
            alt=""
            className={`w-[50px] animate-bounce transition-all duration-200 ease-in-out ${
              quote ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`text-sm font-medium px-8 text-center mt-4 transition-all duration-200 ease-in-out ${
              quote ? "opacity-100" : "opacity-0"
            }`}
          >
            {quote}
          </div>
        </div>
      )}

      {music && <audio id="music" src={music} autoPlay={isPlayMusic} />}
    </div>
  );
}
