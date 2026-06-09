import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')

  if (!roomId) {
    return Response.json({ error: 'roomId is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(200)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ messages: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: body.roomId,
      user_id: body.userId,
      username: body.username,
      content: body.content,
      translated_content: body.translatedContent ?? null,
      is_haven: body.isHaven ?? false,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ message: data }, { status: 201 })
}
