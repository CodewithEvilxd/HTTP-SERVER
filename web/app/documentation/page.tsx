import Link from "next/link";
import { DocsPageShell } from "@/components/docs-page-shell";
import { documentationCards, documentationLanding } from "@/lib/docs";

export default function DocumentationLandingPage() {
  return (
    <DocsPageShell
      title={documentationLanding.title}
      summary={documentationLanding.summary}
      sections={documentationLanding.sections}
      snippets={documentationLanding.snippets}
      currentPath="/documentation"
    >
      <section className="docs-card-grid reveal-block">
        {documentationCards.map((page, index) => (
          <Link
            key={page.slug}
            href={`/documentation/${page.slug}`}
            className="docs-entry-card"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="docs-entry-kicker">{page.label}</p>
            <h2>{page.title}</h2>
            <p>{page.summary}</p>
          </Link>
        ))}
      </section>
    </DocsPageShell>
  );
}
