import { ChildrenProps } from "../layout";

export default function RootLayout({ children }: ChildrenProps) {
  return <div className="flex justify-center items-center min-h-screen bg-dark-1">{children}</div>;
}
