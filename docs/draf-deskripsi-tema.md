# Draf deskripsi tema (untuk halaman /themeN/demo)

**Dibuat:** 30 Oktober 2026
**Sumber:** thumbnail tiap tema (Cloudinary, dari `/api/theme/public`), token warna di `globals.css`, dan komponen `src/components/theme/themeN.tsx`.

## Sebelum dibaca: nama tema perlu diganti

Nama di `src/frontend/constants/themes-meta.ts` banyak yang tidak cocok dengan desainnya. Di database nama tema cuma "Template Public N", jadi file meta itu satu-satunya sumber nama. Kalau namanya dibiarkan, halaman tema menargetkan keyword yang salah (misalnya "undangan pernikahan hijau" untuk tema yang pink).

| Tema | Nama sekarang | Tampilan sebenarnya | Usulan nama |
|------|---------------|---------------------|-------------|
| theme1 | Romantic Floral | Krem/nude, daun eucalyptus, bingkai lengkung | Nude Eucalyptus |
| theme2 | Modern Minimalist | Hijau olive, cover amplop | Sage Envelope |
| theme3 | Classic Elegant | Blush pink, mawar | Blush Rose |
| theme4 | Rustic Garden | Hijau sage, daun menjuntai | Rustic Sage Garden ("rustic" dipertahankan, lihat catatan GSC) |
| theme5 | Elegant Gold | Biru royal dan putih | Royal Blue |
| theme6 | Boho Chic | Lilac, bunga lavender | Lilac Bloom |
| theme7 | Tropical Paradise | Pink pastel, cover amplop | Pink Envelope |
| theme8 | Dark Romance | Navy gelap, mawar biru | Midnight Blue |
| theme9 | Soft Pastel | Hitam dengan aksen ungu | Dark Lilac |
| theme10 | Royal Blue | Peach/terracotta, bunga kering | Terracotta Peach |
| theme11 | Sakura Japanese | Teal gelap, aksen tosca | Dark Teal |
| theme12 | Vintage Classic | Ungu tua dengan cahaya violet | Midnight Violet |
| theme13 | Green Forest | Pink fuchsia | Fuchsia Pink |
| theme14 | Luxury Black | Lavender dan putih | Lavender Blossom |
| theme15 | Watercolor Dream | Hijau zamrud dan emas | Emerald Gold |
| theme16 | Terracotta Earthy | Hijau hutan gelap, emas, bunga warna-warni | Forest Bloom |

URL tetap `/themeN/demo`, jadi ganti nama tidak merusak link apa pun.

**Keyword di bawah adalah usulan, belum dicek volumenya.** Sebaiknya dicek dulu di Google Search Console atau Keyword Planner sebelum dipakai di title.

---

## Teks bersama (tampil di semua halaman tema)

Fitur semua tema sama, jadi daftar ini cukup ditulis sekali di template halaman, bukan diulang di tiap deskripsi.

> Setiap tema sudah termasuk:
> - cover dengan nama tamu,
> - profil kedua mempelai,
> - detail akad dan resepsi dengan Google Maps dan link live streaming,
> - hitung mundur ke hari acara,
> - love story dan galeri foto,
> - RSVP dan ucapan dari tamu,
> - musik latar,
> - amplop digital dan wishlist kado.
>
> Semua isi bisa kamu ganti dari dashboard, dan tampilan menyesuaikan layar HP tamu.

---

## theme1 · Nude Eucalyptus

**Keyword:** undangan digital warna nude, undangan pernikahan eucalyptus
**Meta description (≤155 karakter):** Contoh undangan pernikahan digital warna nude dengan daun eucalyptus dan bingkai foto lengkung. Lihat demonya dan pakai untuk acaramu di Kekawinan.

