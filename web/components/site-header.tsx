import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <a href={siteConfig.owner.github} target="_blank" rel="noopener noreferrer">
          github
        </a>
      </nav>
    </header>
  );
}
