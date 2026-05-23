import type { Metadata } from 'next'
import ScannerView from './scanner-view'

export const metadata: Metadata = {
  title: 'Scanner Absensi — Kekawinan.com',
}

export default async function ScannerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ScannerView slug={slug} />
}