**Deskripsi:**
Nude Eucalyptus memakai warna krem dan cokelat muda yang kalem, dengan daun eucalyptus dan bunga putih kecil di sekitar foto. Foto pasangan dibingkai bentuk lengkung, sehingga halaman terasa seperti undangan cetak dengan kertas tebal.

Cover menampilkan foto kalian penuh satu layar dengan kartu putih berisi nama tamu di tengahnya. Bagian profil mempelai memakai foto bulat dengan nama orang tua di bawahnya.

Tema ini cocok kalau kamu ingin undangan yang tenang dan netral, dan foto prewedding kalian bernuansa hangat atau outdoor.

---

## theme2 · Sage Envelope

**Keyword:** undangan digital amplop, undangan pernikahan hijau sage
**Meta description:** Contoh undangan pernikahan digital warna hijau sage dengan cover amplop yang terbuka saat tamu masuk. Lihat demonya di Kekawinan.

**Deskripsi:**
Ciri utama Sage Envelope ada di cover: nama tamu ditulis pada kartu yang muncul dari amplop hijau, seperti menerima undangan fisik. Warna dasarnya hijau olive dan putih gading, dengan ilustrasi garis dua tangan bergandengan di bagian jadwal acara.

Hitung mundur tampil dalam kotak-kotak hijau di atas detail akad dan resepsi, jadi tamu langsung tahu berapa hari lagi acaranya.

Pilih tema ini kalau kamu ingin kesan "membuka surat undangan" dan menyukai warna hijau yang tidak terlalu terang.

---

## theme3 · Blush Rose

**Keyword:** undangan pernikahan pink, undangan digital mawar
**Meta description:** Contoh undangan pernikahan digital warna blush pink dengan ilustrasi mawar dan bunga. Lihat demonya dan pakai untuk acaramu di Kekawinan.

**Deskripsi:**
Blush Rose memakai warna pink lembut dengan ilustrasi bunga pink dan ungu di bagian bawah foto cover. Kartu akad dan resepsi diberi aksen mawar merah di sudutnya, dan tombol-tombolnya berwarna pink senada.

Halaman dibuka dengan foto pasangan dan kutipan ayat, lalu berlanjut ke profil mempelai dengan foto bulat di atas latar putih bersih.

Tema ini cocok untuk pasangan yang ingin nuansa feminin dan romantis tanpa warna yang terlalu mencolok.

---

## theme4 · Rustic Sage Garden

**Keyword:** undangan rustic, contoh undangan rustic, desain undangan rustic, undangan pernikahan hijau sage
**Meta description:** Contoh undangan pernikahan digital tema rustic garden warna hijau sage, dengan dedaunan dan bunga putih. Lihat demonya di Kekawinan.

> Catatan GSC (Agustus sampai Oktober 2026): keluarga query "rustic" adalah satu-satunya keyword non-brand yang muncul, di posisi 21 sampai 35. Karena itu kata "rustic" dipertahankan di nama tema ini.

**Deskripsi:**
Rustic Sage Garden membawa gaya undangan rustic bernuansa taman: dedaunan hijau menjuntai dari sudut halaman dan bunga putih menghiasi kartu acara. Warna dasarnya hijau sage dan putih, dengan foto cover yang diberi bayangan gelap supaya nama kalian tetap terbaca jelas.

Kartu akad dan resepsi berwarna putih di atas latar foto, dengan tombol Google Maps, konfirmasi kehadiran, dan live streaming berwarna hijau.

Cocok untuk acara outdoor, garden party, atau pasangan yang mencari undangan rustic dengan warna hijau yang lembut.

---

## theme5 · Royal Blue

**Keyword:** undangan pernikahan biru, undangan digital warna biru
**Meta description:** Contoh undangan pernikahan digital warna biru royal dan putih dengan ilustrasi bunga biru. Lihat demonya dan pakai untuk acaramu di Kekawinan.

**Deskripsi:**
Royal Blue memadukan biru tua yang tegas dengan putih bersih. Profil mempelai ditampilkan dalam kartu biru dengan foto bulat berbingkai putih, dan bunga biru menghiasi bagian bawah foto cover.

