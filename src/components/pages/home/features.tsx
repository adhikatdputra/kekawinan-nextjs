"use client";

import Image from "next/image";
import { motion } from "motion/react";

const boxFitur = [
  {
    img: "/images/fitur/fitur-theme.png",
    name: "Tema Undangan",
    desc: "Pilih tema undangan sesuai gaya kamu! Modern, klasik, rustic — semua ada!",
  },
  {
    img: "/images/fitur/fitur-content.png",
    name: "Atur Sendiri Kontennya",
    desc: "Mau ganti nama, alamat, atau foto prewed? Semua bisa kamu atur sendiri!",
  },
  {
    img: "/images/fitur/fitur-musik.png",
    name: "Tambahkan Musik Favorit",
    desc: "Bisa masukin lagu favorit biar undangan makin berkesan! 🎶",
  },
  {
    img: "/images/fitur/fitur-hadiah.png",
    name: "Info Kado & Hadiah",
    desc: "Tambahkan no. rekening & alamat pengiriman kado. Tinggal klik! 🎁",
  },
  {
    img: "/images/fitur/fitur-tamu.png",
    name: "Tamu Undangan",
    desc: "Tiap link undangan otomatis tampilkan nama tamu. Bikin mereka merasa spesial pas buka undangan 🎉",
  },
  {
    img: "/images/fitur/fitur-whatsapp.png",
    name: "Kirim Undangan via WhatsApp",
    desc: "Masukkan nama + jumlah tamu, Undangan langsung dikirim ke WhatsApp mereka!",
  },
  {
    img: "/images/fitur/fitur-rsvp.png",
    name: "RSVP + Ucapan Tamu",
    desc: "Tamu bisa konfirmasi kehadiran & kasih ucapan langsung, Identitas aman karena pakai user ID tamu! ✅",
  },
  {
    img: "/images/fitur/fitur-manage.png",
    name: "Manajemen Kehadiran & Ucapan",
    desc: "Lihat siapa yang datang & kelola semua ucapan masuk. Gak repot, semua rapi!",
  },
];

export default function Features() {
  return (
    <div className="bg-green-soft-kwn md:rounded-t-[100px] py-16 md:py-24">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: 0.2,
          }}
          viewport={{ once: true }}
          className="text-black text-center text-4xl md:text-5xl mb-4 font-bold"
        >
          Bikin Undangan, Bikin Kenangan
        </motion.h2>
        <motion.div
          className="text-center font-medium text-black text-lg md:text-xl w-full max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: 0.4,
          }}
          viewport={{ once: true }}
        >
          <p  
            dangerouslySetInnerHTML={{
              __html:
                "Buat website undangan nikah digital yang bisa kamu atur sendiri dari tema, foto prewed, sampai playlist favorit! <br /> Gratis, gampang, dan pastinya berkesan! ✨",
            }}
          ></p>
        </motion.div>

        <div className="flex flex-wrap justify-center md:px-16 pt-10 md:pt-20">
          {boxFitur.map((item, index) => (
            <div className="w-full md:w-1/2 lg:w-1/3" key={index}>
              <motion.div
                className="bg-white rounded-2xl p-4 min-h-[340px] text-center flex flex-col justify-center gap-4 m-4 bg-[url('/images/bg-fitur.png')] bg-cover bg-center"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.6 + index * 0.2,
                }}
                viewport={{ once: true }}
              >
                <Image
                  src={item.img}
                  alt=""
                  className="w-[118px] mx-auto"
                  width={118}
                  height={118}
                />
                <div className="text-2xl font-bold text-black">{item.name}</div>
                <div
                  className="text-black"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                ></div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
