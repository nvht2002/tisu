import { streamText, convertToModelMessages } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { messages, model, temperature, maxTokens } = await req.json()

  const modelId = model || "gemini-2.0-flash"

  const result = streamText({
    model: google(modelId),
    system: `You are TiSu AI, a helpful and knowledgeable AI assistant powered by Google Gemini. You can help with coding, writing, analysis, and creative tasks. When generating code, always wrap it in appropriate markdown code blocks with language identifiers. When generating complete HTML pages or web apps, use a single html code block that can be previewed directly.`,
    messages: await convertToModelMessages(messages),
    temperature: temperature ?? 0.7,
    maxOutputTokens: maxTokens ?? 4096,
  })

  return result.toUIMessageStreamResponse()
}
