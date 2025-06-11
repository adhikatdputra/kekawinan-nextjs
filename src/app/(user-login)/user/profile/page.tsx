"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import profileApi from "@/frontend/api/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/frontend/composable/useAuth";

export default function ProfilePage() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { setUserName } = useAuth();

  const {
    data: user,
    refetch: refetchUser,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => profileApi.getUser(),
    select: (data) => data.data.data,
  });

  const { mutate: updateUser, isPending: isPendingUpdate } = useMutation({
    mutationFn: (body: { fullname: string; phone: string }) =>
      profileApi.updateUser(body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Perubahan berhasil disimpan");
        refetchUser();
      } else {
        toast.error(response.message);
      }
    },
  });

  const handleSubmit = () => {
    updateUser({ fullname, phone });
  };

  useEffect(() => {
    if (user) {
      setUserName(user.fullname);
      setFullname(user.fullname);
      setPhone(user.phone);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <>
      <div className="bg-[url('/images/bg-main.jpg')] bg-cover bg-center h-[300px] flex items-end">
        <div className="container py-8 md:py-12">
          <h1 className="text-black text-3xl md:text-5xl font-bold">Profile</h1>
        </div>
      </div>
      <div className="py-12 md:py-24 max-w-[600px] mx-auto">
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="email">Email (Tidak bisa diubah)</Label>
            <Input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              disabled
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="fullname">Nama Lengkap</Label>
            <Input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-6">
            <Button
              disabled={isPendingUpdate || isLoading || !fullname || !phone}
              onClick={handleSubmit}
            >
              {isPendingUpdate ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Please wait...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
