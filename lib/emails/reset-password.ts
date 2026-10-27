import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendResetPasswordEmailParams {
  to:   string
  name: string
  url:  string
}

export async function sendResetPasswordEmail({
  to,
  name,
  url,
}: SendResetPasswordEmailParams) {
  const { data: resendData, error } = await resend.emails.send({
    from:    "Vaan Photography <no-reply@vaanphotography.fr>",
    to:      [to],
    subject: "Réinitialisation de votre mot de passe",
    html:    buildResetEmailHtml({ name, url }),
  })

  if (error) {
    console.error("Erreur envoi email reset:", error)
    throw new Error("Impossible d'envoyer l'email de réinitialisation")
  }

  return resendData
}

function buildResetEmailHtml({ name, url }: { name: string; url: string }): string {
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
            Réinitialisation de mot de passe
          </h1>
        </div>

        <div style="padding:32px;">
          <p style="font-size:16px;color:#0F0F0F;margin:0 0 16px;">
            Bonjour ${name},
          </p>
          <p style="font-size:14px;line-height:1.7;color:#333;margin:0 0 24px;">
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable pendant <strong>1 heure</strong>.
          </p>

          <div style="text-align:center;margin:32px 0;">
            <a href="${url}"
              style="display:inline-block;background:#0F0F0F;color:#F8F8F8;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;"
            >
              Réinitialiser mon mot de passe
            </a>
          </div>

          <p style="font-size:13px;color:#666;line-height:1.6;margin:24px 0 0;">
            Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email. Votre mot de passe actuel restera inchangé.
          </p>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <p style="font-size:12px;color:#999;line-height:1.5;margin:0;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="${url}" style="color:#0F0F0F;word-break:break-all;">${url}</a>
          </p>
        </div>

        <div style="background:#F8F8F8;padding:16px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">
            Vaan Photography — Administration
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}