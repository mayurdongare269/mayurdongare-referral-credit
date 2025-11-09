import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReferralHub - Earn Credits by Referring Friends",
  description: "Online course platform with referral rewards system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50">
          <Navbar />
          <main className="pb-20 md:pb-0">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}