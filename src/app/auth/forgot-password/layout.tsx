import { forgotPassword } from "@/frontend/constants/meta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: forgotPassword.title,
  description: forgotPassword.description,
  alternates: forgotPassword.alternates,
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
