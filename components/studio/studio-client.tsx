"use client"

import { useState, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { StudioSidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { ChatArea } from "./chat-area"
import { ChatInput } from "./chat-input"
import { PreviewPanel } from "./preview-panel"

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
})

interface StudioClientProps {
  user: {
    id: string
    email?: string
    name?: string
    avatar?: string
  }
  initialProjects: Array<{
    id: string
    name: string
    chats: Array<{
      id: string
      title: string
      created_at: string
    }>
  }>
}

export function StudioClient({ user, initialProjects }: StudioClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [model, setModel] = useState("gemini-2.0-flash")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)
  const [showSettings, setShowSettings] = useState(false)
  const [previewCode, setPreviewCode] = useState<string | null>(null)
  const [projects, setProjects] = useState(initialProjects)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    initialProjects[0]?.id ?? null
  )
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")

  const { messages, status, sendMessage, stop, setMessages } = useChat({
    transport: chatTransport,
  })

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return
    const text = input
    setInput("")
    sendMessage({ text }, { body: { model, temperature, maxTokens } })
    setShowSettings(false)
  }, [input, sendMessage, model, temperature, maxTokens])

  const handlePreviewCode = useCallback((code: string) => {
    setPreviewCode(code)
  }, [])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setPreviewCode(null)
    setActiveChatId(null)
  }, [setMessages])

  const handleNewProject = useCallback(() => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: `Project ${projects.length + 1}`,
      chats: [],
    }
    setProjects((prev) => [...prev, newProject])
    setActiveProjectId(newProject.id)
    setActiveChatId(null)
    setMessages([])
    setPreviewCode(null)
  }, [projects.length, setMessages])

  const handleSelectChat = useCallback(
    (projectId: string, chatId: string) => {
      setActiveProjectId(projectId)
      setActiveChatId(chatId)
      setMessages([])
      setPreviewCode(null)
    },
    [setMessages]
  )

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      setProjects((prev) =>
        prev.map((p) => ({
          ...p,
          chats: p.chats.filter((c) => c.id !== chatId),
        }))
      )
      if (activeChatId === chatId) {
        setActiveChatId(null)
        setMessages([])
        setPreviewCode(null)
      }
    },
    [activeChatId, setMessages]
  )

  const isStreaming = status === "streaming" || status === "submitted"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StudioSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        projects={projects}
        activeProjectId={activeProjectId}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onNewProject={handleNewProject}
        onDeleteChat={handleDeleteChat}
        user={{
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        }}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="relative">
          <TopBar
            model={model}
            onModelChange={setModel}
            temperature={temperature}
            onTemperatureChange={setTemperature}
            maxTokens={maxTokens}
            onMaxTokensChange={setMaxTokens}
            showSettings={showSettings}
            onToggleSettings={() => setShowSettings(!showSettings)}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat section */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatArea
              messages={messages}
              status={status}
              onPreviewCode={handlePreviewCode}
            />
            <ChatInput
              input={input}
              onInputChange={setInput}
              onSubmit={handleSendMessage}
              onStop={stop}
              isStreaming={isStreaming}
            />
          </div>

          {/* Preview panel */}
          {previewCode && (
            <PreviewPanel
              code={previewCode}
              onClose={() => setPreviewCode(null)}
            />
          )}
        </div>
      </div>

      {/* Click outside to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
