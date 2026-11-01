import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sumber teks: docs/draf-deskripsi-tema.md. Paragraf dipisah baris kosong.
const themes = [
  {
    componentName: "Theme1",
    name: "Nude Eucalyptus",
    keywords: ["undangan digital warna nude", "undangan pernikahan eucalyptus"],
    metaDescription:
      "Contoh undangan pernikahan digital warna nude dengan daun eucalyptus dan bingkai foto lengkung. Lihat demonya dan pakai untuk acaramu di Kekawinan.",
    description: `Nude Eucalyptus memakai warna krem dan cokelat muda yang kalem, dengan daun eucalyptus dan bunga putih kecil di sekitar foto. Foto pasangan dibingkai bentuk lengkung, sehingga halaman terasa seperti undangan cetak dengan kertas tebal.

Cover menampilkan foto kalian penuh satu layar dengan kartu putih berisi nama tamu di tengahnya. Bagian profil mempelai memakai foto bulat dengan nama orang tua di bawahnya.

Tema ini cocok kalau kamu ingin undangan yang tenang dan netral, dan foto prewedding kalian bernuansa hangat atau outdoor.`,
  },
  {
    componentName: "Theme2",
    name: "Sage Envelope",
    keywords: ["undangan digital amplop", "undangan pernikahan hijau sage"],
    metaDescription:
      "Contoh undangan pernikahan digital warna hijau sage dengan cover amplop yang terbuka saat tamu masuk. Lihat demonya di Kekawinan.",
    description: `Ciri utama Sage Envelope ada di cover: nama tamu ditulis pada kartu yang muncul dari amplop hijau, seperti menerima undangan fisik. Warna dasarnya hijau olive dan putih gading, dengan ilustrasi garis dua tangan bergandengan di bagian jadwal acara.

Hitung mundur tampil dalam kotak-kotak hijau di atas detail akad dan resepsi, jadi tamu langsung tahu berapa hari lagi acaranya.

Pilih tema ini kalau kamu ingin kesan "membuka surat undangan" dan menyukai warna hijau yang tidak terlalu terang.`,
  },
  {
    componentName: "Theme3",
    name: "Blush Rose",
    keywords: ["undangan pernikahan pink", "undangan digital mawar"],
    metaDescription:
      "Contoh undangan pernikahan digital warna blush pink dengan ilustrasi mawar dan bunga. Lihat demonya dan pakai untuk acaramu di Kekawinan.",
    description: `Blush Rose memakai warna pink lembut dengan ilustrasi bunga pink dan ungu di bagian bawah foto cover. Kartu akad dan resepsi diberi aksen mawar merah di sudutnya, dan tombol-tombolnya berwarna pink senada.

Halaman dibuka dengan foto pasangan dan kutipan ayat, lalu berlanjut ke profil mempelai dengan foto bulat di atas latar putih bersih.

Tema ini cocok untuk pasangan yang ingin nuansa feminin dan romantis tanpa warna yang terlalu mencolok.`,
  },
  {
    componentName: "Theme4",
    name: "Rustic Sage Garden",
    keywords: [
      "undangan rustic",
      "contoh undangan rustic",
      "desain undangan rustic",
      "undangan pernikahan hijau sage",
    ],
    metaDescription:
      "Contoh undangan pernikahan digital tema rustic garden warna hijau sage, dengan dedaunan dan bunga putih. Lihat demonya di Kekawinan.",
    description: `Rustic Sage Garden membawa gaya undangan rustic bernuansa taman: dedaunan hijau menjuntai dari sudut halaman dan bunga putih menghiasi kartu acara. Warna dasarnya hijau sage dan putih, dengan foto cover yang diberi bayangan gelap supaya nama kalian tetap terbaca jelas.

Kartu akad dan resepsi berwarna putih di atas latar foto, dengan tombol Google Maps, konfirmasi kehadiran, dan live streaming berwarna hijau.

Cocok untuk acara outdoor, garden party, atau pasangan yang mencari undangan rustic dengan warna hijau yang lembut.`,
  },
  {
    componentName: "Theme5",
    name: "Royal Blue",
    keywords: ["undangan pernikahan biru", "undangan digital warna biru"],
    metaDescription:
      "Contoh undangan pernikahan digital warna biru royal dan putih dengan ilustrasi bunga biru. Lihat demonya dan pakai untuk acaramu di Kekawinan.",
    description: `Royal Blue memadukan biru tua yang tegas dengan putih bersih. Profil mempelai ditampilkan dalam kartu biru dengan foto bulat berbingkai putih, dan bunga biru menghiasi bagian bawah foto cover.

Kartu akad dan resepsi memakai latar putih dengan ilustrasi garis tangan bergandengan di bagian atas, sehingga detail acara mudah dibaca.

Pilih tema ini kalau biru adalah warna seragam atau dekorasi acara kalian.`,
  },
  {
    componentName: "Theme6",
    name: "Lilac Bloom",
    keywords: ["undangan pernikahan ungu", "undangan digital lilac"],
    metaDescription:
      'Contoh undangan pernikahan digital warna lilac dengan bunga lavender dan pita "Happy Wedding Day". Lihat demonya di Kekawinan.',
    description: `Lilac Bloom memakai ungu muda dan putih, dengan bunga lavender di sudut kartu acara. Di atas jadwal ada pita "Happy Wedding Day" yang membuat halaman terasa lebih ceria.

Profil mempelai tampil di atas latar putih dengan label ungu, sedangkan kartu akad dan resepsi berlatar ungu gelap supaya kontras dengan bagian lain.

Cocok untuk pasangan yang menyukai warna ungu tetapi tetap ingin undangan yang terang.`,
  },
  {
    componentName: "Theme7",
    name: "Pink Envelope",
    keywords: ["undangan digital amplop pink", "undangan pernikahan pink pastel"],
    metaDescription:
      "Contoh undangan pernikahan digital warna pink pastel dengan cover amplop dan rangkaian bunga. Lihat demonya di Kekawinan.",
    description: `Seperti Sage Envelope, cover Pink Envelope menampilkan nama tamu pada kartu yang keluar dari amplop. Bedanya, tema ini memakai pink pastel dengan rangkaian bunga pink dan ungu di sudut foto.

Kartu akad dan resepsi diberi hiasan bunga kecil di atasnya, dan tombol-tombolnya berwarna cokelat tua supaya tetap terbaca di atas latar pink.

Pilih tema ini kalau kamu ingin efek membuka amplop dengan nuansa yang lebih manis.`,
  },
  {
    componentName: "Theme8",
    name: "Midnight Blue",
    keywords: ["undangan pernikahan dark mode", "undangan digital biru navy"],
    metaDescription:
      "Contoh undangan pernikahan digital warna navy gelap dengan aksen biru terang dan mawar biru. Lihat demonya di Kekawinan.",
    description: `Midnight Blue memakai latar navy gelap dengan aksen biru terang pada kartu mempelai. Mawar biru menghiasi foto cover, dan kaligrafi bismillah tampil putih di atas latar gelap.

Bagian love story disusun sebagai kartu foto dengan tanggal dan lokasi, sehingga cocok kalau kamu punya beberapa foto perjalanan hubungan untuk diceritakan.

Tema ini cocok untuk acara malam hari atau pasangan yang menyukai tampilan gelap.`,
  },
  {
    componentName: "Theme9",
    name: "Dark Lilac",
    keywords: ["undangan pernikahan hitam ungu", "undangan digital tema gelap"],
    metaDescription:
      "Contoh undangan pernikahan digital berlatar hitam dengan aksen ungu dan bunga ungu. Lihat demonya dan pakai untuk acaramu di Kekawinan.",
    description: `Dark Lilac berlatar hitam dengan aksen ungu pada label, tombol, dan kotak hitung mundur. Bunga ungu menghiasi sudut kartu akad dan resepsi.

Profil mempelai memakai foto bulat dengan nama yang ditulis putih di atas latar gelap, jadi foto kalian lebih menonjol dibanding dekorasinya.

Pilih tema ini kalau kamu ingin tampilan gelap tetapi dengan warna yang lebih lembut daripada biru.`,
  },
  {
    componentName: "Theme10",
    name: "Terracotta Peach",
    keywords: ["undangan pernikahan terracotta", "undangan digital warna peach"],
    metaDescription:
      "Contoh undangan pernikahan digital warna peach dan terracotta dengan ilustrasi bunga kering. Lihat demonya di Kekawinan.",
    description: `Terracotta Peach memakai warna peach, krem, dan cokelat bata yang hangat. Ilustrasi bunga kering menghiasi bagian atas cover dan judul tiap bagian, dan judulnya memakai huruf serif bergaya tulisan tangan.

Galeri foto ditampilkan sebagai slider dengan bingkai berbayang, dan profil mempelai memakai foto bulat dengan bingkai tipis.

Cocok untuk pasangan yang menyukai warna earthy, atau foto prewedding kalian bernuansa hangat.`,
  },
  {
    componentName: "Theme11",
    name: "Dark Teal",
    keywords: ["undangan digital modern gelap", "undangan pernikahan warna tosca"],
    metaDescription:
      "Contoh undangan pernikahan digital berlatar teal gelap dengan aksen tosca dan hitung mundur besar. Lihat demonya di Kekawinan.",
    description: `Dark Teal berlatar hijau kebiruan yang sangat gelap dengan aksen tosca terang. Hitung mundur tampil dengan angka besar berwarna tosca, dan love story disusun sebagai garis waktu vertikal dengan foto di tiap titiknya.

Profil mempelai memakai kartu tipis transparan berisi foto kecil, nama, dan nama orang tua, sehingga tampilannya ringkas.

Pilih tema ini kalau kamu ingin undangan yang terasa modern dan tidak memakai ornamen bunga.`,
  },
  {
    componentName: "Theme12",
    name: "Midnight Violet",
    keywords: ["undangan pernikahan ungu gelap", "undangan digital modern ungu"],
    metaDescription:
      "Contoh undangan pernikahan digital warna ungu tua dengan cahaya violet dan foto berbingkai bercahaya. Lihat demonya di Kekawinan.",
    description: `Midnight Violet memakai latar ungu tua dengan pendar cahaya violet dan pink. Foto pasangan di cover diberi bingkai bercahaya ungu, dengan nama kalian tepat di bawahnya.

Love story disusun sebagai garis waktu bernomor besar, dan detail acara tampil dalam kartu gelap dengan tombol ungu terang.

Cocok untuk pasangan yang ingin undangan dengan warna kuat dan kesan malam hari.`,
  },
  {
    componentName: "Theme13",
    name: "Fuchsia Pink",
    keywords: ["undangan pernikahan pink fuchsia", "undangan digital pink"],
    metaDescription:
      "Contoh undangan pernikahan digital warna pink fuchsia dengan gradasi dan kartu tamu berwarna. Lihat demonya di Kekawinan.",
    description: `Fuchsia Pink memakai gradasi pink terang dari cover sampai kartu acara. Nama tamu tampil di kartu bergradasi pink, dan hitung mundur memakai angka besar dengan warna yang sama.

Bagian lain berlatar putih dengan label pink kecil, sehingga halaman tetap mudah dibaca walaupun warnanya kuat.

Pilih tema ini kalau kamu ingin undangan yang cerah dan langsung menarik perhatian.`,
  },
  {
    componentName: "Theme14",
    name: "Lavender Blossom",
    keywords: ["undangan pernikahan lavender", "undangan digital ungu muda"],
    metaDescription:
      "Contoh undangan pernikahan digital warna lavender dan putih dengan ornamen kelopak bunga. Lihat demonya di Kekawinan.",
    description: `Lavender Blossom memakai ungu muda dan putih dengan ornamen kelopak bunga di sudut-sudut halaman. Kartu mempelai diberi label ungu, dan foto cover dilapisi gradasi lavender di bagian bawah.

Love story tampil sebagai garis waktu dengan foto kecil di sampingnya, dan seluruh halaman memakai latar putih yang lapang.

Cocok untuk pasangan yang ingin nuansa ungu yang lembut dan bersih.`,
  },
  {
    componentName: "Theme15",
    name: "Emerald Gold",
    keywords: ["undangan pernikahan hijau emas", "undangan digital elegan"],
    metaDescription:
      "Contoh undangan pernikahan digital warna hijau zamrud dan emas dengan bingkai lengkung dan ornamen emas. Lihat demonya di Kekawinan.",
    description: `Emerald Gold memakai hijau zamrud tua dengan huruf dan ornamen sudut berwarna emas. Foto pasangan ditampilkan dalam bingkai lengkung, dengan bunga merah di bagian atas dan ilustrasi pohon kelapa di kedua sisinya.

Judul "It's Wedding Day" dan hitung mundur tampil emas di atas latar hijau, dan foto mempelai disusun berdampingan dalam kartu hijau.

Pilih tema ini kalau kamu ingin kesan resmi dan elegan, atau dekorasi acara kalian memakai warna hijau dan emas.`,
  },
  {
    componentName: "Theme16",
    name: "Forest Bloom",
    keywords: ["undangan pernikahan hijau tua", "undangan digital hijau emas bunga"],
    metaDescription:
      "Contoh undangan pernikahan digital warna hijau hutan dan emas dengan rangkaian bunga berwarna. Lihat demonya di Kekawinan.",
    description: `Forest Bloom berlatar hijau hutan yang gelap dengan aksen emas. Rangkaian bunga berwarna, seperti dahlia pink dan aster putih, menghiasi bagian bawah foto cover dan sudut kartu mempelai.

Cover menampilkan nama kalian di kartu kapsul berbingkai emas dengan bintang kecil di atas dan bawahnya. Hitung mundur dan detail acara memakai kartu hijau dengan teks emas.

Cocok untuk pasangan yang ingin warna gelap yang hangat dengan sentuhan bunga yang meriah.`,
  },
  {
    componentName: "Theme17",
    name: "Cobalt Pop",
    keywords: [
      "undangan pernikahan lucu",
      "undangan digital kartun",
      "undangan pernikahan ceria",
    ],
    metaDescription:
      "Contoh undangan pernikahan digital yang lucu dan ceria, dengan karakter kartun biru dan pink serta warna cerah. Lihat demonya di Kekawinan.",
    description: `Cobalt Pop adalah tema paling ceria di Kekawinan. Dua karakter kartun, satu biru dan satu pink, bergandengan tangan di cover, lengkap dengan stiker kuning bertuliskan "A little love. A lot of fun!" dan nama kalian dalam huruf biru besar.

Setelah undangan dibuka, foto kalian diapit dua karakter mempelai. Profil pengantin memakai kartu lengkung pink dan biru, hitung mundur tampil dalam kotak warna-warni, dan bagian RSVP ditemani karakter hijau yang membawa surat cinta.

Pilih tema ini kalau kalian ingin undangan yang santai dan bikin tamu tersenyum, bukan yang formal dan kalem.`,
  },
  {
    componentName: "Theme18",
    name: "Panggih",
    keywords: [
      "undangan pernikahan adat jawa",
      "undangan digital jawa",
      "undangan pernikahan jawa klasik",
    ],
    metaDescription:
      "Contoh undangan pernikahan digital adat Jawa dengan gunungan, bingkai ukiran kayu pendopo, dan warna cokelat emas. Lihat demonya di Kekawinan.",
    description: `Panggih berarti "bertemu", nama salah satu prosesi dalam pernikahan adat Jawa. Undangannya dibuka seperti pintu kayu cokelat yang terbelah ke kiri dan kanan, lalu menampilkan gunungan berukir pohon kehidupan di atas kertas krem.

Setiap bagian dibingkai ukiran kayu pendopo dengan rangkaian melati di sudut bawahnya. Foto kalian tampil dalam bingkai lengkung bergaris emas, hitung mundur memakai angka emas di atas latar cokelat tua, dan ucapan dari tamu ditulis di kartu berhias motif kawung. Sapaan seperti "Panggih ing katresnan" dan "Matur nuwun" ikut melengkapi suasananya.

Cocok untuk pasangan yang menggelar pernikahan adat Jawa, atau ingin undangan yang klasik dan hangat dengan warna kayu dan emas.`,
  },
  {
    componentName: "Theme19",
    name: "Priangan",
    keywords: [
      "undangan pernikahan adat sunda",
      "undangan digital sunda",
      "undangan pernikahan siger sunda",
    ],
    metaDescription:
      "Contoh undangan pernikahan digital adat Sunda dengan siger, untaian melati, dan lukisan alam Priangan. Lihat demonya di Kekawinan.",
    description: `Priangan terinspirasi dari tanah Sunda. Cover menampilkan siger, mahkota pengantin Sunda, yang dihiasi untaian melati, di atas kertas krem berbingkai garis emas tipis. Di bagian bawah halaman ada lukisan rumah adat di tengah sawah terasering, dengan gunung berkabut di belakangnya.

Warna utamanya hijau hutan dan krem, dengan aksen emas. Sapaan Sunda seperti "Wilujeng sumping", "Dina bagja urang", dan "Hatur nuhun" menemani nama kalian, dan cerita cinta kalian tampil sebagai album foto.

Pilih tema ini kalau kalian menggelar pernikahan adat Sunda, atau ingin undangan bernuansa alam yang tenang dan sejuk.`,
  },
  {
    componentName: "Theme20",
    name: "Serambi Betawi",
    keywords: [
      "undangan pernikahan adat betawi",
      "undangan digital betawi",
      "undangan pernikahan ondel-ondel",
    ],
    metaDescription:
      "Contoh undangan pernikahan digital adat Betawi dengan rumah kebaya, ondel-ondel, dan lisplang gigi balang. Lihat demonya di Kekawinan.",
    description: `Serambi Betawi mengajak tamu masuk ke teras rumah Betawi. Setiap halaman dibingkai genteng merah, lisplang gigi balang berwarna emas, dan tiang kayu hijau, dengan bunga bugenvil di kedua sudut bawahnya.

Cover menampilkan ilustrasi rumah kebaya lengkap dengan pohon kelapa, dan sepasang ondel-ondel menyambut tamu setelah undangan dibuka. Warnanya krem, hijau tua, emas, dan merah marun, seperti rumah Betawi yang sedang menggelar hajatan.

Cocok untuk pasangan yang menggelar pernikahan adat Betawi, atau ingin undangan yang meriah dengan sentuhan budaya Jakarta.`,
  },
];

// Tanpa argumen: semua tema. Dengan argumen: hanya tema itu, mis.
//   pnpm db:seed-themes Theme4
async function main() {
  const only = process.argv.slice(2)
  const selected = only.length ? themes.filter((t) => only.includes(t.componentName)) : themes
  if (only.length && selected.length !== only.length) {
    throw new Error(`componentName tidak dikenal: ${only.join(", ")}`)
  }
  for (const theme of selected) {
    const { componentName, ...data } = theme;
    const result = await prisma.theme.updateMany({
      where: { componentName },
      data,
    });
    console.log(`${componentName} → ${data.name}: ${result.count} baris`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
