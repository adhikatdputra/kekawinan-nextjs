import { IconLoader2 } from "@tabler/icons-react";

export default function PendingData() {
  return (
    <div className="bg-gray-100 rounded-2xl p-6">
      <div className="flex justify-center items-center gap-2">
        <IconLoader2 size={20} className="animate-spin" />
        <p>Please wait...</p>
      </div>
    </div>
  );
}
