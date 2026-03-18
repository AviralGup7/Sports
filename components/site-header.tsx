"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/announcements", label: "Announcements" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Go to tournament home">
        <span className="brand-mark">IASL</span>
        <span className="brand-copy">
          <strong>Inter Assoc Sports League</strong>
          <span>One portal for public viewers and organizers</span>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Primary">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? "nav-link nav-link-active" : "nav-link"}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
