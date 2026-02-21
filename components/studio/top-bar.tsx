"use client"

import {
  Settings2,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TopBarProps {
  model: string
  onModelChange: (model: string) => void
  temperature: number
  onTemperatureChange: (temp: number) => void
  maxTokens: number
  onMaxTokensChange: (tokens: number) => void
  showSettings: boolean
  onToggleSettings: () => void
}

const MODELS = [
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast & efficient" },
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite", description: "Lightweight" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Previous gen fast" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Advanced reasoning" },
]

export function TopBar({
  model,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  showSettings,
  onToggleSettings,
}: TopBarProps) {
  const currentModel = MODELS.find((m) => m.id === model) || MODELS[0]

  return (
    <div className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
      {/* Model selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="appearance-none bg-transparent text-sm font-medium text-foreground focus:outline-none cursor-pointer pr-4"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-card text-foreground">
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {currentModel.description}
        </span>
      </div>

      {/* Settings toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSettings}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            showSettings
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Settings2 className="h-3.5 w-3.5" />
          Settings
        </button>
      </div>

      {/* Settings panel (dropdown) */}
      {showSettings && (
        <div className="absolute right-4 top-[3.5rem] z-50 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
          <h3 className="text-sm font-medium text-foreground mb-4">Model Settings</h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Temperature</label>
                <span className="text-xs font-mono text-foreground">{temperature.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                className="h-1.5 w-full appearance-none rounded-full bg-secondary accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Max Output Tokens</label>
                <span className="text-xs font-mono text-foreground">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={maxTokens}
                onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
                className="h-1.5 w-full appearance-none rounded-full bg-secondary accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>256</span>
                <span>8192</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
