"use client";

import { useEffect, useState } from "react";

type LicenceStatus = "active" | "expired" | "revoked" | string;

interface Licence {
  id: string;
  license_key: string;
  status: LicenceStatus;
  end_at?: string | null;
}

export default function LicencesPublicPage() {
  const [items, setItems] = useState<Licence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Inline l'appel pour éviter la dépendance manquante 'fetchLicences'
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        // Placeholder : pas d’appel bloquant au build
        const demo: Licence[] = [];
        if (!aborted) setItems(demo);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        if (!aborted) setError(msg);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Licences (public)</h1>
      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">Erreur : {error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-gray-500">Aucune licence à afficher.</p>
      )}
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((l) => (
            <li
              key={l.id}
              className="border rounded-md p-3 flex items-center justify-between"
            >
              <span className="font-mono">{l.license_key}</span>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">
                {l.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

