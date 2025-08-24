import { ChildrenProps } from "../layout";

import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <>
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar />

        <section className="main-container">
          <div className="w-full max-w-4xl">{children}</div>
        </section>

        <RightSidebar />
      </main>
      <Bottombar />
    </>
  );
}
