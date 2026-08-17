import ReactMarkdown, { type Components } from 'react-markdown';

// react-markdown does not parse raw HTML from the source by default (no rehype-raw),
// so this is already safe against injected markup. We additionally strip link
// navigation and images per the AI Coach UI handoff's safety rules.
const components: Components = {
    a: ({ children }) => <span className="underline decoration-dotted">{children}</span>,
    img: () => null,
    p: ({ children }) => <p className="text-sm text-surface-600 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="text-sm text-surface-600 leading-relaxed list-disc pl-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="text-sm text-surface-600 leading-relaxed list-decimal pl-4 space-y-1">{children}</ol>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    h1: ({ children }) => <p className="text-sm font-bold text-foreground">{children}</p>,
    h2: ({ children }) => <p className="text-sm font-bold text-foreground">{children}</p>,
    h3: ({ children }) => <p className="text-sm font-bold text-foreground">{children}</p>,
};

export function CoachMarkdown({ children, className }: { children: string; className?: string }) {
    return (
        <div className={className}>
            <ReactMarkdown components={components}>{children}</ReactMarkdown>
        </div>
    );
}
