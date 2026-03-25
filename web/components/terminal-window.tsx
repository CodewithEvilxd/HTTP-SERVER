import { CopyButton } from "@/components/copy-button";
import { terminalLines } from "@/lib/site";

export function TerminalWindow() {
  const terminalText = terminalLines.join("\n");

  return (
    <section className="code-surface">
      <div className="surface-bar">
        <span>example</span>
      </div>
      <div className="terminal-content code-content-with-copy">
        <CopyButton text={terminalText} className="copy-button-overlay" />
        {terminalLines.map((line, index) => {
          const isCommand = line.startsWith("$");
          return (
            <div key={`${line}-${index}`} className={isCommand ? "terminal-command" : "terminal-output"}>
              {isCommand ? (
                <>
                  <span className="prompt">$</span>
                  <span>{line.slice(2)}</span>
                </>
              ) : (
                line
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
