import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 15 Meta Threads Application",
};

export interface ChildrenProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  );
}
