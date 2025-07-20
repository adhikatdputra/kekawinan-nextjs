import { IconMusic, IconMusicOff, IconGiftFilled, IconGiftCardFilled } from "@tabler/icons-react";
import Link from "next/link";

export const FloatingMusicGift = ({
  onPlayMusic,
  onOpenGift,
  isPlayMusic,
  bgColor = "bg-green-kwn",
  iconColor = "text-white",
  darkMode = false,
  giftLength,
  slug,
}: {
  onPlayMusic: () => void;
  onOpenGift: () => void;
  isPlayMusic: boolean;
  bgColor?: string;
  iconColor?: string;
  darkMode?: boolean;
  giftLength: number;
  slug: string;
}) => {
  return (
    <div className="fixed bottom-6 right-4 z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onPlayMusic}
          className={`${
            darkMode ? "bg-white text-black rounded-full p-2" : "text-black"
          }`}
        >
          {isPlayMusic ? <IconMusic /> : <IconMusicOff />}
        </button>
        <button
          onClick={onOpenGift}
          className={`${bgColor} ${iconColor} rounded-full p-2`}
        >
          <IconGiftFilled />
        </button>
        {giftLength > 0 && (
          <Link href={`/${slug}/gift`} target="_blank">
            <button
              className={`bg-green-950 ${iconColor} rounded-full p-2 -mt-1`}
            >
              <IconGiftCardFilled />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
