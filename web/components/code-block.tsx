import { CopyButton } from "@/components/copy-button";

export type SupportedLanguage = "bash" | "http" | "json" | "ts" | "text";

type TokenKind =
  | "plain"
  | "comment"
  | "keyword"
  | "string"
  | "number"
  | "flag"
  | "property"
  | "type"
  | "method"
  | "path"
  | "prompt"
  | "operator";

function classifyToken(token: string, language: SupportedLanguage, index: number, allTokens: string[]): TokenKind {
  if (token.trim() === "") {
    return "plain";
  }

  if (language === "bash" || language === "text") {
    if (token.startsWith("#")) return "comment";
    if (token === "$") return "prompt";
    if (/^--?[a-zA-Z0-9:-]+$/.test(token)) return "flag";
    if (/^["'].*["']$/.test(token)) return "string";
    if (/^(bun|curl|export|cat|echo|POST|GET|HTTP\/1\.1)$/.test(token)) return "keyword";
    if (/^\d+$/.test(token)) return "number";
  }

  if (language === "http") {
    if (/^(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)$/.test(token)) return "method";
    if (index === 1 && token.startsWith("/")) return "path";
    if (token.endsWith(":")) return "property";
    if (/^HTTP\/1\.1$/.test(token)) return "keyword";
    if (/^\d+$/.test(token)) return "number";
  }

  if (language === "json") {
    if (/^["'].*["']$/.test(token)) {
      const nextMeaningful = allTokens.slice(index + 1).find((candidate) => candidate.trim() !== "");
      return nextMeaningful === ":" ? "property" : "string";
    }
    if (/^\d+$/.test(token)) return "number";
    if (/^[{}[\],:]$/.test(token)) return "operator";
  }

  if (language === "ts") {
    if (/^(const|if|return|throw|import|export|function)$/.test(token)) return "keyword";
    if (/^["'].*["']$/.test(token)) return "string";
    if (/^(Bun|Uint8Array|Record|Error|SocketState)$/.test(token)) return "type";
    if (/^\d+$/.test(token)) return "number";
  }

  return "plain";
}

function tokenizeLine(line: string, language: SupportedLanguage): { value: string; kind: TokenKind }[] {
  if (line.length === 0) {
    return [{ value: " ", kind: "plain" }];
  }

  const regex =
    /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\$)|(--?[a-zA-Z0-9:-]+)|(\b[A-Za-z_][A-Za-z0-9._/-]*\b)|(\d+)|([{}[\],:()<>])|(\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=-]*)|(\s+)|(\S+)/g;
  const rawTokens = Array.from(line.matchAll(regex), (match) => match[0] ?? "");
  return rawTokens.map((token, index) => ({
    value: token,
    kind: classifyToken(token, language, index, rawTokens),
  }));
}

export function CodeBlock({
  title,
  code,
  language = "bash",
  compact = false,
}: {
  title?: string;
  code: string;
  language?: SupportedLanguage;
  compact?: boolean;
}) {
  const lines = code.replace(/\r/g, "").split("\n");

  return (
    <section className={`code-surface${compact ? " code-surface-compact" : ""}`}>
      {title ? (
        <div className="surface-bar">
          <span>{title}</span>
        </div>
      ) : (
        <div className="surface-bar surface-bar-minimal">
          <span>snippet</span>
        </div>
      )}
      <div className="code-content code-content-with-copy" role="presentation">
        <CopyButton text={code} className="copy-button-overlay" />
        {lines.map((line, index) => (
          <div key={`${title ?? "code"}-${index}`} className="code-row">
            <span className="code-line-number">{String(index + 1).padStart(2, "0")}</span>
            <code className="code-line">
              {tokenizeLine(line, language).map((token, tokenIndex) => (
                <span key={`${index}-${tokenIndex}`} className={`token token-${token.kind}`}>
                  {token.value}
                </span>
              ))}
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}
