'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { IconQrcode, IconX } from '@tabler/icons-react'
import { UndanganTamu, UndanganContent } from '@/frontend/interface/undangan'

interface FloatingQrButtonProps {
  tamu: UndanganTamu | null
  tamuId: string
  slug: string
  content: UndanganContent | null
  bgColor?: string
  iconColor?: string
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export function FloatingQrButton({
  tamu,
  tamuId,
  slug,
  content,
  bgColor = 'bg-green-kwn',
  iconColor = 'text-white',
}: FloatingQrButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  // "physically attended" = scanned by crew (attendedAt is set), NOT just RSVP (isConfirm=1)
  const [isConfirmed, setIsConfirmed] = useState(!!tamu?.attendedAt)
  const [attendedAt, setAttendedAt] = useState<string | null>(tamu?.attendedAt ?? null)

  const tamuUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${slug}/${tamuId}`
  const mempelai = [content?.nameMale, content?.nameFemale].filter(Boolean).join(' & ')

  // Sync ulang jika tamu prop berubah (setelah data load)
  useEffect(() => {
    setIsConfirmed(!!tamu?.attendedAt)
    setAttendedAt(tamu?.attendedAt ?? null)
  }, [tamu?.attendedAt])

  // Polling setiap 5 detik jika belum dikonfirmasi
  useEffect(() => {
    if (isConfirmed || !tamuId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tamu/${tamuId}/status`)
        if (!res.ok) return
        const json = await res.json()
        if (json?.data?.attendedAt) {
          setIsConfirmed(true)
          setAttendedAt(json.data.attendedAt)
          clearInterval(interval)
        }
      } catch {
        // retry di interval berikutnya
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isConfirmed, tamuId])

  if (!tamu) return null

  return (
    <>
      {/* Sticky button — bottom-left, setara posisi dengan FloatingMusicGift di kanan */}
      <div className="fixed bottom-6 right-4 z-[9999]">
        <button
          onClick={() => setIsOpen(true)}
          className={`${bgColor} ${iconColor} rounded-full p-2 shadow-lg relative`}
          aria-label="Lihat QR Absensi"
        >
          <IconQrcode size={24} />
          {/* Dot indikator: hijau = belum, centang = sudah hadir */}
          <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isConfirmed ? 'bg-green-400' : 'bg-yellow-400'}`} />
        </button>
      </div>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 flex flex-col items-center gap-4 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <IconX size={20} />
            </button>

            {isConfirmed ? (
              /* ── Confirmed state ── */
              <>
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-500 text-3xl">✓</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Kehadiran Terkonfirmasi!
                </h3>
                <p className="text-sm text-gray-500">
                  Terima kasih sudah hadir,{' '}
                  <span className="font-medium text-gray-800">{tamu.name}</span>!
                </p>
                {mempelai && (
                  <p className="text-sm text-gray-400">
                    Selamat menikmati resepsi {mempelai} 🎉
                  </p>
                )}
                {attendedAt && (
                  <p className="text-xs text-gray-400">
                    Hadir pukul {formatTime(attendedAt)}
                  </p>
                )}
              </>
            ) : (
              /* ── QR state ── */
              <>
                <h3 className="font-semibold text-gray-900">Konfirmasi Kehadiranmu</h3>
                <p className="text-xs text-gray-400">
                  Tunjukkan QR ini kepada panitia saat kamu tiba di lokasi
                </p>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <QRCodeSVG value={tamuUrl} size={180} level="M" />
                </div>
                <div className="text-xs text-gray-400 flex flex-col gap-0.5">
                  {mempelai && <span className="font-medium text-gray-700">{mempelai}</span>}
                  {tamu.name && <span>{tamu.name}</span>}
                  {tamu.maxInvite && <span>Hadir: {tamu.maxInvite} orang</span>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
