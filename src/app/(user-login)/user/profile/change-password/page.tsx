"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import profileApi from "@/frontend/api/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function ProfilePage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: updateUser, isPending: isPendingUpdate } = useMutation({
    mutationFn: (body: { old_password: string; new_password: string }) =>
      profileApi.updatePassword(body),
    onSuccess: (data) => {
      const response = data.data;
      if (response.success) {
        toast.success("Password berhasil diubah");
        setTimeout(() => {
          router.push("/user/profile");
        }, 2000);
      } else {
        toast.error(response.message);
      }
    },
  });

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = () => {
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password harus mengandung setidaknya 8 karakter, satu huruf besar, satu huruf kecil, satu angka, dan satu simbol"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi password tidak sama");
      return;
    }

    updateUser({ old_password: oldPassword, new_password: newPassword });
  };

  return (
    <>
      <div className="bg-[url('/images/bg-main.jpg')] bg-cover bg-center h-[300px] flex items-end">
        <div className="container py-8 md:py-12">
          <h1 className="text-black text-3xl md:text-5xl font-bold">
            Ubah Password
          </h1>
        </div>
      </div>
      <div className="py-12 md:py-24 max-w-[600px] mx-auto">
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="email">Password Lama</Label>
            <div className="relative">
              <Input
                type={showOldPassword ? "text" : "password"}
                placeholder="Masukkan password lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border-green-kwn h-12 rounded-full px-4 bg-white"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                {showOldPassword ? (
                  <IconEyeOff
                    size={20}
                    onClick={() => setShowOldPassword(false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <IconEye
                    size={20}
                    onClick={() => setShowOldPassword(true)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="fullname">Password Baru</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-green-kwn h-12 rounded-full px-4 bg-white"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                {showPassword ? (
                  <IconEyeOff
                    size={20}
                    onClick={() => setShowPassword(false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <IconEye
                    size={20}
                    onClick={() => setShowPassword(true)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="phone">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-green-kwn h-12 rounded-full px-4 bg-white"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                {showConfirmPassword ? (
                  <IconEyeOff
                    size={20}
                    onClick={() => setShowConfirmPassword(false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <IconEye
                    size={20}
                    onClick={() => setShowConfirmPassword(true)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
            <div>
              <Button
                disabled={
                  isPendingUpdate ||
                  !oldPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                onClick={handleSubmit}
              >
                {isPendingUpdate ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Please wait...
                  </>
                ) : (
                  "Ubah Password"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
