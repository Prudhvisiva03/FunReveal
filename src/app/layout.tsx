import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: { default: "FunReveal – Discover. Calculate. Unlock.", template: "%s | FunReveal" },
  description: "Fun entertainment tools: Love Calculator, Friendship Calculator, Future Partner Generator, Lucky Number & more. 1st result 100% free, then just ₹1.",
  keywords: ["love calculator", "friendship calculator", "future partner generator", "marriage compatibility", "lucky number generator", "best friend test", "fun tools"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-16 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
