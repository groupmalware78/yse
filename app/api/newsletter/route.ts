import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  try {
    await prisma.newsletterSubscriber.create({ data: { email } })
  } catch (err: any) {
    if (err?.code === 'P2002') {
      // Already subscribed — treat as success so we don't leak info
      return NextResponse.json({ success: true })
    }
    console.error('[newsletter] db error:', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL ?? 'info@yardstylement.com'

  try {
    await resend.contacts.create({ email, unsubscribed: false })
  } catch (err) {
    console.error('[newsletter] resend contact sync error:', err)
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: 'YardStyle Entertainment <noreply@yseja.com>',
        to: email,
        subject: "Welcome to the YardStyle fam 🔥",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;border-radius:12px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#052e16,#14532d);padding:32px;border-bottom:1px solid rgba(234,179,8,0.3)">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(234,179,8,0.7)">YardStyle Entertainment</p>
              <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff">Welcome to the Yard!</h1>
            </div>
            <div style="padding:32px">
              <p style="color:rgba(255,255,255,0.7);line-height:1.7">You're officially on the list. Expect first access to new releases, exclusive events, artist news, and behind-the-scenes content from the YardStyle family.</p>
              <p style="color:rgba(255,255,255,0.7);line-height:1.7">Stay tuned — fire incoming.</p>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0" />
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;text-align:center">YardStyle Entertainment &nbsp;|&nbsp; Powering Music. Elevating Culture.</p>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.2);font-size:11px;text-align:center">You subscribed with ${email}. Reply to unsubscribe at any time.</p>
            </div>
          </div>
        `,
      }),
      resend.emails.send({
        from: 'YardStyle Entertainment <noreply@yseja.com>',
        to: toEmail,
        subject: `New newsletter subscriber: ${email}`,
        html: `<p style="font-family:sans-serif"><strong>${email}</strong> just subscribed to the newsletter.</p>`,
      }),
    ])
  } catch (err) {
    console.error('[newsletter] email send error:', err)
    // Subscriber is saved; email failure is non-fatal
  }

  return NextResponse.json({ success: true })
}
