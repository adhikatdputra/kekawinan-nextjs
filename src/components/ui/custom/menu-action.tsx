import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { IconDots, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

export default function MenuAction({
  handleLihat,
  handleDelete,
  handleEdit,
  items,
}: {
  handleLihat?: () => void;
  handleDelete?: () => void;
  handleEdit?: () => void;
  items: ("Lihat" | "Edit" | "Hapus")[];
}) {
  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer rounded-md border border-border p-1 hover:bg-primary hover:text-white">
        <IconDots size={18} stroke={1.5} />
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <div className="flex flex-col">
          <div className="border-b border-border/55 px-4 py-2 text-sm font-semibold">
            Action
          </div>
          {items.includes("Lihat") && (
            <Button
              variant="ghost"
              className="justify-start rounded-none hover:bg-green-kwn hover:text-white"
              onClick={handleLihat}
            >
              <IconEye size={24} />
              Lihat
            </Button>
          )}
          {items.includes("Edit") && (
            <Button
              variant="ghost"
              className="justify-start rounded-none hover:bg-green-soft-kwn hover:text-white"
              onClick={handleEdit}
            >
              <IconEdit size={24} />
              Edit
            </Button>
          )}
          {items.includes("Hapus") && (
            <Button
              variant="ghost"
              className="justify-start rounded-none hover:bg-red-700 hover:text-white"
              onClick={handleDelete}
            >
              <IconTrash size={24} />
              Hapus
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
