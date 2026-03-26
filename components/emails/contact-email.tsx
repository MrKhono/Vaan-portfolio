interface ContactEmailProps {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export function ContactEmailTemplate({
  name,
  email,
  phone,
  subject,
  message,
}: ContactEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "#0F0F0F",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#F8F8F8", fontSize: "24px", margin: 0 }}>
          Nouveau message de contact
        </h1>
      </div>

      <div style={{ padding: "32px", background: "#ffffff" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "24px", color: "#0F0F0F" }}>
          {subject}
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "8px 0", color: "#666", width: "120px" }}>
                Nom
              </td>
              <td style={{ padding: "8px 0", fontWeight: "bold" }}>{name}</td>
            </tr>

            <tr>
              <td style={{ padding: "8px 0", color: "#666" }}>Email</td>
              <td style={{ padding: "8px 0" }}>
                <a href={`mailto:${email}`} style={{ color: "#0F0F0F" }}>
                  {email}
                </a>
              </td>
            </tr>

            {phone && (
              <tr>
                <td style={{ padding: "8px 0", color: "#666" }}>Téléphone</td>
                <td style={{ padding: "8px 0" }}>{phone}</td>
              </tr>
            )}
          </tbody>
        </table>

        <hr
          style={{
            margin: "24px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />

        <h3
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "12px",
          }}
        >
          MESSAGE
        </h3>

        <p
          style={{
            lineHeight: "1.6",
            color: "#333",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </p>

        <hr
          style={{
            margin: "24px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />

        <div style={{ textAlign: "center" }}>
          <a
            href={`mailto:${email}`}
            style={{
              background: "#0F0F0F",
              color: "#F8F8F8",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Répondre à {name}
          </a>
        </div>
      </div>

      <div
        style={{
          background: "#F8F8F8",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#999",
            fontSize: "12px",
            margin: 0,
          }}
        >
          Message reçu depuis le formulaire de contact de votre site
        </p>
      </div>
    </div>
  )
}