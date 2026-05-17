'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from '@/lib/axios'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { NotFoundException } from '@zxing/library'

type ScanState = 'scanning' | 'found' | 'confirming' | 'confirmed' | 'error'

interface TamuData {
  id: string
  name: string | null
  maxInvite: number | null
  isConfirm: number
  attendedAt: string | null
}

interface ScanResult {
  alreadyConfirmed: boolean
  tamu: TamuData
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export default function ScannerView({ slug }: { slug: string }) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const scanningRef = useRef(false)

  const [state, setState] = useState<ScanState>('scanning')
  const [scannedTamu, setScannedTamu] = useState<TamuData | null>(null)
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [scanCount, setScanCount] = useState(0)
  const [isConfirming, setIsConfirming] = useState(false)

  // Auth check
  useEffect(() => {
    const isAuthenticated = Cookies.get('isAuthenticated')
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=/${slug}/scanner`)
    }
  }, [slug, router])

  const stopScanner = useCallback(() => {
    if (readerRef.current) {
      BrowserMultiFormatReader.releaseAllStreams()
      readerRef.current = null
    }
    scanningRef.current = false
  }, [])

  const startScanner = useCallback(async () => {
    if (scanningRef.current || !videoRef.current) return
    scanningRef.current = true

    try {
      const reader = new BrowserMultiFormatReader()
      readerRef.current = reader

      await reader.decodeFromVideoDevice(undefined, videoRef.current, async (result, err) => {
        if (!result || state !== 'scanning') return
        if (err instanceof NotFoundException) return

        const text = result.getText()

        // Parse tamuId dari URL: https://domain.com/slug/tamuId
        let tamuId: string | null = null
        try {
          const url = new URL(text)
          const parts = url.pathname.split('/').filter(Boolean)
          // Expect: /slug/tamuId
          if (parts.length === 2 && parts[0] === slug) {
            tamuId = parts[1]
          }
        } catch {
          // bukan URL valid
        }

        if (!tamuId) {
          stopScanner()
          setState('error')
          setErrorMessage('❌ QR tidak dikenali. Pastikan kamu scan QR dari undangan yang benar.')
          return
        }

        stopScanner()
        setState('found')

        try {
          const res = await axios.post(`/undangan/${slug}/attendance`, { tamuId })
          const data: ScanResult = res.data.data
          setScannedTamu(data.tamu)
          setAlreadyConfirmed(data.alreadyConfirmed)
        } catch (err: unknown) {
          const status = (err as { response?: { status?: number } })?.response?.status
          setState('error')
          if (status === 403) {
            setErrorMessage('Kamu tidak memiliki akses ke scanner undangan ini.')
          } else if (status === 404) {
            setErrorMessage('❌ QR tidak dikenali. Pastikan kamu scan QR dari undangan yang benar.')
          } else {
            setErrorMessage('⚠️ Tidak ada koneksi atau terjadi kesalahan. Coba lagi.')
          }
        }
      })
    } catch {
      scanningRef.current = false
      setState('error')
      setErrorMessage('⚠️ Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan.')
    }
  }, [slug, state, stopScanner])

  useEffect(() => {
    if (state === 'scanning') {
      startScanner()
    }
    return () => {
      if (state !== 'scanning') stopScanner()
    }
  }, [state, startScanner, stopScanner])

  useEffect(() => {
    return () => stopScanner()
  }, [stopScanner])

  const handleConfirm = async () => {
    if (!scannedTamu || isConfirming) return
    setIsConfirming(true)
    try {
      const res = await axios.post(`/undangan/${slug}/attendance`, { tamuId: scannedTamu.id })
      const data: ScanResult = res.data.data
      setScannedTamu(data.tamu)
      setAlreadyConfirmed(data.alreadyConfirmed)
      setState('confirmed')
      if (!data.alreadyConfirmed) setScanCount((c) => c + 1)
    } catch {
      setState('error')
      setErrorMessage('⚠️ Tidak ada koneksi atau terjadi kesalahan. Coba lagi.')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleReset = () => {
    setScannedTamu(null)
    setAlreadyConfirmed(false)
    setErrorMessage('')
    setState('scanning')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-900 border-b border-gray-800">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
          ←
        </button>
        <div>
          <p className="text-xs text-gray-400">/{slug}</p>
          <h1 className="font-semibold text-sm">Scanner Absensi</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">

        {/* SCANNING STATE */}
        {state === 'scanning' && (
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border-2 border-gray-700">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              {/* Scan frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/60 rounded-xl relative">
                  <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl" />
                  <span className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl" />
                  <span className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl" />
                  <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl" />
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm text-center">Arahkan kamera ke QR Code tamu</p>
          </div>
        )}

        {/* FOUND STATE — tampil info tamu sebelum konfirmasi */}
        {state === 'found' && scannedTamu && (
          <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <h2 className="font-semibold text-lg">Tamu Ditemukan</h2>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <Row label="Nama" value={scannedTamu.name ?? '-'} />
              <Row label="Diundang" value={`${scannedTamu.maxInvite ?? '-'} orang`} />
              <Row
                label="Status"
                value={
                  scannedTamu.isConfirm === 1
                    ? `Sudah hadir pukul ${scannedTamu.attendedAt ? formatTime(scannedTamu.attendedAt) : '-'}`
                    : 'Belum absen'
                }
              />
            </div>

            {alreadyConfirmed ? (
              <div className="bg-yellow-900/40 border border-yellow-700 rounded-xl p-3 text-yellow-300 text-sm">
                ⚠️ Tamu ini sudah tercatat hadir pukul{' '}
                {scannedTamu.attendedAt ? formatTime(scannedTamu.attendedAt) : '-'}. Scan tidak diproses ulang.
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isConfirming ? 'Menyimpan...' : 'Konfirmasi Hadir'}
              </button>
            )}

            <button
              onClick={handleReset}
              className="w-full text-gray-400 hover:text-white text-sm py-2"
            >
              Batal / Scan Ulang
            </button>
          </div>
        )}

        {/* CONFIRMED STATE */}
        {state === 'confirmed' && scannedTamu && (
          <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-3xl">✓</span>
            </div>
            <h2 className="font-semibold text-xl text-green-400">Berhasil Dicatat!</h2>
            <p className="text-gray-300">
              <span className="font-medium text-white">{scannedTamu.name ?? 'Tamu'}</span>
            </p>
            {scannedTamu.attendedAt && (
              <p className="text-sm text-gray-400">
                Hadir pukul {formatTime(scannedTamu.attendedAt)}
              </p>
            )}
            <button
              onClick={handleReset}
              className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Scan Tamu Berikutnya
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {state === 'error' && (
          <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <p className="text-gray-300 text-sm">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Counter */}
      <div className="p-4 text-center text-sm text-gray-500 bg-gray-900 border-t border-gray-800">
        Sudah scan hari ini: <span className="text-white font-medium">{scanCount} tamu</span>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  )
}