Kartu akad dan resepsi memakai latar putih dengan ilustrasi garis tangan bergandengan di bagian atas, sehingga detail acara mudah dibaca.

Pilih tema ini kalau biru adalah warna seragam atau dekorasi acara kalian.

---

## theme6 · Lilac Bloom

**Keyword:** undangan pernikahan ungu, undangan digital lilac
**Meta description:** Contoh undangan pernikahan digital warna lilac dengan bunga lavender dan pita "Happy Wedding Day". Lihat demonya di Kekawinan.

**Deskripsi:**
Lilac Bloom memakai ungu muda dan putih, dengan bunga lavender di sudut kartu acara. Di atas jadwal ada pita "Happy Wedding Day" yang membuat halaman terasa lebih ceria.

Profil mempelai tampil di atas latar putih dengan label ungu, sedangkan kartu akad dan resepsi berlatar ungu gelap supaya kontras dengan bagian lain.

Cocok untuk pasangan yang menyukai warna ungu tetapi tetap ingin undangan yang terang.

---

## theme7 · Pink Envelope

**Keyword:** undangan digital amplop pink, undangan pernikahan pink pastel
**Meta description:** Contoh undangan pernikahan digital warna pink pastel dengan cover amplop dan rangkaian bunga. Lihat demonya di Kekawinan.

**Deskripsi:**
Seperti Sage Envelope, cover Pink Envelope menampilkan nama tamu pada kartu yang keluar dari amplop. Bedanya, tema ini memakai pink pastel dengan rangkaian bunga pink dan ungu di sudut foto.

Kartu akad dan resepsi diberi hiasan bunga kecil di atasnya, dan tombol-tombolnya berwarna cokelat tua supaya tetap terbaca di atas latar pink.

Pilih tema ini kalau kamu ingin efek membuka amplop dengan nuansa yang lebih manis.

---

## theme8 · Midnight Blue

**Keyword:** undangan pernikahan dark mode, undangan digital biru navy
**Meta description:** Contoh undangan pernikahan digital warna navy gelap dengan aksen biru terang dan mawar biru. Lihat demonya di Kekawinan.

**Deskripsi:**
Midnight Blue memakai latar navy gelap dengan aksen biru terang pada kartu mempelai. Mawar biru menghiasi foto cover, dan kaligrafi bismillah tampil putih di atas latar gelap.

Bagian love story disusun sebagai kartu foto dengan tanggal dan lokasi, sehingga cocok kalau kamu punya beberapa foto perjalanan hubungan untuk diceritakan.

Tema ini cocok untuk acara malam hari atau pasangan yang menyukai tampilan gelap.

---

## theme9 · Dark Lilac

**Keyword:** undangan pernikahan hitam ungu, undangan digital tema gelap
**Meta description:** Contoh undangan pernikahan digital berlatar hitam dengan aksen ungu dan bunga ungu. Lihat demonya dan pakai untuk acaramu di Kekawinan.

**Deskripsi:**
Dark Lilac berlatar hitam dengan aksen ungu pada label, tombol, dan kotak hitung mundur. Bunga ungu menghiasi sudut kartu akad dan resepsi.

Profil mempelai memakai foto bulat dengan nama yang ditulis putih di atas latar gelap, jadi foto kalian lebih menonjol dibanding dekorasinya.

Pilih tema ini kalau kamu ingin tampilan gelap tetapi dengan warna yang lebih lembut daripada biru.

---

## theme10 · Terracotta Peach

**Keyword:** undangan pernikahan terracotta, undangan digital warna peach
**Meta description:** Contoh undangan pernikahan digital warna peach dan terracotta dengan ilustrasi bunga kering. Lihat demonya di Kekawinan.

