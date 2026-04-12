"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 flex-row">
        {!isHome && !isAuthPage && <Sidebar />}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

