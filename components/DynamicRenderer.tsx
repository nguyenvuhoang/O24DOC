'use client'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Callout, FileTree } from 'nextra/components'

interface DynamicRendererProps {
    content: string
    title: string
    category?: string
    description?: string
}

export function DynamicRenderer({ content, title, category, description }: DynamicRendererProps) {
    // Pre-process content to convert JSX-style style objects to standard HTML style strings
    // Example: style={{ border: "1px solid red", width: "100%" }} -> style="border: 1px solid red; width: 100%"
    const processedContent = React.useMemo(() => {
        return content.replace(/style=\{\{([^}]+)\}\}/g, (match, styleBody) => {
            try {
                // Robustly split by comma only at the top level (ignoring commas inside parentheses or quotes)
                const segments: string[] = [];
                let current = '';
                let depth = 0;
                let quote: string | null = null;

                for (let i = 0; i < styleBody.length; i++) {
                    const char = styleBody[i];
                    if (char === '"' || char === "'") {
                        if (!quote) quote = char;
                        else if (quote === char) quote = null;
                    }
                    if (!quote) {
                        if (char === '(') depth++;
                        else if (char === ')') depth--;
                    }

                    if (char === ',' && depth === 0 && !quote) {
                        segments.push(current);
                        current = '';
                    } else {
                        current += char;
                    }
                }
                segments.push(current);

                const css = segments
                    .map((pair: string) => {
                        const colonIndex = pair.indexOf(':');
                        if (colonIndex === -1) return '';

                        const key = pair.slice(0, colonIndex).trim();
                        let value = pair.slice(colonIndex + 1).trim();

                        const k = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(); // camelCase to kebab-case
                        // Remove surrounding quotes if present
                        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.slice(1, -1);
                        }
                        return `${k}: ${value}`;
                    })
                    .filter(Boolean)
                    .join('; ');

                return `style="${css}"`;
            } catch (e) {
                console.error('Failed to parse style object:', styleBody);
                return match;
            }
        });
    }, [content]);

    // Check if content already starts with an H1
    const hasH1 = content.trim().startsWith('# ') || content.trim().match(/^#\s/m);

    return (
        <div className="dynamic-doc-container">
            {!hasH1 && (
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {title}
                </h1>
            )}

            {description && (
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-medium leading-7">
                    {description}
                </p>
            )}

            <div className="mt-8 prose prose-slate dark:prose-invert max-w-none dynamic-markdown-content text-slate-800 dark:text-slate-200">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        // @ts-ignore
                        callout: ({ node, ...props }) => <Callout {...props} />,
                        // @ts-ignore
                        filetree: ({ node, ...props }) => <FileTree {...props} />,
                        // @ts-ignore
                        'filetree.folder': ({ node, ...props }) => <FileTree.Folder {...props} />,
                        // @ts-ignore
                        'filetree.file': ({ node, ...props }) => <FileTree.File {...props} />,
                    }}
                >
                    {processedContent}
                </ReactMarkdown>
            </div>

            <style jsx global>{`
        .dynamic-markdown-content h1 { font-size: 2.25rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.5rem; color: var(--tw-prose-headings); }
        .dynamic-markdown-content h2 { font-size: 1.5rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; color: var(--tw-prose-headings); }
        .dark .dynamic-markdown-content h2 { border-color: #334155; }
        .dynamic-markdown-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; color: var(--tw-prose-headings); }
        .dynamic-markdown-content p { margin-top: 1.25rem; margin-bottom: 1.25rem; line-height: 1.75; }
        .dynamic-markdown-content ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 1.25rem; margin-bottom: 1.25rem; }
        .dynamic-markdown-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 1.25rem; margin-bottom: 1.25rem; }
        .dynamic-markdown-content li { margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .dynamic-markdown-content code:not(pre code) { background-color: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .dark .dynamic-markdown-content code:not(pre code) { background-color: rgba(30, 41, 59, 0.5); border-color: #334155; color: #cbd5e1; }
        .dynamic-markdown-content pre { background-color: #1e293b; color: #f8fafc; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.5rem 0; border: 1px solid #334155; }
        .dynamic-markdown-content pre code { background-color: transparent; border: none; padding: 0; color: inherit; font-size: 0.875rem; }
        .dynamic-markdown-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem; }
        .dynamic-markdown-content th, .dynamic-markdown-content td { border: 1px solid #e2e8f0; padding: 0.75rem 1rem; text-align: left; }
        .dark .dynamic-markdown-content th, .dark .dynamic-markdown-content td { border-color: #334155; }
        .dynamic-markdown-content th { background-color: #f8fafc; font-weight: 600; color: #1e293b; }
        .dark .dynamic-markdown-content th { background-color: #0f172a; color: #f1f5f9; }
        .dynamic-markdown-content a { color: #4f46e5; text-decoration: underline; font-weight: 500; }
        .dark .dynamic-markdown-content a { color: #818cf8; }
        .dynamic-markdown-content blockquote { border-left: 4px solid #e2e8f0; padding-left: 1rem; italic; color: #64748b; margin: 1.5rem 0; }
        .dark .dynamic-markdown-content blockquote { border-color: #334155; color: #94a3b8; }
      `}</style>
        </div>
    )
}
