import { IconMoodSadFilled } from "@tabler/icons-react";

export default function PendingNoData({
  message,
  slot,
}: {
  message: string;
  slot: React.ReactNode;
}) {
  return (
    <div className="bg-green-soft-kwn rounded-2xl p-6">
      <div className="flex flex-col items-center gap-2">
        <IconMoodSadFilled size={40} />
        <p className="mb-2">{message}</p>
        {slot}
      </div>
    </div>
  );
}
