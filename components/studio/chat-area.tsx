"use client"

import { useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Copy, Check, User, Sparkles } from "lucide-react"
import { useState } from "react"
import type { UIMessage } from "ai"

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

function CodeBlock({
  language,
  code,
  onPreview,
}: {
  language: string
  code: string
  onPreview?: (code: string) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPreviewable = language === "html" || language === "htm"

  return (
    <div className="group relative my-3 rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between bg-secondary/50 px-3 py-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {language || "code"}
        </span>
        <div className="flex items-center gap-1.5">
          {isPreviewable && onPreview && (
            <button
              onClick={() => onPreview(code)}
              className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Preview
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="h-3 w-3 text-chart-4" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

interface ChatAreaProps {
  messages: UIMessage[]
  status: string
  onPreviewCode: (code: string) => void
}

export function ChatArea({ messages, status, onPreviewCode }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, status])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Start a conversation
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground text-balance">
            Ask me anything - I can help with coding, writing, analysis, and more. Try asking me to build a web page!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {[
            "Build a landing page",
            "Explain React hooks",
            "Write a Python script",
            "Create a REST API",
          ].map((suggestion) => (
            <span
              key={suggestion}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl flex flex-col gap-6 p-4 pb-8">
        {messages.map((message) => {
          const text = getMessageText(message)
          const isUser = message.role === "user"

          return (
            <div key={message.id} className="flex gap-3">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isUser
                    ? "bg-secondary text-muted-foreground"
                    : "bg-primary/15 text-primary"
                }`}
              >
                {isUser ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {isUser ? "You" : "TiSu AI"}
                </p>
                {isUser ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {text}
                  </p>
                ) : (
                  <div className="prose-custom text-sm text-foreground leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "")
                          const codeString = String(children).replace(/\n$/, "")

                          if (match) {
                            return (
                              <CodeBlock
                                language={match[1]}
                                code={codeString}
                                onPreview={onPreviewCode}
                              />
                            )
                          }

                          return (
                            <code
                              className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent"
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        },
                        p({ children }) {
                          return <p className="mb-3 last:mb-0">{children}</p>
                        },
                        ul({ children }) {
                          return (
                            <ul className="mb-3 ml-4 list-disc space-y-1 last:mb-0">
                              {children}
                            </ul>
                          )
                        },
                        ol({ children }) {
                          return (
                            <ol className="mb-3 ml-4 list-decimal space-y-1 last:mb-0">
                              {children}
                            </ol>
                          )
                        },
                        h1({ children }) {
                          return (
                            <h1 className="mb-3 text-lg font-bold text-foreground">
                              {children}
                            </h1>
                          )
                        },
                        h2({ children }) {
                          return (
                            <h2 className="mb-2 text-base font-semibold text-foreground">
                              {children}
                            </h2>
                          )
                        },
                        h3({ children }) {
                          return (
                            <h3 className="mb-2 text-sm font-semibold text-foreground">
                              {children}
                            </h3>
                          )
                        },
                        a({ children, href }) {
                          return (
                            <a
                              href={href}
                              className="text-primary underline decoration-primary/30 hover:decoration-primary"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          )
                        },
                        blockquote({ children }) {
                          return (
                            <blockquote className="mb-3 border-l-2 border-primary/50 pl-4 italic text-muted-foreground">
                              {children}
                            </blockquote>
                          )
                        },
                        table({ children }) {
                          return (
                            <div className="mb-3 overflow-x-auto">
                              <table className="w-full border-collapse text-xs">
                                {children}
                              </table>
                            </div>
                          )
                        },
                        th({ children }) {
                          return (
                            <th className="border border-border bg-secondary/50 px-3 py-1.5 text-left font-medium">
                              {children}
                            </th>
                          )
                        },
                        td({ children }) {
                          return (
                            <td className="border border-border px-3 py-1.5">
                              {children}
                            </td>
                          )
                        },
                      }}
                    >
                      {text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {status === "streaming" && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-1 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
