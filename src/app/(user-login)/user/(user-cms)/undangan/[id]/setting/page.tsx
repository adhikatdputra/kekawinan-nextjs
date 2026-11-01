"use client";

import { useState, useEffect, useRef } from "react";
import {
  CmsPageHeader,
  CmsSection,
  CmsField,
  CmsSaveBar,
  cmsTextarea,
  cmsFocusRing,
} from "@/components/pages/undangan/cms-ui";
import { Textarea } from "@/components/ui/textarea";
import { IconRestore } from "@tabler/icons-react";
import {
  DEFAULT_WHATSAPP_MESSAGE,
  WHATSAPP_MESSAGE_MAX_LENGTH,
  WHATSAPP_MESSAGE_VARIABLES,
  renderWhatsappMessage,
} from "@/lib/whatsapp-message";
import undanganApi from "@/frontend/api/undangan";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import undanganContentApi from "@/frontend/api/undangan-content";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const religion_version_list = [
  {
    name: "Islam",
    value: "ISLAM",
  },
];

// WhatsApp only understands *bold*, so the preview shows just that
function WhatsappPreview({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*\n]+\*)/g).map((part, i) =>
        /^\*[^*\n]+\*$/.test(part) ? <strong key={i}>{part.slice(1, -1)}</strong> : part
      )}
    </>
  );
}

