import Link from "next/link";

export function BackLink({ href = "/", text = "home" }: { href?: string; text?: string }) {
  return (
    <Link href={href} className="back-link">
      <span aria-hidden="true">←</span>
      {text}
    </Link>
  );
}
