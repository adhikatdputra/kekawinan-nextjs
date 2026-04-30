import { resetPassword } from "@/frontend/constants/meta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: resetPassword.title,
  description: resetPassword.description,
  alternates: resetPassword.alternates,
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