export default function SettingPage() {
  const params = useParams();
  const id = params.id as string;

  // Form Data
  const [religion_version, setReligionVersion] = useState<string>("ISLAM");
  const [whatsappMessage, setWhatsappMessage] = useState(DEFAULT_WHATSAPP_MESSAGE);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Same key as the sidebar, so this reuses its request (permalink for the preview)
  const { data: undangan } = useQuery({
    queryKey: ["undangan-detail", id],
    queryFn: () => undanganApi.getUndanganDetail(id),
    select: (data) => data.data.data,
  });

  const { data: undanganContent, refetch } = useQuery({
    queryKey: ["undangan-content", id],
    queryFn: () => undanganContentApi.getUndanganContent(id),
    select: (data) => data.data.data,
  });

  const { mutate: updateUndanganContent, isPending: isUpdating } = useMutation({
    mutationFn: (body: object) =>
      undanganContentApi.updateUndanganContent(id, body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Data berhasil diubah");
        refetch();
        // The guest list builds WhatsApp messages from undangan-detail
        queryClient.invalidateQueries({ queryKey: ["undangan-detail", id] });
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error("Data gagal diubah");
    },
  });

  const handleUpdateUndanganContent = () => {
    if (whatsappMessage.length > WHATSAPP_MESSAGE_MAX_LENGTH) {
      toast.error(`Pesan WhatsApp maksimal ${WHATSAPP_MESSAGE_MAX_LENGTH} karakter`);
      return;
    }
    updateUndanganContent({
      religionVersion: religion_version,
      // Saving the untouched default as empty keeps the invitation on the built-in text
      whatsappMessage: whatsappMessage.trim() === DEFAULT_WHATSAPP_MESSAGE.trim() ? "" : whatsappMessage,
    });
  };

  const insertVariable = (key: string) => {
    const el = messageRef.current;
    const token = `{${key}}`;
    if (!el) {
      setWhatsappMessage((m) => m + token);
      return;
    }
    const start = el.selectionStart ?? whatsappMessage.length;
    const end = el.selectionEnd ?? start;
    setWhatsappMessage(whatsappMessage.slice(0, start) + token + whatsappMessage.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  useEffect(() => {
    if (undanganContent) {
      setReligionVersion(undanganContent.religionVersion);
      setWhatsappMessage(undanganContent.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE);
    }
  }, [undanganContent]);

  const preview = renderWhatsappMessage(whatsappMessage, {
    nama_tamu: "Budi Santoso",
    pengantin: undanganContent?.title?.replace("&", "dan") || "Romeo dan Juliet",
    tanggal: undanganContent?.resepsiTime || "3 Desember 2026 • 19.00 WIB",
    lokasi: undanganContent?.resepsiPlace || "Gedung Serbaguna",
    link: `https://kekawinan.com/${undangan?.permalink ?? "undangan"}/id-tamu`,
  });
  const isDefault = whatsappMessage.trim() === DEFAULT_WHATSAPP_MESSAGE.trim();
  const tooLong = whatsappMessage.length > WHATSAPP_MESSAGE_MAX_LENGTH;

  return (
    <div className="flex flex-col gap-6 text-brand-ink">
      <CmsPageHeader
        title="Pengaturan"
        description="Atur versi undangan dan pesan WhatsApp yang dikirim ke tamu."
      />

      <CmsSection title="Versi undangan">
        <CmsField
          label="Agama"
          htmlFor="religion_version"
          hint="Saat ini baru tersedia versi Islam."
        >
          <Select value={religion_version} onValueChange={setReligionVersion}>
            <SelectTrigger
              id="religion_version"
              className="h-11! w-full max-w-[240px] rounded-xl border-brand-line bg-white text-brand-ink"
            >
              <SelectValue placeholder="Pilih agama" />
            </SelectTrigger>
            <SelectContent>
              {religion_version_list.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CmsField>
      </CmsSection>

      <CmsSection
        title="Pesan WhatsApp untuk tamu"
        description="Teks ini dipakai saat kamu mengirim atau menyalin undangan dari halaman Tamu undangan."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="grid content-start gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="whatsapp-message" className="text-sm font-bold">
                Isi pesan
              </label>
              {!isDefault && (
                <button
                  type="button"
                  onClick={() => setWhatsappMessage(DEFAULT_WHATSAPP_MESSAGE)}
                  className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand-green underline underline-offset-4 ${cmsFocusRing}`}
                >
                  <IconRestore size={16} aria-hidden="true" />
                  Kembalikan teks bawaan
                </button>
              )}
            </div>
            <Textarea
              id="whatsapp-message"
              ref={messageRef}
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              rows={16}
              aria-describedby="whatsapp-message-help"
              aria-invalid={tooLong || undefined}
              className={`${cmsTextarea} min-h-[320px] leading-relaxed`}
            />
            <div id="whatsapp-message-help" className="grid gap-2">
              <p className={`text-right text-[13px] tabular-nums ${tooLong ? "font-bold text-brand-rose" : "text-brand-muted"}`}>
                {whatsappMessage.length}/{WHATSAPP_MESSAGE_MAX_LENGTH} karakter
              </p>
              <p className="text-[13px] text-brand-muted">
                Klik untuk menyisipkan data otomatis di posisi kursor. Tulis{" "}
                <code className="rounded bg-white px-1">*teks*</code> untuk huruf tebal.
              </p>
              <div className="flex flex-wrap gap-2">
                {WHATSAPP_MESSAGE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-brand-line bg-white px-3 text-[13px] transition-colors hover:bg-brand-mint ${cmsFocusRing} focus-visible:outline-offset-2`}
                  >
                    <code className="font-bold text-brand-green">{`{${v.key}}`}</code>
                    <span className="text-brand-muted">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid content-start gap-3">
            <p className="text-sm font-bold">Contoh yang diterima tamu</p>
            <div className="rounded-2xl bg-[#e7ddd3] p-3 sm:p-4">
              <div className="ml-auto max-w-[92%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3.5 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap text-[#111b21]">
                <WhatsappPreview text={preview} />
              </div>
            </div>
            <p className="text-[13px] text-brand-muted">
              Nama tamu dan link di atas hanya contoh. Saat dikirim, isinya mengikuti tiap tamu.
            </p>
          </div>
        </div>
      </CmsSection>

      <CmsSaveBar onSave={handleUpdateUndanganContent} pending={isUpdating} />
    </div>
  );
}
