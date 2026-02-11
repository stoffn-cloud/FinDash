// src/app/layout.tsx
import "./globals.css";
import Providers from "@/components/Providers"; // De wrapper die we net maakten

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}