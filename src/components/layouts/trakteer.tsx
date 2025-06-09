import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Trakteer() {
  return (
    <div className="fixed bottom-8 right-6">
      <Link href="https://trakteer.id/partnerinaja/tip" target="_blank">
        <Button className="bg-red-700 hover:bg-red-800">
          <Image
            src="https://cdn.trakteer.id/images/embed/trbtn-icon.png"
            alt=""
            width={500}
            height={500}
            className="w-[15px] h-auto"
          />
          <span>Yuk support kami 🫰🏻</span>
        </Button>
      </Link>
    </div>
  );
}
