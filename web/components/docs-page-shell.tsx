import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { CodeBlock } from "@/components/code-block";
import type { DocumentationSection, DocumentationSnippet } from "@/lib/docs";
import { documentationCards } from "@/lib/docs";

interface DocsPageShellProps {
  title: string;
  summary: string;
  sections: DocumentationSection[];
  snippets: DocumentationSnippet[];
  currentPath: string;
  children?: React.ReactNode;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href;
}

export function DocsPageShell({
  title,
  summary,
  sections,
  snippets,
  currentPath,
  children,
}: DocsPageShellProps) {
  return (
    <div className="page-content page-docs">
      <BackLink />
      <div className="docs-shell">
        <aside className="docs-column docs-column-left">
          <div className="docs-sticky">
            <div className="docs-sidebar-card">
              <p className="docs-eyebrow">documentation</p>
              <nav className="docs-page-nav" aria-label="Documentation pages">
                <Link
                  href="/documentation"
                  className={`docs-page-link${isActive(currentPath, "/documentation") ? " is-active" : ""}`}
                >
                  overview
                </Link>
                {documentationCards.map((page) => {
                  const href = `/documentation/${page.slug}`;
                  return (
                    <Link
                      key={page.slug}
                      href={href}
                      className={`docs-page-link${isActive(currentPath, href) ? " is-active" : ""}`}
                    >
                      {page.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {sections.length > 0 ? (
              <div className="docs-sidebar-card">
                <p className="docs-eyebrow">on this page</p>
                <nav className="docs-anchor-nav" aria-label="Section links">
                  {sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`} className="docs-anchor-link">
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="docs-main">
          <section className="docs-hero reveal-block">
            <p className="docs-eyebrow">engineering notes</p>
            <h1 className="docs-hero-title">{title}</h1>
            <p className="docs-hero-summary">{summary}</p>
          </section>

          {children}

          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="doc-section-card reveal-block"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="doc-section-meta">{String(index + 1).padStart(2, "0")}</div>
              <div className="doc-section-body">
                <h2 className="doc-section-title">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="doc-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="docs-column docs-column-right">
          <div className="docs-sticky">
            {snippets.map((snippet, index) => (
              <div
                key={`${snippet.title}-${index}`}
                className="docs-rail-card reveal-block"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <CodeBlock title={snippet.title} code={snippet.code} language={snippet.language} compact />
                {snippet.note ? <p className="docs-rail-note">{snippet.note}</p> : null}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
