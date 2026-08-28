import type { Metadata } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { AuthRedirectGuard } from "@/components/AuthRedirectGuard";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "तोरणद्वार ItraWala — Traditional Attars, Oudh & Bakhoor",
  description:
    "Shop pure attars, oudh, eau de parfum, bakhoor and gift sets from ItraWala — traditional Indian perfumery, delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <AuthRedirectGuard />
        <Navbar />
        <main className="min-h-[60vh]">{children}</main>
        <Footer adminEmail={adminEmail} />
        <ChatBot adminEmail={adminEmail} />
      </body>
    </html>
  );
}
