import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { IconLogin2, IconLogout2, IconMenu4 } from "@tabler/icons-react";

export default function HeaderWeb() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full  shadow-xl bg-blur header">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/kekawinan-logo.png"
              alt="Kekawinan"
              width={400}
              height={400}
              className="w-[200px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold">
              Dashboard
            </Link>
            <Link href="/" className="font-semibold">
              Profile
            </Link>
            <Link href="/auth/login">
              <Button className="text-white">
                <IconLogin2 size={20} />
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
