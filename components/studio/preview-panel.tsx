"use client"

import { useState, useRef, useEffect } from "react"
import {
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  Check,
  Code2,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PreviewPanelProps {
  code: string | null
  onClose: () => void
}

type ViewMode = "preview" | "code"
type DeviceMode = "desktop" | "tablet" | "mobile"

export function PreviewPanel({ code, onClose }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code || ""
    }
  }

  const deviceWidths: Record<DeviceMode, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  }

  if (!code) return null

  return (
    <div
      className={cn(
        "flex flex-col border-l border-border bg-card",
        isFullscreen
          ? "fixed inset-0 z-50"
          : "w-full lg:w-[45%] xl:w-[50%]"
      )}
    >
      {/* Preview header */}
      <div className="flex h-10 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
              viewMode === "preview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
              viewMode === "code"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-3 w-3" />
            Code
          </button>
        </div>

        <div className="flex items-center gap-1">
          {viewMode === "preview" && (
            <>
              <button
                onClick={() => setDeviceMode("desktop")}
                className={cn(
                  "rounded p-1 transition-colors",
                  deviceMode === "desktop"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Desktop view"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode("tablet")}
                className={cn(
                  "rounded p-1 transition-colors",
                  deviceMode === "tablet"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Tablet view"
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={cn(
                  "rounded p-1 transition-colors",
                  deviceMode === "mobile"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Mobile view"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
              <div className="mx-1 h-4 w-px bg-border" />
              <button
                onClick={handleRefresh}
                className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Refresh preview"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          {viewMode === "code" && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="h-3 w-3 text-chart-4" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
          <div className="mx-1 h-4 w-px bg-border" />
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close preview"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-hidden bg-background p-2">
        {viewMode === "preview" ? (
          <div className="flex h-full items-start justify-center overflow-auto">
            <iframe
              ref={iframeRef}
              srcDoc={code}
              title="Preview"
              sandbox="allow-scripts allow-modals"
              className="h-full rounded-lg border border-border bg-white transition-all"
              style={{ width: deviceWidths[deviceMode], maxWidth: "100%" }}
            />
          </div>
        ) : (
          <div className="h-full overflow-auto rounded-lg border border-border bg-background">
            <pre className="p-4 text-xs leading-relaxed">
              <code className="text-foreground">{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
