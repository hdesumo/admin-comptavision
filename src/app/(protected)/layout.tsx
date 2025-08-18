// src/app/(protected)/layout.tsx
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <Topbar />
      <div className="grid grid-cols-[240px_1fr]">
        <Sidebar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

