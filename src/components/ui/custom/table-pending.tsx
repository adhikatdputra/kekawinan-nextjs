import { TableRow, TableCell } from "@/components/ui/table";
import { IconLoader } from "@tabler/icons-react";

export default function TablePending({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center">
        <div className="flex gap-2 items-center justify-center">
          <IconLoader size={24} className="animate-spin" /> Please wait ...
        </div>
      </TableCell>
    </TableRow>
  );
}
