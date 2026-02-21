"use client"

import { useState } from "react"
import Image from "next/image"
import { signOut } from "@/app/auth/actions"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  FolderOpen,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Chat {
  id: string
  title: string
  created_at: string
}

interface Project {
  id: string
  name: string
  chats: Chat[]
}

interface StudioSidebarProps {
  collapsed: boolean
  onToggle: () => void
  projects: Project[]
  activeProjectId: string | null
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (projectId: string, chatId: string) => void
  onNewProject: () => void
  onDeleteChat: (chatId: string) => void
  user: {
    email?: string
    name?: string
    avatar?: string
  }
}

export function StudioSidebar({
  collapsed,
  onToggle,
  projects,
  activeProjectId,
  activeChatId,
  onNewChat,
  onSelectChat,
  onNewProject,
  onDeleteChat,
  user,
}: StudioSidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(projects.map((p) => p.id))
  )

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (collapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center border-r border-sidebar-border bg-sidebar py-3 gap-3">
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="Open sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
        <button
          onClick={onNewChat}
          className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="New chat"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-sidebar-border px-3">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="TiSu" width={24} height={24} />
          <span className="text-sm font-semibold text-foreground">TiSu AI</span>
        </div>
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* New Chat / Project buttons */}
      <div className="flex gap-2 px-3 py-3">
        <button
          onClick={onNewChat}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          New Chat
        </button>
        <button
          onClick={onNewProject}
          className="flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          aria-label="New project"
        >
          <FolderOpen className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Projects / Chats list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-40" />
            <p className="text-xs">No chats yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {projects.map((project) => (
              <div key={project.id}>
                <button
                  onClick={() => toggleProject(project.id)}
                  className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  {expandedProjects.has(project.id) ? (
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  )}
                  <FolderOpen className="h-3 w-3 shrink-0 text-primary" />
                  <span className="truncate">{project.name}</span>
                </button>

                {expandedProjects.has(project.id) && (
                  <div className="ml-4 flex flex-col gap-0.5">
                    {project.chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={cn(
                          "group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer",
                          activeChatId === chat.id
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                        onClick={() => onSelectChat(project.id, chat.id)}
                      >
                        <MessageSquare className="h-3 w-3 shrink-0" />
                        <span className="flex-1 truncate">{chat.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(chat.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                          aria-label="Delete chat"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User section */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="h-7 w-7 rounded-full"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-foreground">
              {user.name || "User"}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {user.email}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
