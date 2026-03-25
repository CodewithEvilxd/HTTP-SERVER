import { BackLink } from "@/components/back-link";
import { CodeBlock } from "@/components/code-block";
import { routeDocs } from "@/lib/site";

export default function RoutesPage() {
  return (
    <div className="page-content page-doc">
      <BackLink />

      <section>
        <h1 className="doc-title">Routes</h1>
        <p className="doc-subtitle">HTTP endpoints currently exposed by the raw TCP server.</p>
      </section>

      {routeDocs.map((route) => (
        <section key={`${route.method}-${route.path}`} className="stack-sm">
          <div>
            <h2 className="doc-heading">{route.method.toLowerCase()} {route.path}</h2>
            <p className="doc-subtitle">{route.description}</p>
          </div>
          <CodeBlock code={route.example} language="bash" />
        </section>
      ))}
    </div>
  );
}
