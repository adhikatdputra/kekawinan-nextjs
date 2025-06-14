"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UndanganTamu } from "@/frontend/interface/undangan";

export default function UcapanConfirm({
  tamu,
  bgColor,
  bgButton,
  colorButton,
  colorHeading,
  fontHeading = "font-glitten",
  isLoading,
  onSubmit,
}: {
  tamu: UndanganTamu;
  bgColor?: string;
  bgButton?: string;
  colorButton?: string;
  colorHeading?: string;
  fontHeading?: string;
  isLoading?: boolean;
  onSubmit: ({
    data,
  }: {
    data: {
      name: string;
      attend: string;
      attend_total: string;
      message: string;
    };
  }) => void;
}) {
  const [name, setName] = useState("");
  const [attend, setAttend] = useState("");
  const [attend_total, setAttendTotal] = useState("");
  const [message, setMessage] = useState("");
  const [is_confirm, setIsConfirm] = useState(false);

  const resetForm = () => {
    setAttend("");
    setAttendTotal("");
    setMessage("");
  };

  const submitUcapan = () => {
    const data = {
      name: name,
      attend: attend,
      attend_total: attend_total,
      message: message,
    };
    onSubmit({ data });
    resetForm();
  };

  useEffect(() => {
    setName(tamu?.name ?? "Tamu Spesial");
    setIsConfirm(Boolean(tamu?.is_confirm) ?? false);
  }, [tamu]);

  return (
    <div className={`px-6 py-16 ${bgColor}`}>
      <h1
        className={`text-2xl font-medium text-center mb-8 ${fontHeading} ${colorHeading}`}
      >
        RSVP dan Ucapan Doa
      </h1>
      {!is_confirm ? (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white text-black"
              disabled
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="attend">Kehadiran</Label>
            <Select value={attend} onValueChange={setAttend}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Pilih Kehadiran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Ya, Hadir</SelectItem>
                <SelectItem value="No">Tidak Hadir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {attend === "Yes" && (
            <div className="grid gap-2">
              <Label htmlFor="attend_total">Jumlah Kehadiran</Label>
              <Select value={attend_total} onValueChange={setAttendTotal}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Pilih Jumlah Kehadiran" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: tamu.max_invite ?? 4 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="message">Pesan untuk kami</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sampaikan pesan untuk kami..."
              className="bg-white"
            />
          </div>
          <div className="flex justify-center mt-2">
            <Button
              className={`${bgButton} ${colorButton}`}
              onClick={submitUcapan}
              disabled={
                !name ||
                !attend ||
                (attend === "Yes" && !attend_total) ||
                !message
              }
            >
              {isLoading ? "Mengirim..." : "Kirim Ucapan"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl font-medium font-glitten bg-white rounded-2xl px-4 py-4 border border-dashed">
          Terima Kasih <br />
          Atas Doa Baiknya 💕
        </div>
      )}
    </div>
  );
}
