import { BackLink } from "@/components/back-link";
import { CodeBlock } from "@/components/code-block";
import { configExample, runtimeConfig, scriptDocs } from "@/lib/site";

export default function ConfigurationPage() {
  return (
    <div className="page-content page-doc">
      <BackLink />

      <section>
        <h1 className="doc-title">Configuration</h1>
        <p className="doc-subtitle">Runtime variables and website scripts for this project.</p>
      </section>

      <section className="stack-sm">
        <h2 className="doc-heading">Environment Variables</h2>
        <div className="panel-surface">
          <ul className="info-list">
            {runtimeConfig.map((item) => (
              <li key={item.key}>
                <code>{item.key}</code>
                <span>{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="stack-sm">
        <h2 className="doc-heading">Web Scripts</h2>
        <div className="panel-surface">
          <ul className="info-list">
            {scriptDocs.map((item) => (
              <li key={item.name}>
                <code>{item.name}</code>
                <span>{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="stack-sm">
        <h2 className="doc-heading">Config Shape</h2>
        <CodeBlock code={configExample} language="json" />
      </section>
    </div>
  );
}
