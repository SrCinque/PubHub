"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { handlerLogout } from "@/app/actions/handlerLogout";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Perfil",
      href: "/perfil",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      name: "Plataformas",
      href: "/plataformas",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <line x1="3" x2="21" y1="9" y2="9" />
          <line x1="9" x2="9" y1="21" y2="9" />
        </svg>
      ),
    },
    {
      name: "Posts",
      href: "/posts",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-[var(--bg-dark)] border-r border-[var(--border-green)] min-h-[calc(100vh-4rem)] flex flex-col transition-all duration-300">
      <div className="flex-1 py-8 px-6 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-[var(--primary-green)] text-[var(--text-dark)] shadow-lg shadow-[var(--primary-green)]/20"
                  : "text-[var(--text-muted)] hover:bg-[var(--primary-green)]/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isActive ? "rotate-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[var(--border-green)]/50">
        <button
          onClick={() => {
            if (confirm("Tem certeza que deseja sair?")) {
              handlerLogout();
            }
          }}
          className="flex items-center gap-3 w-full p-3 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
