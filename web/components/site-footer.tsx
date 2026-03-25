import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{siteConfig.owner.portfolio.replace("https://", "")}</p>
      <div>
        <a href={siteConfig.owner.portfolio} target="_blank" rel="noopener noreferrer">
          portfolio
        </a>
        <span>/</span>
        <a href={siteConfig.owner.github} target="_blank" rel="noopener noreferrer">
          github
        </a>
        <span>/</span>
        <a href={`mailto:${siteConfig.owner.email}`}>{siteConfig.owner.email}</a>
      </div>
    </footer>
  );
}
