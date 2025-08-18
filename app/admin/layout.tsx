export const metadata = { title: "ComptaVision — Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-12 border-b bg-white flex items-center justify-between px-4">
        <div className="font-semibold">ComptaVision Admin</div>
        <a
          href="/login"
          className="text-sm border px-3 py-1 rounded hover:bg-gray-50"
          title="Se déconnecter (placeholder)"
        >
          Déconnexion
        </a>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-60 border-r bg-white p-3 space-y-1">
          <a href="/admin/licenses" className="block px-3 py-2 rounded hover:bg-gray-100">Licences</a>
          <a href="/admin" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</a>
        </aside>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

