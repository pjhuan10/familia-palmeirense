import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Família Palmerense",
  description: "Controle de empréstimos da família",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#f7fbf7] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
