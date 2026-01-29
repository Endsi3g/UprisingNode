import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

const sfPro = localFont({
  src: [
    {
      path: "../../public/fonts/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

const agmena = localFont({
  src: "./../../public/fonts/Agmena-Pro-SemiBold.ttf",
  variable: "--font-serif",
  weight: "600",
});

export const metadata: Metadata = {
  title: "Uprising Node - Partner Portal",
  description: "B2B Partner Command Center for Scale and Performance",
  keywords: ["B2B", "Partner Portal", "Lead Management", "Commission Tracking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${agmena.variable} ${sfPro.variable} bg-white min-h-screen font-sans text-text-main overflow-x-hidden antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
