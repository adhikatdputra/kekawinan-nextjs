"use client";

import Lottie from "lottie-react";
import NotFoundAnimation from "../../../public/animation/404.json";

export default function NotFound({
  title = "404",
  description = "Halaman tidak ditemukan",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <Lottie animationData={NotFoundAnimation} loop={true} />
      <div className="flex flex-col items-center justify-center mt-8 text-center px-6 gap-3">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}
