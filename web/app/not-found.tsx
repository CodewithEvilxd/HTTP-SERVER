import Link from "next/link";
import { BackLink } from "@/components/back-link";

export default function NotFound() {
  return (
    <div className="page-content page-doc">
      <BackLink />
      <section className="error-surface">
        <h1 className="doc-title error-title">Something went wrong</h1>
        <p className="doc-subtitle">This route does not exist in the website.</p>
        <Link href="/" className="inline-link">
          Go Home
        </Link>
      </section>
    </div>
  );
}
