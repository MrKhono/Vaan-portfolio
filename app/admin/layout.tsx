export const metadata = {
  title: "Administration - Vaan Photography",
  description: "Panel d'administration du site",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {children}
    </div>
  )
}