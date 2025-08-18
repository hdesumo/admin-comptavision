// app/admin/licenses/page.tsx
import { revalidatePath } from "next/cache";

// ---- Types ---------------------------------------------------------------
type License = {
  id?: number | string;
  plan: string;
  seats: number;
  months: number;
  notes?: string;
  activations_count?: number;
  max_activations?: number;
  start_at?: string;
  start_date?: string;
  end_at?: string;
  end_date?: string;
  status?: string;
  cabinet_id?: string | number | null;
  client_id?: string | number | null;
  created_at?: string;
};

// ---- Data fetch (server) -------------------------------------------------
async function fetchLicenses(): Promise<License[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL ? "" : ""}/api/admin/licenses`, {
    // URL relative → passe par le proxy Next qui ajoute le Bearer depuis cookie HttpOnly
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    // Tente d’extraire un message d’erreur fourni par le proxy/back
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.error || body?.message || msg;
    } catch {}
    throw new Error(`Impossible de charger les licences : ${msg}`);
  }

  try {
    const data = (await res.json()) as License[] | { data?: License[] };
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).data)) return (data as any).data;
    return [];
  } catch {
    return [];
  }
}

// ---- Server Action: create ----------------------------------------------
async function createLicense(formData: FormData) {
  "use server";

  const payload = {
    plan: (formData.get("plan") as string) || "pro",
    seats: Number(formData.get("seats") || 1),
    months: Number(formData.get("months") || 12),
    notes: (formData.get("notes") as string) || "",
  };

  // Validation minimale
  if (!payload.plan || payload.seats <= 0 || payload.months <= 0) {
    return { ok: false, error: "Paramètres invalides." };
  }

  const res = await fetch(`/api/admin/licenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.error || body?.message || msg;
    } catch {}
    return { ok: false, error: msg };
  }

  // Force le rafraîchissement de la page après création
  revalidatePath("/admin/licenses");
  return { ok: true };
}

// ---- UI helpers ----------------------------------------------------------
function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

// ---- Page ----------------------------------------------------------------
export default async function LicensesPage() {
  let licenses: License[] = [];
  let loadError: string | null = null;

  try {
    licenses = await fetchLicenses();
  } catch (e: any) {
    loadError = e?.message || "Erreur inattendue lors du chargement.";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Licences</h1>
          <p className="text-sm text-gray-500">
            Gestion des licences ComptaVision (lecture & création).
          </p>
        </div>
        <a
          href="/admin/licenses"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          title="Rafraîchir"
        >
          Rafraîchir
        </a>
      </div>

      {/* Create Card */}
      <form action={createLicense} className="bg-white border rounded-xl shadow-sm p-4 grid gap-3 md:grid-cols-12">
        <div className="md:col-span-3">
          <label className="block text-xs text-gray-600 mb-1">Plan</label>
          <select name="plan" defaultValue="pro" className="w-full border rounded-md px-3 py-2">
            <option value="starter">starter</option>
            <option value="pro">pro</option>
            <option value="enterprise">enterprise</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs text-gray-600 mb-1">Postes (seats)</label>
          <input
            type="number"
            name="seats"
            min={1}
            defaultValue={5}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs text-gray-600 mb-1">Durée (mois)</label>
          <input
            type="number"
            name="months"
            min={1}
            defaultValue={12}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="md:col-span-12">
          <label className="block text-xs text-gray-600 mb-1">Notes</label>
          <input
            type="text"
            name="notes"
            placeholder="Ex: Pack PRO 5 postes"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="md:col-span-12 flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-black text-white px-4 py-2 text-sm"
          >
            Créer une licence
          </button>
          <span className="text-xs text-gray-500">
            La liste se mettra à jour automatiquement après création.
          </span>
        </div>
      </form>

      {/* Errors */}
      {loadError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="text-left">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Postes</th>
                <th className="px-3 py-2">Activations</th>
                <th className="px-3 py-2">Début</th>
                <th className="px-3 py-2">Fin</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Cabinet/Client</th>
              </tr>
            </thead>
            <tbody>
              {licenses.length > 0 ? (
                licenses.map((l, idx) => (
                  <tr key={l.id ?? `row-${idx}`} className="border-t">
                    <td className="px-3 py-2">{l.id ?? "—"}</td>
                    <td className="px-3 py-2">{l.plan ?? "—"}</td>
                    <td className="px-3 py-2">{l.seats ?? "—"}</td>
                    <td className="px-3 py-2">
                      {(l.activations_count ?? 0)}/{l.max_activations ?? l.seats ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      {formatDate(l.start_at || l.start_date)}
                    </td>
                    <td className="px-3 py-2">
                      {formatDate(l.end_at || l.end_date)}
                    </td>
                    <td className="px-3 py-2">{l.status ?? "—"}</td>
                    <td className="px-3 py-2">
                      {l.cabinet_id || l.client_id || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-8 text-center text-gray-500" colSpan={8}>
                    Aucune licence pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Astuce d’intégration */}
      <p className="text-xs text-gray-500">
        Cette page utilise le <strong>proxy local</strong> <code>/api/admin/licenses</code> pour éviter
        CORS et injecter l’auth (cookie HttpOnly) côté serveur.
      </p>
    </div>
  );
}

