"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import undanganUserApi from "@/frontend/api/undangan-user";
import giftApi from "@/frontend/api/gift";
import {
  UndanganTamu,
  UndanganDetail,
  UndanganUcapan,
  Gift,
} from "@/frontend/interface/undangan";
import { toast } from "react-hot-toast";
import Loading from "@/components/layouts/loading";

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
  giftLength: number;
  slug: string;
}

export default function UndanganView({
  slug,
  id_tamu,
}: {
  slug: string;
  id_tamu: string;
}) {
  const router = useRouter();

  const [music, setMusic] = useState<string | null>(null);
  const [isPlayMusic, setIsPlayMusic] = useState(false);
  const [ucapan, setUcapan] = useState<UndanganUcapan[]>([]);
  const [giftList, setGiftList] = useState<Gift[]>([]);
  
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

  const {
    mutate: mutateGiftList,
  } = useMutation({
    mutationFn: (undangan_id: string) => giftApi.getAll(undangan_id),
    onSuccess: (data) => {
      setGiftList(data.data.data);
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

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audioElement = document.getElementById("music") as HTMLAudioElement;

      if (document.hidden) {
        // Halaman tersembunyi - pause musik
        if (audioElement && !audioElement.paused) {
          audioElement.pause();
        }
      } else {
        // Halaman terlihat kembali - selalu auto play musik
        if (audioElement && music) {
          audioElement.play().catch((error) => {
            console.log("Auto-play failed:", error);
          });
          setIsPlayMusic(true);
        }
      }
    };

    // Tambahkan event listener untuk page visibility
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [music]);

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
    if (undanganData?.id) {
      mutateGiftList(undanganData.id);
    }

    loadTheme();
  }, [undanganData]);

  useEffect(() => {
    if (isError) {
      router.push("/");
    }
  }, [isError]);

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
          giftLength={giftList.length}
          slug={slug}
        />
      ) : (
        <Loading />
      )}

      {music && <audio id="music" src={music} autoPlay={isPlayMusic} />}
    </div>
  );
}
