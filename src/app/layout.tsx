// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";

export const metadata = {
  title: "Quantum Alpha | Terminal",
  description: "Advanced Portfolio Analytics",
};

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 'dark' is essentieel voor Shadcn/UI componenten op een zwarte achtergrond
    <html lang="en" className={`${inter.variable} dark`} style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} antialiased bg-[#020617] text-slate-200 min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}