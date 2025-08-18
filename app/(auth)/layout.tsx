import type { Metadata } from "next";
import "../globals.css";
import { ChildrenProps } from "../(root)/layout";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 15 Meta Threads Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: ChildrenProps) {
  return (
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>{children}</body>
      </html>
  );
}
