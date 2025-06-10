"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function UndanganPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    router.push(`/user/undangan/${id}/overview`);
  }, [id, router]);
}
