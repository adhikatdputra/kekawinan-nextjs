'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { UndanganTamu, UndanganContent } from '@/frontend/interface/undangan'
import { BASE_URL } from '@/lib/config'

interface QrAbsensiSectionProps {
  tamu: UndanganTamu
  tamuId: string
  slug: string
  content: UndanganContent | null
  /** 'light' = card putih (default), 'dark' = card dark sesuai tema gelap */
  variant?: 'light' | 'dark'
  /** Warna border & aksen QR, misal 'border-theme9-primary' */
  borderColor?: string
  /** Warna teks heading, misal 'text-theme9-secondary' */
  headingColor?: string
  /** Warna teks muted, misal 'text-gray-300' */
  mutedColor?: string
  /** Font heading, misal 'font-recoleta-alt' */
  fontHeading?: string
  /** Background wrapper section, misal 'bg-black' */
  wrapperBg?: string
}

function isHariH(dateWedding: string | null | undefined): boolean {
  if (!dateWedding) return false
  const today = new Date()
  const wedding = new Date(dateWedding)
  return (
    today.getFullYear() === wedding.getFullYear() &&
    today.getMonth() === wedding.getMonth() &&
    today.getDate() === wedding.getDate()
  )
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export default function QrAbsensiSection({
  tamu,
  tamuId,
  slug,
  content,
  variant = 'light',
  borderColor = 'border-gray-200',
  headingColor = 'text-gray-900',
  mutedColor = 'text-gray-500',
  fontHeading = '',
  wrapperBg = 'bg-white/5',
}: QrAbsensiSectionProps) {
  const [isConfirmed, setIsConfirmed] = useState(tamu.isConfirm === 1)
  const [attendedAt, setAttendedAt] = useState<string | null>(tamu.attendedAt)

  const hariH = isHariH(content?.dateWedding)
  const tamuUrl = `${BASE_URL}/${slug}/${tamuId}`

  const isDark = variant === 'dark'
  const cardBg = isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
  const textMain = isDark ? 'text-white' : 'text-gray-900'
  const qrFgColor = isDark ? '#ffffff' : '#111111'
  const qrBgColor = 'transparent'

  // Polling setiap 5 detik di hari H jika belum dikonfirmasi
  useEffect(() => {
    if (!hariH || isConfirmed) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tamu/${tamuId}/status`)
        if (!res.ok) return
        const json = await res.json()
        if (json?.data?.isConfirm === 1) {
          setIsConfirmed(true)
          setAttendedAt(json.data.attendedAt ?? null)
          clearInterval(interval)
        }
      } catch {
        // retry di interval berikutnya
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [hariH, isConfirmed, tamuId])

  if (!hariH) return null

  const mempelai = [content?.nameMale, content?.nameFemale].filter(Boolean).join(' & ')

  return (
    <div className={`w-full px-6 py-10 flex flex-col items-center gap-4 ${wrapperBg}`}>
      {isConfirmed ? (
        /* ── Confirmed state ── */
        <div className={`w-full max-w-xs ${cardBg} rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 text-center border ${borderColor}`}>
          <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-green-400 text-3xl">✓</span>
          </div>
          <h3 className={`font-semibold text-lg ${headingColor} ${fontHeading}`}>
            Kehadiran Terkonfirmasi!
          </h3>
          <p className={`text-sm ${mutedColor}`}>
            Terima kasih sudah hadir,{' '}
            <span className={`font-medium ${textMain}`}>{tamu.name}</span>!
          </p>
          {mempelai && (
            <p className={`text-sm ${mutedColor}`}>
              Selamat menikmati resepsi {mempelai} 🎉
            </p>
          )}
          {attendedAt && (
            <p className={`text-xs ${mutedColor}`}>
              Hadir pukul {formatTime(attendedAt)}
            </p>
          )}
        </div>
      ) : (
        /* ── QR state ── */
        <div className={`w-full max-w-xs ${cardBg} rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 text-center border ${borderColor}`}>
          <h3 className={`font-semibold ${headingColor} ${fontHeading}`}>
            Konfirmasi Kehadiranmu
          </h3>
          <p className={`text-sm ${mutedColor}`}>
            Tunjukkan QR ini kepada panitia saat kamu tiba di lokasi
          </p>
          <div className={`p-3 rounded-xl border ${borderColor} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <QRCodeSVG
              value={tamuUrl}
              size={180}
              level="M"
              fgColor={isDark ? '#111111' : qrFgColor}
              bgColor={isDark ? '#ffffff' : qrBgColor}
            />
          </div>
          <div className={`text-xs ${mutedColor} flex flex-col gap-0.5`}>
            {mempelai && <span className={`font-medium ${headingColor}`}>{mempelai}</span>}
            {tamu.name && <span>{tamu.name}</span>}
            {tamu.maxInvite && <span>Hadir: {tamu.maxInvite} orang</span>}
          </div>
        </div>
      )}
    </div>
  )
}
