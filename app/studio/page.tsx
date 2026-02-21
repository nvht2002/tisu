import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StudioClient } from "@/components/studio/studio-client"

export default async function StudioPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Fetch user's projects with their chats
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      chats (
        id,
        title,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const formattedProjects = (projects || []).map((p) => ({
    id: p.id,
    name: p.name,
    chats: (p.chats || []).map((c: { id: string; title: string; created_at: string }) => ({
      id: c.id,
      title: c.title,
      created_at: c.created_at,
    })),
  }))

  return (
    <StudioClient
      user={{
        id: user.id,
        email: user.email ?? undefined,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0],
        avatar:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture,
      }}
      initialProjects={formattedProjects}
    />
  )
}
