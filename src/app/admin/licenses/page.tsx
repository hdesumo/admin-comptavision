// remplace l'ancien appel vers `${API_BASE}/api/admin/licenses` par le proxy Next
const fetchLicences = async (): Promise<void> => {
  const token = readToken();
  if (!token) {
    setError("Token manquant. Connectez-vous.");
    return;
  }
  try {
    setLoading(true);
    const r = await fetch(`/api/licenses`, {         // ⬅️ ICI
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`Fetch failed (${r.status})`);
    const data = (await r.json()) as LicencesListResponse | Licence[];
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

// et garde ceci tel quel :
useEffect(() => {
  void fetchLicences();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