**Deskripsi:**
Terracotta Peach memakai warna peach, krem, dan cokelat bata yang hangat. Ilustrasi bunga kering menghiasi bagian atas cover dan judul tiap bagian, dan judulnya memakai huruf serif bergaya tulisan tangan.

Galeri foto ditampilkan sebagai slider dengan bingkai berbayang, dan profil mempelai memakai foto bulat dengan bingkai tipis.

Cocok untuk pasangan yang menyukai warna earthy, atau foto prewedding kalian bernuansa hangat.

---

## theme11 · Dark Teal

**Keyword:** undangan digital modern gelap, undangan pernikahan warna tosca
**Meta description:** Contoh undangan pernikahan digital berlatar teal gelap dengan aksen tosca dan hitung mundur besar. Lihat demonya di Kekawinan.

**Deskripsi:**
Dark Teal berlatar hijau kebiruan yang sangat gelap dengan aksen tosca terang. Hitung mundur tampil dengan angka besar berwarna tosca, dan love story disusun sebagai garis waktu vertikal dengan foto di tiap titiknya.

Profil mempelai memakai kartu tipis transparan berisi foto kecil, nama, dan nama orang tua, sehingga tampilannya ringkas.

Pilih tema ini kalau kamu ingin undangan yang terasa modern dan tidak memakai ornamen bunga.

---

## theme12 · Midnight Violet

**Keyword:** undangan pernikahan ungu gelap, undangan digital modern ungu
**Meta description:** Contoh undangan pernikahan digital warna ungu tua dengan cahaya violet dan foto berbingkai bercahaya. Lihat demonya di Kekawinan.

**Deskripsi:**
Midnight Violet memakai latar ungu tua dengan pendar cahaya violet dan pink. Foto pasangan di cover diberi bingkai bercahaya ungu, dengan nama kalian tepat di bawahnya.

Love story disusun sebagai garis waktu bernomor besar, dan detail acara tampil dalam kartu gelap dengan tombol ungu terang.

Cocok untuk pasangan yang ingin undangan dengan warna kuat dan kesan malam hari.

---

## theme13 · Fuchsia Pink

**Keyword:** undangan pernikahan pink fuchsia, undangan digital pink
**Meta description:** Contoh undangan pernikahan digital warna pink fuchsia dengan gradasi dan kartu tamu berwarna. Lihat demonya di Kekawinan.

**Deskripsi:**
Fuchsia Pink memakai gradasi pink terang dari cover sampai kartu acara. Nama tamu tampil di kartu bergradasi pink, dan hitung mundur memakai angka besar dengan warna yang sama.

Bagian lain berlatar putih dengan label pink kecil, sehingga halaman tetap mudah dibaca walaupun warnanya kuat.

Pilih tema ini kalau kamu ingin undangan yang cerah dan langsung menarik perhatian.

---

## theme14 · Lavender Blossom

**Keyword:** undangan pernikahan lavender, undangan digital ungu muda
**Meta description:** Contoh undangan pernikahan digital warna lavender dan putih dengan ornamen kelopak bunga. Lihat demonya di Kekawinan.

**Deskripsi:**
Lavender Blossom memakai ungu muda dan putih dengan ornamen kelopak bunga di sudut-sudut halaman. Kartu mempelai diberi label ungu, dan foto cover dilapisi gradasi lavender di bagian bawah.

Love story tampil sebagai garis waktu dengan foto kecil di sampingnya, dan seluruh halaman memakai latar putih yang lapang.

Cocok untuk pasangan yang ingin nuansa ungu yang lembut dan bersih.

---

## theme15 · Emerald Gold

**Keyword:** undangan pernikahan hijau emas, undangan digital elegan
**Meta description:** Contoh undangan pernikahan digital warna hijau zamrud dan emas dengan bingkai lengkung dan ornamen emas. Lihat demonya di Kekawinan.

