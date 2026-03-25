import { BackLink } from "@/components/back-link";
import { CodeBlock } from "@/components/code-block";
import { verificationChecks } from "@/lib/site";

const verifyExample = `bun test
bun x tsc --noEmit
curl http://127.0.0.1:8080/health
curl -X POST http://127.0.0.1:8080/echo -H "Content-Type: text/plain" -d "hello from verification"`;

export default function VerifyPage() {
  return (
    <div className="page-content page-doc">
      <BackLink />

      <section>
        <h1 className="doc-title">Verification</h1>
        <p className="doc-subtitle">Checks used to confirm the TCP server and website are working.</p>
      </section>

      <section className="stack-sm">
        <CodeBlock code={verifyExample} language="bash" />
      </section>

      <section className="panel-surface">
        <ul className="info-list">
          {verificationChecks.map((item) => (
            <li key={item.name}>
              <code>{item.name}</code>
              <span>{item.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
