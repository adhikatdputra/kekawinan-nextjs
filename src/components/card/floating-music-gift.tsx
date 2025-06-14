import { IconMusic, IconMusicOff, IconGiftFilled } from "@tabler/icons-react";

export const FloatingMusicGift = ({
  onPlayMusic,
  onOpenGift,
  isPlayMusic,
  bgColor = "bg-green-kwn",
  iconColor = "text-white",
  darkMode = false,
}: {
  onPlayMusic: () => void;
  onOpenGift: () => void;
  isPlayMusic: boolean;
  bgColor?: string;
  iconColor?: string;
  darkMode?: boolean;
}) => {
  return (
    <div className="fixed bottom-6 right-4 z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <button onClick={onPlayMusic} className={`${darkMode ? "bg-white text-black rounded-full p-2" : "text-black"}`}>
          {isPlayMusic ? <IconMusic /> : <IconMusicOff />}
        </button>
        <button
          onClick={onOpenGift}
          className={`${bgColor} ${iconColor} rounded-full p-2`}
        >
          <IconGiftFilled />
        </button>
      </div>
    </div>
  );
};