**Deskripsi:**
Emerald Gold memakai hijau zamrud tua dengan huruf dan ornamen sudut berwarna emas. Foto pasangan ditampilkan dalam bingkai lengkung, dengan bunga merah di bagian atas dan ilustrasi pohon kelapa di kedua sisinya.

Judul "It's Wedding Day" dan hitung mundur tampil emas di atas latar hijau, dan foto mempelai disusun berdampingan dalam kartu hijau.

Pilih tema ini kalau kamu ingin kesan resmi dan elegan, atau dekorasi acara kalian memakai warna hijau dan emas.

---

## theme16 · Forest Bloom

**Keyword:** undangan pernikahan hijau tua, undangan digital hijau emas bunga
**Meta description:** Contoh undangan pernikahan digital warna hijau hutan dan emas dengan rangkaian bunga berwarna. Lihat demonya di Kekawinan.

**Deskripsi:**
Forest Bloom berlatar hijau hutan yang gelap dengan aksen emas. Rangkaian bunga berwarna, seperti dahlia pink dan aster putih, menghiasi bagian bawah foto cover dan sudut kartu mempelai.

Cover menampilkan nama kalian di kartu kapsul berbingkai emas dengan bintang kecil di atas dan bawahnya. Hitung mundur dan detail acara memakai kartu hijau dengan teks emas.

Cocok untuk pasangan yang ingin warna gelap yang hangat dengan sentuhan bunga yang meriah.

---

## theme17 · Cobalt Pop

**Keyword:** undangan pernikahan lucu, undangan digital kartun, undangan pernikahan ceria
**Meta description:** Contoh undangan pernikahan digital yang lucu dan ceria, dengan karakter kartun biru dan pink serta warna cerah. Lihat demonya di Kekawinan.

**Deskripsi:**
Cobalt Pop adalah tema paling ceria di Kekawinan. Dua karakter kartun, satu biru dan satu pink, bergandengan tangan di cover, lengkap dengan stiker kuning bertuliskan "A little love. A lot of fun!" dan nama kalian dalam huruf biru besar.

Setelah undangan dibuka, foto kalian diapit dua karakter mempelai. Profil pengantin memakai kartu lengkung pink dan biru, hitung mundur tampil dalam kotak warna-warni, dan bagian RSVP ditemani karakter hijau yang membawa surat cinta.

Pilih tema ini kalau kalian ingin undangan yang santai dan bikin tamu tersenyum, bukan yang formal dan kalem.

---

## theme18 · Panggih

**Keyword:** undangan pernikahan adat jawa, undangan digital jawa, undangan pernikahan jawa klasik
**Meta description:** Contoh undangan pernikahan digital adat Jawa dengan gunungan, bingkai ukiran kayu pendopo, dan warna cokelat emas. Lihat demonya di Kekawinan.

**Deskripsi:**
Panggih berarti "bertemu", nama salah satu prosesi dalam pernikahan adat Jawa. Undangannya dibuka seperti pintu kayu cokelat yang terbelah ke kiri dan kanan, lalu menampilkan gunungan berukir pohon kehidupan di atas kertas krem.

Setiap bagian dibingkai ukiran kayu pendopo dengan rangkaian melati di sudut bawahnya. Foto kalian tampil dalam bingkai lengkung bergaris emas, hitung mundur memakai angka emas di atas latar cokelat tua, dan ucapan dari tamu ditulis di kartu berhias motif kawung. Sapaan seperti "Panggih ing katresnan" dan "Matur nuwun" ikut melengkapi suasananya.

Cocok untuk pasangan yang menggelar pernikahan adat Jawa, atau ingin undangan yang klasik dan hangat dengan warna kayu dan emas.

---

## theme19 · Priangan

**Keyword:** undangan pernikahan adat sunda, undangan digital sunda, undangan pernikahan siger sunda
**Meta description:** Contoh undangan pernikahan digital adat Sunda dengan siger, untaian melati, dan lukisan alam Priangan. Lihat demonya di Kekawinan.

