import { IconMusic, IconMusicOff, IconGiftFilled } from "@tabler/icons-react";

export const FloatingMusicGift = ({
  onPlayMusic,
  onOpenGift,
  isPlayMusic,
  bgColor = "bg-green-kwn",
  iconColor = "text-white",
}: {
  onPlayMusic: () => void;
  onOpenGift: () => void;
  isPlayMusic: boolean;
  bgColor?: string;
  iconColor?: string;
}) => {
  return (
    <div className="fixed bottom-6 right-4">
      <div className="flex flex-col items-center gap-4">
        <button onClick={onPlayMusic}>
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
