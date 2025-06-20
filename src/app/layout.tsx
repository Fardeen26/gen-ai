import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage_grotesque_init = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Credit Buddy",
  description: "Developed by Fardeen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage_grotesque_init.className} bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
