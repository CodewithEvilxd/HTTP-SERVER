import { BackLink } from "@/components/back-link";
import { CodeBlock } from "@/components/code-block";
import { securityNotes } from "@/lib/site";

const securityHeaders = `Production Content-Security-Policy
script-src 'self' 'unsafe-inline'
connect-src 'self'

Development Content-Security-Policy
script-src 'self' 'unsafe-inline' 'unsafe-eval'
connect-src 'self' ws: wss:

Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin`;

export default function SecurityPage() {
  return (
    <div className="page-content page-doc">
      <BackLink />

      <section>
        <h1 className="doc-title">Security</h1>
        <p className="doc-subtitle">What makes this website and project presentation safer by default.</p>
      </section>

      <section className="grid-doc">
        <div className="panel-surface">
          <h2 className="small-title">Included</h2>
          <ul className="status-list">
            {securityNotes.map((item) => (
              <li key={item}>
                <span className="status-positive">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel-surface">
          <h2 className="small-title">Not Included</h2>
          <ul className="status-list">
            {[
              "Third-party analytics scripts",
              "Remote font dependencies",
              "Ad networks or embeds",
              "User-submitted HTML rendering",
            ].map((item) => (
              <li key={item}>
                <span className="status-negative">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="stack-sm">
        <h2 className="doc-heading">Deployment Headers</h2>
        <CodeBlock code={securityHeaders} language="text" />
      </section>
    </div>
  );
}
