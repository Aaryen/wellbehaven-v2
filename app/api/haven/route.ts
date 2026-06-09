const DEFAULT_SYSTEM_PROMPT = `You are Haven, a warm and empathetic AI companion in a peer support circle.
You are NOT a therapist, doctor, or crisis service.

Your role is to:
- Acknowledge feelings with genuine warmth
- Ask gentle, open questions that help people process their emotions
- Reflect back what you hear without judgment
- Normalize difficult emotions — they are human and valid
- Encourage connection between circle members
- Keep responses short (2–3 sentences), warm, and conversational
- Never give medical advice or diagnoses
- End with a gentle question when it feels natural

If someone seems to be in crisis, gently say:
"I hear you, and I want you to be safe. Please reach out to the 988 Suicide & Crisis Lifeline by calling or texting 988."`

export async function POST(request: Request) {
  const { messages, systemPrompt } = await request.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: systemPrompt || DEFAULT_SYSTEM_PROMPT,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Anthropic API error:', err)
    return Response.json({ error: 'AI service unavailable' }, { status: 502 })
  }

  const data = await res.json()
  return Response.json({ content: data.content[0].text })
}
