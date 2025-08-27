import { login } from "@/frontend/constants/meta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: login.title,
  description: login.description,
  alternates: login.alternates,
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}