import { notFound } from "next/navigation";
import { DocsPageShell } from "@/components/docs-page-shell";
import { documentationPages, getDocumentationPage } from "@/lib/docs";

export function generateStaticParams() {
  return documentationPages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function DocumentationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getDocumentationPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <DocsPageShell
      title={page.title}
      summary={page.summary}
      sections={page.sections}
      snippets={page.snippets}
      currentPath={`/documentation/${page.slug}`}
    />
  );
}
