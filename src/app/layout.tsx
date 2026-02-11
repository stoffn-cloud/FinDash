// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google"; // De moderne manier voor fonts
import Providers from "@/components/Providers";

// 1. Hier komt je titel en meta-data (vervangt <title>)
export const metadata = {
  title: "Quantum Alpha | Terminal",
  description: "Advanced Portfolio Analytics",
};

// 2. Configureer het Inter font
const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter", // Zo kun je het in CSS gebruiken
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-[#020617]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}