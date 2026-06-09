import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let query = supabase.from('rooms').select('*').order('created_at', { ascending: false })
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ rooms: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      title: body.title,
      desc: body.desc,
      category: body.category,
      capacity: body.capacity ?? 20,
      weekly_prompt: body.weeklyPrompt ?? body.weekly_prompt ?? null,
      members: 0,
      is_active: true,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ room: data }, { status: 201 })
}
