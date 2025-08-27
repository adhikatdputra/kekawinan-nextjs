import { register } from "@/frontend/constants/meta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: register.title,
  description: register.description,
  alternates: register.alternates,
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}