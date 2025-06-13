"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import undanganUserApi from "@/frontend/api/undangan-user";
import { UndanganTamu, UndanganDetail } from "@/frontend/interface/undangan";

import CountdownTimer from "@/components/card/counting-down";
import UcapanConfirm from "@/components/card/ucapan-confirm";
import { toast } from "react-hot-toast";

interface ThemeComponentProps {
  onPlayMusic: () => void;
  onOpenGift: () => void;
  isPlayMusic: boolean;
  undanganData: UndanganDetail;
  tamuData: UndanganTamu;
}

export default function UndanganView({
  slug,
  id_tamu,
}: {
  slug: string;
  id_tamu: string;
}) {
  const [music, setMusic] = useState<string | null>(null);
  const [isPlayMusic, setIsPlayMusic] = useState(false);

  const { data: undanganData } = useQuery({
    queryKey: ["undangan-user-page", slug],
    queryFn: () => undanganUserApi.getUndangan(slug),
    select: (data) => data.data as UndanganDetail,
  });

  const { data: tamu } = useQuery({
    queryKey: ["undangan-user-tamu", id_tamu],
    queryFn: () => undanganUserApi.getTamu(id_tamu),
    select: (data) => data.data,
  });

  const { mutate: submitUcapan, isPending: isSubmitting } = useMutation({
    mutationFn: undanganUserApi.createUcapan,
  });

  const { mutate: changeStatusUcapan } = useMutation({
    mutationFn: undanganUserApi.changeStatusUcapan,
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
      formData.append("attend_total", data.attend_total);
      formData.append("message", data.message);

      submitUcapan(formData, {
        onSuccess: (data) => {
          const res = data.data;
          if (res.success) {
            changeStatusUcapan(id_tamu);
            toast.success("Ucapan berhasil dikirim");
          } else {
            toast.error(res.message);
          }
        },
      });
      return;
    }

    // Jika id_tamu adalah demo, maka tambahkan ucapan ke dalam array ucapan
    undanganData?.ucapan.unshift({
      name: data.name,
      attend: data.attend,
      attend_total: parseInt(data.attend_total),
      message: data.message,
    });
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
    console.log("undanganData", undanganData);
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
        setThemeComponent(() => component.default);
      } catch (err) {
        console.error("Theme not found:", name);
        console.error("Error:", err);
        setThemeComponent(null);
      }
    };

    setMusic(undanganData?.undangan_content?.music ?? null);

    loadTheme();
  }, [undanganData]);

  return (
    <div className="max-w-[400px] mx-auto">
      UndanganView: {slug} {id_tamu}
      {ThemeComponent && undanganData ? (
        <ThemeComponent
          onPlayMusic={handlePlayMusic}
          isPlayMusic={isPlayMusic}
          undanganData={undanganData}
          tamuData={tamu}
          onOpenGift={() => {
            console.log("open gift");
          }}
        />
      ) : (
        <div>Memuat tema...</div>
      )}
      <CountdownTimer
        targetDate={undanganData?.undangan_content?.date_wedding ?? ""}
      />
      <UcapanConfirm
        tamu={tamu}
        isLoading={isSubmitting}
        onSubmit={({ data }) => {
          onSubmitUcapan(data);
        }}
      />
      
      {music && <audio id="music" src={music} autoPlay={isPlayMusic} />}
    </div>
  );
}
