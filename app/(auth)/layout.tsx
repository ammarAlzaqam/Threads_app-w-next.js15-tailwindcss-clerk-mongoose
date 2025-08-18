import { ChildrenProps } from "../layout";

export default function RootLayout({ children }: ChildrenProps) {
  return <div className="flex justify-center mt-20 bg-dark-1">{children}</div>;
}
