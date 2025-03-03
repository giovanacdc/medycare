import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils'

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: "MedyCare",
  description: "Sistema de agendamento de consultas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={cn('min-h-screen font-sans antialiased', fontSans.variable)}
      >
        {children}
      </body>
    </html>
  );
}
