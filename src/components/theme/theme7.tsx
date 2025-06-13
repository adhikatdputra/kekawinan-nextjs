"use client";

import { useState } from "react";
import DialogGift from "@/components/card/dialog-gift";
import { UndanganDetail, UndanganTamu } from "@/frontend/interface/undangan";
import Galeri from "@/components/card/galeri";

export default function Theme7({
  onPlayMusic,
  isPlayMusic,
  undanganData,
  tamuData,
}: {
  onPlayMusic: () => void;
  isPlayMusic: boolean;
  undanganData: UndanganDetail;
  tamuData: UndanganTamu;
}) {
  const [isOpenGift, setIsOpenGift] = useState(false);

  console.log(tamuData);

  return (
    <div>
      <button onClick={onPlayMusic}>
        {isPlayMusic ? "Pause Music" : "Play Music"}
      </button>
      <div>
        <button onClick={() => setIsOpenGift(true)}>Open Gift</button>
      </div>

      <Galeri galeri={undanganData.undangan_gallery} />

      {/* Open Dialog Gift */}
      <DialogGift
        gift={undanganData.undangan_gift}
        isOpen={isOpenGift}
        setIsOpen={setIsOpenGift}
      />
    </div>
  );
}
