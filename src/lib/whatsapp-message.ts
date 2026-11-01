// Template for the invitation message sent to guests via WhatsApp.
// Users can override it per invitation (UndanganContent.whatsappMessage);
// null means "use the default below".

export const WHATSAPP_MESSAGE_MAX_LENGTH = 2000;

export const WHATSAPP_MESSAGE_VARIABLES = [
  { key: "nama_tamu", label: "Nama tamu" },
  { key: "pengantin", label: "Nama pengantin" },
  { key: "tanggal", label: "Waktu resepsi" },
  { key: "lokasi", label: "Lokasi resepsi" },
  { key: "link", label: "Link undangan tamu" },
] as const;

export type WhatsappMessageValues = Record<(typeof WHATSAPP_MESSAGE_VARIABLES)[number]["key"], string>;

export const DEFAULT_WHATSAPP_MESSAGE = `Bismillahirrahmanirrahim
Assalamu'alaikum Warahmatullahi Wabarakatuh

Yth. Bpk/Ibu/Sdr/i *{nama_tamu}*,

Dengan mengharap ridha dan rahmat Allah SWT, serta tanpa mengurangi rasa hormat. Perkenankan kami mengundang Bpk/Ibu/Sdr/i untuk hadir di acara pernikahan kami:

*Pernikahan {pengantin}*
*Tanggal:* {tanggal}
*Lokasi:* {lokasi}

Merupakan suatu kehormatan bagi kami apabila Bpk/Ibu/Sdr/i dapat menghadiri/ menyaksikan prosesi pernikahan kami, serta jangan lupa konfirmasi kehadiranmu ya pada tautan dibawah ini:

{link}

Kami juga mengharapkan ucapan, harapan, serta doa Bpk/Ibu/Sdr/i untuk kami.

Atas perhatiannya kami ucapkan terimakasih.`;

/** Fills {variable} placeholders; unknown placeholders are left as typed */
export function renderWhatsappMessage(template: string | null | undefined, values: WhatsappMessageValues) {
  const source = template?.trim() ? template : DEFAULT_WHATSAPP_MESSAGE;
  return source.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key as keyof WhatsappMessageValues] : match
  );
}
