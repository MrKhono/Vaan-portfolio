"use server"

import { Resend } from "resend"
import { getSettingsAction } from "@/actions/settings.actions"

const resend = new Resend(process.env.RESEND_API_KEY)

export type ContactFormData = {
  name:    string
  email:   string
  phone?:  string
  subject: string
  message: string
}

export async function sendContactEmailAction(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.name.trim())    return { success: false, error: "Le nom est requis." }
    if (!data.email.trim())   return { success: false, error: "L'email est requis." }
    if (!data.subject.trim()) return { success: false, error: "Le sujet est requis." }
    if (!data.message.trim()) return { success: false, error: "Le message est requis." }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY manquant")
      return { success: false, error: "Configuration email manquante." }
    }

    const settings = await getSettingsAction()
    const toEmail  = process.env.CONTACT_EMAIL || settings.contactEmail

    console.log("toEmail:", toEmail)

    if (!toEmail) {
      return { success: false, error: "Email de destination non configuré." }
    }

    // ⚠️ Tant que le domaine n'est pas vérifié sur Resend :
    // - `to` doit être l'email de ton compte Resend
    // - `from` doit rester onboarding@resend.dev
    // Une fois le domaine vérifié, remplace par :
    // from: "Contact <contact@vaanphotography.fr>"
    // to: [toEmail]

    const { data: resendData, error: resendError } = await resend.emails.send({
      from:    "Contact <contact@vaanphotography.fr>",
      to:      [process.env.RESEND_TEST_EMAIL || toEmail],
      replyTo: data.email,
      subject: `[Contact] ${data.subject}`,
      html:    buildEmailHtml(data),
    })

    if (resendError) {
      console.error("Resend error:", resendError)
      return { success: false, error: resendError.message }
    }

    console.log("Email envoyé, id:", resendData?.id)
    return { success: true }

  } catch (error) {
    console.error("Send email error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible d'envoyer le message.",
    }
  }
}

function buildEmailHtml(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="background:#0F0F0F;padding:32px;text-align:center;">
          <h1 style="color:#F8F8F8;font-size:22px;margin:0;font-weight:600;">
            Nouveau message de contact
          </h1>
        </div>
        <div style="padding:32px;">
          <h2 style="font-size:18px;color:#0F0F0F;margin:0 0 24px;">
            ${data.subject}
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 0;color:#666;width:120px;vertical-align:top;">Nom</td>
              <td style="padding:8px 0;font-weight:bold;color:#0F0F0F;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;vertical-align:top;">Email</td>
              <td style="padding:8px 0;">
                <a href="mailto:${data.email}" style="color:#0F0F0F;">${data.email}</a>
              </td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding:8px 0;color:#666;vertical-align:top;">Téléphone</td>
              <td style="padding:8px 0;color:#0F0F0F;">${data.phone}</td>
            </tr>
            ` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">
            Message
          </p>
          <p style="line-height:1.7;color:#333;white-space:pre-wrap;margin:0;">
            ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <div style="text-align:center;">
            <a href="mailto:${data.email}"
              style="display:inline-block;background:#0F0F0F;color:#F8F8F8;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;"
            >
              Répondre à ${data.name}
            </a>
          </div>
        </div>
        <div style="background:#F8F8F8;padding:16px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">
            Message reçu depuis le formulaire de contact de votre site
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}