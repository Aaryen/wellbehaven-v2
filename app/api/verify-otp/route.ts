import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data: otpRow, error: lookupError } = await supabase
      .from('otp_codes')
      .select('id, used, expires_at')
      .eq('email', email.toLowerCase().trim())
      .eq('code', code.trim())
      .eq('used', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lookupError || !otpRow) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    // Mark the code as used
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otpRow.id)

    const admin = getAdminClient()

    // Find or create the user
    const { data: { users }, error: listError } = await admin.auth.admin.listUsers()
    if (listError) {
      return NextResponse.json({ error: 'Auth error' }, { status: 500 })
    }

    const existingUser = users.find((u) => u.email === email.toLowerCase().trim())

    let userId: string

    if (existingUser) {
      userId = existingUser.id
    } else {
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        email_confirm: true,
      })
      if (createError || !newUser.user) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
      userId = newUser.user.id
    }

    // Generate a magic link to get a valid session
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase().trim(),
    })

    if (linkError || !linkData.properties) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    // Exchange the hash fragment tokens for a session
    const anonClient = (await createClient())
    const { data: sessionData, error: sessionError } = await anonClient.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink',
    })

    if (sessionError || !sessionData.session) {
      return NextResponse.json({ error: 'Failed to establish session' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      session: sessionData.session,
      user: sessionData.user,
    })
  } catch (err) {
    console.error('verify-otp error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
