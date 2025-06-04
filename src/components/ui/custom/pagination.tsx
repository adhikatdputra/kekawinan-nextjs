import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Pagination({
  page,
  setPage,
  totalPage,
  totalData,
  pageSize,
  setPageSize,
  totalDataPerPage,
}: {
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
  totalData: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalDataPerPage: number;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
      <div className="text-sm text-greycol">
        {totalDataPerPage} dari {totalData} data
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
        <div className="flex items-center gap-3">
          Baris per halaman
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[75px]">
              <SelectValue
                placeholder="30"
                className="text-sm placeholder:text-sm"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          Halaman {page} dari {totalPage}
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              className="p-0 w-8 h-8"
              onClick={() => setPage(1)}
            >
              <IconChevronsLeft size={18} />
            </Button>
            <Button
              variant={"outline"}
              className="p-0 w-8 h-8"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <IconChevronLeft size={18} />
            </Button>
            <Button
              variant={"outline"}
              className="p-0 w-8 h-8"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPage}
            >
              <IconChevronRight size={18} />
            </Button>
            <Button
              variant={"outline"}
              className="p-0 w-8 h-8"
              onClick={() => setPage(totalPage)}
            >
              <IconChevronsRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
