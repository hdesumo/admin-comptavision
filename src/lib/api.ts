const API = process.env.NEXT_PUBLIC_API_BASE!;
export async function api(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers||{}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(()=> '')}`);
  return res.json();
}
