import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  console.log('--- /api/send-otp ---')
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
  console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)

  try {
    const body = await req.json()
    console.log('Request body:', body)
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Use service role client so RLS doesn't block the insert
    console.log('Creating admin Supabase client...')
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
      process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    console.log('Inserting OTP into otp_codes...')
    const { error: dbError } = await supabase.from('otp_codes').insert({
      email: email.toLowerCase().trim(),
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (dbError) {
      console.error('DB error inserting OTP:', JSON.stringify(dbError, null, 2))
      return NextResponse.json({ error: 'Failed to store code', detail: dbError.message }, { status: 500 })
    }
    console.log('OTP inserted successfully')

    // Initialize Resend inside the handler so env is guaranteed to be loaded
    console.log('Initializing Resend...')
    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log('Sending email via Resend to:', email)
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your WellbeHaven code',
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="margin:0;padding:0;background:#f4f7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:40px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
                    <tr>
                      <td style="background:#2E5E32;padding:28px 32px;text-align:center;">
                        <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#a8d5ab;">WellbeHaven</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:36px 32px 24px;text-align:center;">
                        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#162018;">Your sign-in code</h1>
                        <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.5;">
                          Enter this code to access your WellbeHaven account.<br />It expires in 5 minutes.
                        </p>
                        <div style="display:inline-block;background:#f0f7f0;border:2px solid #d1e8d2;border-radius:12px;padding:18px 36px;">
                          <span style="font-size:36px;font-weight:800;letter-spacing:0.3em;color:#2E5E32;">${code}</span>
                        </div>
                        <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">
                          If you didn&apos;t request this, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 32px 28px;text-align:center;border-top:1px solid #f0f0f0;">
                        <p style="margin:0;font-size:12px;color:#d1d5db;">Not a substitute for therapy or crisis services.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (emailError) {
      console.error('Resend error:', JSON.stringify(emailError, null, 2))
      return NextResponse.json({ error: 'Failed to send email', detail: (emailError as { message?: string }).message }, { status: 500 })
    }

    console.log('Email sent successfully. Resend ID:', emailData?.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-otp uncaught error:', err)
    console.error('Error type:', typeof err)
    console.error('Error stringified:', JSON.stringify(err, Object.getOwnPropertyNames(err as object)))
    return NextResponse.json({ error: 'Internal server error', detail: String(err) }, { status: 500 })
  }
}
