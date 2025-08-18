import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
export interface ChildrenProps {
  readonly children: React.ReactNode;
}

export const metadata = {
  title: "Threads",
  description: "A Next.js 15 Meta Threads Application",
};

export const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
