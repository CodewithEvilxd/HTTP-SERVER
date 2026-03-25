import { CodeBlock } from "@/components/code-block";
import { TerminalWindow } from "@/components/terminal-window";
import { documentationCards } from "@/lib/docs";
import { commandBlock, features, installCommand, usageBlock } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="page-content">
      <section className="intro-section">
        <div className="stack-lg">
          <h1 className="hero-title">Nishant Raw HTTP Server.</h1>
          <p className="hero-subtitle">
            low-level HTTP/1.1 parsing on raw TCP sockets with Bun, written to stay small, explicit, and easy to verify.
          </p>
          <CodeBlock code={installCommand} language="bash" />
          <TerminalWindow />
        </div>
      </section>

      <section className="feature-grid">
        {features.map((feature) => (
          <article key={feature.title} className="panel-card">
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <section className="stack-sm">
        <div>
          <h2 className="doc-heading">Documentation</h2>
          <p className="doc-subtitle">
            The website now has a dedicated documentation page that explains the server in engineering terms instead of
            vague product copy.
          </p>
        </div>
        <div className="feature-grid">
          {documentationCards.slice(0, 4).map((item) => (
            <article key={item.slug} className="panel-card">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
        <a href="/documentation" className="inline-link">
          Read full documentation
        </a>
      </section>

      <CodeBlock title="usage" code={usageBlock} language="bash" />
      <CodeBlock title="commands" code={commandBlock} language="bash" />
    </div>
  );
}
