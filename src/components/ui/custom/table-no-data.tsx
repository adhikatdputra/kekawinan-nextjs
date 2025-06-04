import { TableRow, TableCell } from "@/components/ui/table";
import { IconMoodSad } from "@tabler/icons-react";

export default function TableNoData({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center">
        <div className="flex gap-2 items-center justify-center">
          <IconMoodSad size={24} /> Data Tidak Ditemukan
        </div>
      </TableCell>
    </TableRow>
  );
}
