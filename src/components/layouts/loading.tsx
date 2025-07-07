"use client";

import { useState, useEffect } from "react";

const loveQuotes = [
  "Bukan tentang seberapa lama kita menunggu, tapi siapa yang akhirnya datang dan tak pernah pergi.",
  "Kisah cinta kita tak ditulis pena, tapi oleh takdir yang menyatukan dua hati.",
  "Cinta bukan tentang saling memandang, tapi tentang melihat ke arah yang sama — masa depan bersama.",
  "Kau hadir bukan untuk menyempurnakanku, tapi untuk melengkapiku.",
  "Di antara jutaan jiwa, Tuhan menuntunku padamu. Dan itu cukup bagiku untuk yakin.",
  "Cinta kita tak selalu sempurna, tapi selalu nyata.",
  "Jika mencintaimu adalah sebuah perjalanan, maka aku ingin tersesat selamanya.",
  "Sebelum bertemu kamu, aku tak tahu bahwa senyuman bisa mengubah hidup seseorang.",
  "Tuhan tahu kapan waktu terbaik — dan waktu itu adalah saat aku dan kamu dipertemukan.",
  "Pernikahan ini bukan akhir kisah cinta kita, melainkan babak terindah yang baru saja dimulai.",
];

export default function Loading() {
  const [quote, setQuote] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    setQuote(loveQuotes[randomIndex]);
  }, []);
  
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img
        src="/images/kekawinan-icon.svg"
        alt=""
        className={`w-[50px] animate-bounce transition-all duration-200 ease-in-out ${
          quote ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`text-sm font-medium px-8 text-center mt-4 transition-all duration-200 ease-in-out ${
          quote ? "opacity-100" : "opacity-0"
        }`}
      >
        {quote}
      </div>
    </div>
  );
}
