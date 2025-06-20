import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/navbar/Navbar";
import BottomNavbar from "@/components/navbar/BottomNavbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Brand",
  description: "A Jewellery eCommerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <QueryProvider>
          <Navbar />
          <main className="pt-15">
            {children}
            <Toaster position="top-center" />
          </main>
          <Footer />
          <BottomNavbar />
        </QueryProvider>
      </body>
    </html>
  );
}
