import { NextRequest, NextResponse } from 'next/server';

type License = {
  id: number;
  client: string;
  key: string;
  status: 'active' | 'inactive';
  expirationDate: string;
};

// In-memory store (reset à chaque reboot du serveur dev)
let licenses: License[] = [
  { id: 1, client: 'Cabinet Alpha', key: 'CV-ABCD-EF12-3456', status: 'active',  expirationDate: '2026-12-31' },
  { id: 2, client: 'Cabinet Beta',  key: 'CV-7890-ABCD-EF12', status: 'inactive',expirationDate: '2025-11-30' },
  { id: 3, client: 'Cabinet Gamma', key: 'CV-1357-2468-AAAA', status: 'active',  expirationDate: '2025-09-15' },
];

// GET /api/licenses → liste
export async function GET() {
  return NextResponse.json(licenses);
}

// PATCH /api/licenses → { id, status? } (toggle ou force un statut)
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const idx = licenses.findIndex(l => l.id === Number(id));
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Si status fourni, on force; sinon on toggle
    const current = licenses[idx];
    const nextStatus = status === 'active' || status === 'inactive'
      ? status
      : (current.status === 'active' ? 'inactive' : 'active');

    licenses[idx] = { ...current, status: nextStatus };
    return NextResponse.json(licenses[idx]);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bad request' }, { status: 400 });
  }
}

// POST /api/licenses → création d’une licence fake pour tester le formulaire
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nextId = (licenses.at(-1)?.id ?? 0) + 1;
    const newLic: License = {
      id: nextId,
      client: body.client ?? body.cabinet_id ?? 'Nouveau client',
      key: body.key ?? `CV-${Math.random().toString(36).slice(2,6).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
      status: 'active',
      expirationDate: body.expirationDate ?? '2026-12-31'
    };
    licenses.push(newLic);
    return NextResponse.json(newLic, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bad request' }, { status: 400 });
  }
}