**Deskripsi:**
Priangan terinspirasi dari tanah Sunda. Cover menampilkan siger, mahkota pengantin Sunda, yang dihiasi untaian melati, di atas kertas krem berbingkai garis emas tipis. Di bagian bawah halaman ada lukisan rumah adat di tengah sawah terasering, dengan gunung berkabut di belakangnya.

Warna utamanya hijau hutan dan krem, dengan aksen emas. Sapaan Sunda seperti "Wilujeng sumping", "Dina bagja urang", dan "Hatur nuhun" menemani nama kalian, dan cerita cinta kalian tampil sebagai album foto.

Pilih tema ini kalau kalian menggelar pernikahan adat Sunda, atau ingin undangan bernuansa alam yang tenang dan sejuk.

---

## theme20 · Serambi Betawi

**Keyword:** undangan pernikahan adat betawi, undangan digital betawi, undangan pernikahan ondel-ondel
**Meta description:** Contoh undangan pernikahan digital adat Betawi dengan rumah kebaya, ondel-ondel, dan lisplang gigi balang. Lihat demonya di Kekawinan.

**Deskripsi:**
Serambi Betawi mengajak tamu masuk ke teras rumah Betawi. Setiap halaman dibingkai genteng merah, lisplang gigi balang berwarna emas, dan tiang kayu hijau, dengan bunga bugenvil di kedua sudut bawahnya.

Cover menampilkan ilustrasi rumah kebaya lengkap dengan pohon kelapa, dan sepasang ondel-ondel menyambut tamu setelah undangan dibuka. Warnanya krem, hijau tua, emas, dan merah marun, seperti rumah Betawi yang sedang menggelar hajatan.

Cocok untuk pasangan yang menggelar pernikahan adat Betawi, atau ingin undangan yang meriah dengan sentuhan budaya Jakarta.

---

## theme21 · Kabut Pagi

**Keyword:** undangan pernikahan tema gunung, undangan digital nuansa alam, undangan pernikahan hijau hutan
**Meta description:** Contoh undangan pernikahan digital bernuansa pegunungan berkabut di pagi hari, dengan warna hijau hutan dan krem. Lihat demonya di Kekawinan.

**Deskripsi:**
Kabut Pagi memakai foto pegunungan saat fajar sebagai latarnya: deretan gunung yang menembus kabut putih, hutan pinus di bagian bawah, dan danau kecil yang memantulkan cahaya pagi. Nama kalian tampil besar di atas langit yang pucat, lalu tamu membuka undangan dari panel hijau hutan di bagian bawah cover.

Foto pasangan dibingkai seperti cetakan foto perjalanan dengan rangkaian pakis, ranting pinus, dan bunga liar putih di sudutnya. Foto mempelai memakai bingkai lengkung, dan detail acara disusun seperti jadwal perjalanan bernomor di atas latar hijau tua, lengkap dengan tombol menuju lokasi dan live streaming.

Cocok untuk pasangan yang suka mendaki atau berlibur ke alam, atau ingin undangan yang tenang dan sejuk dengan nuansa hijau dan krem.

---

## Catatan untuk diperiksa

- Deskripsi ditulis dari thumbnail dan kode. Beberapa detail kecil (misalnya jenis bunga di theme4 dan theme16) sebaiknya dicocokkan dengan demo aslinya.
- Kalimat "cocok untuk..." adalah saran gaya, bukan data. Silakan ganti sesuai pengalaman kamu dengan user.
- Semua tema saat ini bertarif 0 credit. Aku sengaja tidak menulis "gratis" di deskripsi supaya teks tidak perlu diubah kalau harga tema berubah. Info harga lebih baik ditampilkan dari data API di halaman.
- theme2 dan theme7 sama-sama memakai cover amplop. Deskripsinya saling menyebut supaya tidak terbaca sebagai konten duplikat.
