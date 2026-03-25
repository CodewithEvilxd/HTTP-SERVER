export default function DocumentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="docs-stage">
      <div className="docs-ambient" aria-hidden="true">
        <span className="docs-orb docs-orb-primary" />
        <span className="docs-orb docs-orb-secondary" />
        <span className="docs-grid-drift" />
      </div>
      {children}
    </div>
  );
}
