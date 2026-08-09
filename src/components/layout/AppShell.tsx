"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const menu = [
  {
    icon: "⌂",
    label: "Dashboard",
    href: "/",
  },
  {
    icon: "✦",
    label: "Criar produto",
    href: "/projects/new",
  },
  {
    icon: "▣",
    label: "Meus projetos",
    href: "/projects",
  },
  {
    icon: "◫",
    label: "Editor",
    href: "/editor",
  },
  {
    icon: "◇",
    label: "Biblioteca",
    href: "/library",
  },
  {
    icon: "⇩",
    label: "Exportações",
    href: "/exports",
  },
];

function isActive(
  pathname: string,
  href: string
) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function AppShell({
  children,
  title,
  eyebrow = "AI PRODUCT STUDIO",
}: {
  children: ReactNode;
  title: string;
  eyebrow?: string;
}) {
  const pathname = usePathname();

  return (
    <main className="shell">

      <aside className="sidebar">

        <Link
          href="/"
          className="brand"
        >
          <div className="brandMark">
            L
          </div>

          <div>
            <strong>LATAM</strong>
            <span>INFO FACTORY</span>
          </div>
        </Link>

        <div className="workspaceLabel">
          WORKSPACE
        </div>

        <nav className="nav">

          {menu.map((item) => (

            <Link
              href={item.href}
              key={item.href}
              className={
                isActive(
                  pathname,
                  item.href
                )
                  ? "navItem active"
                  : "navItem"
              }
            >
              <span className="navIcon">
                {item.icon}
              </span>

              {item.label}
            </Link>

          ))}

        </nav>

        <div className="sidebarBottom">

          <div className="systemTitle">
            SYSTEM
          </div>

          <div className="systemCard">

            <div>
              <i className="online" />
              Cloud Engine
              <b>ONLINE</b>
            </div>

            <div>
              <i className="online" />
              Editorial Engine
              <b>READY</b>
            </div>

            <div>
              <i className="purple" />
              V4 Personal
              <b>DEV</b>
            </div>

          </div>

          <Link
            href="/settings"
            className="settings"
          >
            ⚙ Configurações
          </Link>

          <small>
            LATAM INFO FACTORY • V4.2
          </small>

        </div>

      </aside>


      <section className="content">

        <header className="topbar">

          <div>
            <div className="eyebrow">
              {eyebrow}
            </div>

            <h1>
              {title}
            </h1>
          </div>

          <div className="topActions">

            <div className="status">
              <span />
              Sistema operacional
            </div>

            <button className="avatar">
              JS
            </button>

          </div>

        </header>

        {children}

      </section>

    </main>
  );
}
