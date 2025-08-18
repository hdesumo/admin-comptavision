// src/app/layout.tsx
import "@/styles/globals.css";

export const metadata = {
  title: "Comptavision Admin",
  description: "Back-office Comptavision",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

