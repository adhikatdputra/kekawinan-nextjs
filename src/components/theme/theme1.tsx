export default function Theme1({
  onPlayMusic,
  onOpenGift,
  isPlayMusic,
}: {
  onPlayMusic: () => void;
  onOpenGift: () => void;
  isPlayMusic: boolean;
}) {
  return (
    <div>
      <button onClick={onPlayMusic}>{isPlayMusic ? "Pause Music" : "Play Music"}</button>
      <button onClick={onOpenGift}>Open Gift</button>
    </div>
  );
}