import { AuthProvider } from "@/components/admin/auth-context"

export const metadata = {
  title: "Administration - Alexandre Dubois Photographie",
  description: "Panel d'administration du site",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-muted/30">
        {children}
      </div>
    </AuthProvider>
  )
}
