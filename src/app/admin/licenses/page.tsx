"use client";

import { useEffect, useState } from "react";

type LicenceStatus = "active" | "expired" | "revoked" | string;

export interface Licence {
  id: string;
  license_key: string;
  plan: string;
  seats: number;
  months: number;
  cabinet_id?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  status: LicenceStatus;
  notes?: string | null;
}

interface LicencesListResponse {
  data: Licence[];
}

interface CreateLicenceBody {
  plan: string;
  seats: number;
  months: number;
  cabinet_id?: string;
  notes?: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function AdminLicencesPage() {
  const [licences, setLicences] = useState<Licence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateLicenceBody>({
    plan: "pro",
    seats: 1,
    months: 1,
    cabinet_id: "",
    notes: "",
  });

  // Helpers typés
  const readToken = (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  };

  const fetchLicences = async (): Promise<void> => {
    const token = readToken();
    if (!token) {
      setError("Token manquant. Connectez-vous.");
      return;
    }
    try {
      setLoading(true);
      const r = await fetch(`${API_BASE}/api/admin/licenses`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!r.ok) throw new Error(`Fetch failed (${r.status})`);
      const data = (await r.json()) as LicencesListResponse | Licence[]; // tolère les 2 formats
      const list = Array.isArray(data) ? data : data.data;
      setLicences(list ?? []);
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const createLicence = async (): Promise<void> => {
    const token = readToken();
    if (!token) {
      setError("Token manquant. Connectez-vous.");
      return;
    }
    try {
      const r = await fetch(`${API_BASE}/api/admin/licenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error(`Create failed (${r.status})`);
      await fetchLicences();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    }
  };

  // Chargement initial (inline → pas de dépendance manquante)
  useEffect(() => {
    void fetchLicences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => {
      if (name === "seats" || name === "months") {
        const n = Number(value);
        return { ...prev, [name]: Number.isNaN(n) ? 0 : n };
      }
      return { ...prev, [name]: value };
    });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await createLicence();
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin • Licences</h1>

      {/* Formulaire de création */}
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 border p-4 rounded-lg"
      >
        <div className="flex flex-col">
          <label className="text-sm mb-1">Plan</label>
          <select
            name="plan"
            value={form.plan}
            onChange={onChange}
            className="border rounded px-2 py-1"
          >
            <option value="pro">pro</option>
            <option value="premium">premium</option>
            <option value="enterprise">enterprise</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Seats</label>
          <input
            type="number"
            min={1}
            name="seats"
            value={form.seats}
            onChange={onChange}
            className="border rounded px-2 py-1"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Months</label>
          <input
            type="number"
            min={1}
            name="months"
            value={form.months}
            onChange={onChange}
            className="border rounded px-2 py-1"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Cabinet ID</label>
          <input
            type="text"
            name="cabinet_id"
            value={form.cabinet_id ?? ""}
            onChange={onChange}
            className="border rounded px-2 py-1"
            placeholder="CAB123 (optionnel)"
          />
        </div>

        <div className="md:col-span-5 flex items-end gap-2">
          <button
            type="submit"
            className="px-3 py-2 rounded bg-black text-white"
          >
            Créer
          </button>
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>

        <div className="md:col-span-5">
          <label className="text-sm mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes ?? ""}
            onChange={onChange}
            className="border rounded px-2 py-1 w-full"
            rows={2}
          />
        </div>
      </form>

      {/* Liste */}
      <section className="border rounded-lg">
        <div className="px-4 py-2 border-b font-medium bg-gray-50">
          Licences ({licences.length})
        </div>
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Chargement…</div>
        ) : licences.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Aucune licence.</div>
        ) : (
          <ul className="divide-y">
            {licences.map((l) => (
              <li key={l.id} className="p-4 grid grid-cols-1 md:grid-cols-6 gap-2">
                <div className="md:col-span-2 font-mono">{l.license_key}</div>
                <div>{l.plan}</div>
                <div>{l.seats} seats</div>
                <div className="text-xs">
                  {l.start_at ?? "—"} → {l.end_at ?? "—"}
                </div>
                <div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100">
                    {l.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

