import Link from "next/link";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";

export function LegalView({
  title,
  content,
  themeVars,
}: {
  title: string;
  content: string;
  themeVars: CSSProperties;
}) {
  return (
    <div className="sk-page" style={themeVars}>
      <div className="sk-grain" aria-hidden="true" />
      <div className="sk-scan" aria-hidden="true" />
      <main className="sk-legal">
        <Link href="/" className="sk-back">
          <ArrowLeft size={14} /> Zurück
        </Link>
        <h1>{title}</h1>
        <div className="sk-md">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
