import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactLimiter } from '@/lib/ratelimit'

const resend = new Resend(process.env.RESEND_API_KEY)

const DEPT_LABELS: Record<string, string> = {
  booking: 'Artist Booking',
  sound: 'Sound System Rental',
  management: 'Artist Management',
  press: 'Press & Media',
  studio: 'Studio Sessions',
  general: 'General Inquiry',
}

export async function POST(req: NextRequest) {
  if (contactLimiter) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    const { success } = await contactLimiter.limit(ip)
    if (!success) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { name, email, phone, department, message } = await req.json()

  if (!name || !email || !department || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL ?? 'ysejam@gmail.com'
  const deptLabel = DEPT_LABELS[department] ?? department

  try {
    await resend.emails.send({
      from: 'YardStyle Entertainment <noreply@yseja.com>',
      to: toEmail,
      replyTo: email,
      subject: `[${deptLabel}] New inquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#052e16,#14532d);padding:32px;border-bottom:1px solid rgba(234,179,8,0.3)">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(234,179,8,0.7)">YardStyle Entertainment</p>
            <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff">New Contact Inquiry</h1>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase;width:120px">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-weight:600">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07)"><a href="mailto:${email}" style="color:#eab308;text-decoration:none">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07)">${phone}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase">Department</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07)"><span style="background:rgba(234,179,8,0.15);color:#eab308;border:1px solid rgba(234,179,8,0.3);padding:2px 10px;border-radius:20px;font-size:12px;font-weight:700">${deptLabel}</span></td>
              </tr>
            </table>
            <div style="margin-top:24px">
              <p style="margin:0 0 10px;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase">Message</p>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</div>
            </div>
            <div style="margin-top:32px;text-align:center">
              <a href="mailto:${email}" style="display:inline-block;background:linear-gradient(135deg,#eab308,#ca8a04);color:#000000;font-weight:800;font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:12px 28px;border-radius:8px">Reply to ${name}</a>
            </div>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from: 'YardStyle Entertainment <noreply@yseja.com>',
      to: email,
      subject: "We received your message — YardStyle Entertainment",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#052e16,#14532d);padding:32px;border-bottom:1px solid rgba(234,179,8,0.3)">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(234,179,8,0.7)">YardStyle Entertainment</p>
            <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff">We Got Your Message</h1>
          </div>
          <div style="padding:32px">
            <p style="color:rgba(255,255,255,0.7);line-height:1.7">Hey ${name},</p>
            <p style="color:rgba(255,255,255,0.7);line-height:1.7">Thanks for reaching out to us regarding <strong style="color:#eab308">${deptLabel}</strong>. We've received your inquiry and a member of our team will get back to you within 24 hours.</p>
            <p style="color:rgba(255,255,255,0.7);line-height:1.7">In the meantime, feel free to follow us on social media for the latest updates on our artists and events.</p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0" />
            <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;text-align:center">YardStyle Entertainment &nbsp;|&nbsp; Powering Music. Elevating Culture.</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] email send error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
