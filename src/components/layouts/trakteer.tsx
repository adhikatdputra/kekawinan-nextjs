import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Trakteer() {
  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-6">
      <Link href="https://trakteer.id/partnerinaja/tip" target="_blank" rel="noopener noreferrer" aria-label="Yuk support Kekawinan">
        <Button className="h-12 w-12 rounded-full bg-red-700 p-0 hover:bg-red-800 sm:h-10 sm:w-auto sm:rounded-md sm:px-4 sm:py-2">
          <Image
            src="https://cdn.trakteer.id/images/embed/trbtn-icon.png"
            alt=""
            width={500}
            height={500}
            className="h-auto w-[18px] sm:w-[15px]"
          />
          <span className="hidden sm:inline">Yuk support kami 🫰🏻</span>
        </Button>
      </Link>
    </div>
  );
}
