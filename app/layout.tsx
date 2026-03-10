import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Família Palmeirense",
  description: "Controle de empréstimos da família",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="relative min-h-screen overflow-x-hidden text-slate-900 antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-120px] top-[90px] h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
          <div className="absolute right-[-80px] top-[140px] h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute bottom-[80px] left-[12%] h-52 w-52 rounded-full bg-lime-100/40 blur-3xl" />
          <div className="absolute bottom-[-40px] right-[15%] h-72 w-72 rounded-full bg-green-100/40 blur-3xl" />
        </div>

        {children}
      </body>
    </html>
  );
}
