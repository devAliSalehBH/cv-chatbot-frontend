export const maxDuration = 60;
export const runtime = "edge";

// Detects if a string contains Arabic characters
function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export async function POST(req: Request) {
  try {
    const { messages, system_prompt } = await req.json();

    // Find the last user message to determine the language
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user");
    const userText = lastUserMessage?.content || "";
    const arabic = isArabic(userText);

    // Build the language enforcement instruction appended as a system reminder
    const languageDirective = arabic
      ? "\n\n⚠️ CRITICAL INSTRUCTION: The user's message is in Arabic. You MUST reply ENTIRELY in Arabic. Do NOT use any English words or sentences in your response. Your full response must be in professional, natural Arabic only."
      : "\n\n⚠️ CRITICAL INSTRUCTION: The user's message is in English. You MUST reply ENTIRELY in English.";

    const finalSystemPrompt = (system_prompt || "You are a helpful AI assistant.") + languageDirective;

    const openRouterMessages = [
      { role: "system", content: finalSystemPrompt },
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", 
        messages: openRouterMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter Error: ${response.status} ${errText}`);
    }

    // Return the stream directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

