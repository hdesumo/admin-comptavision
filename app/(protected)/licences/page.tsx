'use client';
import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_BASE!;
type Licence = {
  id: string; license_key: string; plan: string; seats: number;
  max_activations: number; activations_count: number;
  start_at?: string; start_date?: string; end_at?: string; end_date?: string;
  status: 'active'|'expired'|'suspended'|'revoked'; cabinet_id?: string|null; client_id?: string|null; notes?: string|null;
};
export default function LicencesPage(){
  const [data,setData]=useState<Licence[]>([]); const [loading,setLoading]=useState(false); const [q,setQ]=useState('');
  const [form,setForm]=useState({ cabinet_id:'', plan:'standard', seats:1, months:12, notes:'' });
  const token = typeof window!=='undefined' ? localStorage.getItem('admin_token') : null;
  async function fetchLicences(){
    setLoading(true);
    const url = new URL(`${API}/api/admin/licenses`); if(q) url.searchParams.set('q', q);
    const res = await fetch(url.toString(), { headers:{ Authorization:`Bearer ${token}` } }); const js = await res.json(); setData(js); setLoading(false);
  }
  useEffect(()=>{ fetchLicences(); },[]);
  async function createLicence(e: React.FormEvent){
    e.preventDefault();
    const res = await fetch(`${API}/api/admin/licenses`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ cabinet_id: form.cabinet_id || null, plan: form.plan, seats: Number(form.seats), months: Number(form.months), notes: form.notes || null }) });
    if(res.ok){ setForm({ cabinet_id:'', plan:'standard', seats:1, months:12, notes:'' }); fetchLicences(); } else { alert(await res.text()); }
  }
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Licences</h1>
      <form onSubmit={createLicence} className="grid grid-cols-6 gap-3 p-4 border rounded-lg mb-6">
        <input className="col-span-2 border p-2 rounded" placeholder="Cabinet/Client ID (opt.)" value={form.cabinet_id} onChange={e=>setForm({...form, cabinet_id:e.target.value})}/>
        <select className="col-span-1 border p-2 rounded" value={form.plan} onChange={e=>setForm({...form, plan:e.target.value})}>
          <option value="standard">standard</option><option value="pro">pro</option>
        </select>
        <input className="col-span-1 border p-2 rounded" type="number" min={1} value={form.seats} onChange={e=>setForm({...form, seats:Number(e.target.value)})}/>
        <input className="col-span-1 border p-2 rounded" type="number" min={1} value={form.months} onChange={e=>setForm({...form, months:Number(e.target.value)})}/>
        <input className="col-span-6 border p-2 rounded" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
        <button className="col-span-6 bg-black text-white rounded p-2">Créer</button>
      </form>
      <div className="flex items-center gap-2 mb-3">
        <input className="border p-2 rounded w-64" placeholder="Recherche (clé, plan)" value={q} onChange={e=>setQ(e.target.value)}/>
        <button className="border px-3 py-2 rounded" onClick={fetchLicences}>Rechercher</button>
      </div>
      {loading ? <p>Chargement…</p> : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="text-left p-2">Clé</th><th className="text-left p-2">Plan</th><th className="text-left p-2">Seats</th>
              <th className="text-left p-2">Activations</th><th className="text-left p-2">Début</th><th className="text-left p-2">Fin</th>
              <th className="text-left p-2">Statut</th><th className="text-left p-2">Client</th>
            </tr></thead>
            <tbody>
              {data.map(l=>(
                <tr key={l.id} className="border-t">
                  <td className="p-2 font-mono">{l.license_key}</td>
                  <td className="p-2">{l.plan}</td>
                  <td className="p-2">{l.seats}</td>
                  <td className="p-2">{l.activations_count}/{l.max_activations}</td>
                  <td className="p-2">{new Date((l.start_at||l.start_date)!).toLocaleDateString()}</td>
                  <td className="p-2">{new Date((l.end_at||l.end_date)!).toLocaleDateString()}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2">{l.cabinet_id || l.client_id || '-'}</td>
                </tr>
              ))}
              {!data.length && <tr><td className="p-4" colSpan={8}>Aucune licence</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
