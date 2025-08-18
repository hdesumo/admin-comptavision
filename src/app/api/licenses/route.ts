import { NextResponse } from "next/server";
import type {
  Licence,
  LicencesListResponse,
  CreateLicenceBody,
} from "@/types/licence";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function readAuth(req: Request): string | null {
  const auth = req.headers.get("authorization");
  return auth && auth.trim() ? auth : null;
}

export async function GET(req: Request) {
  try {
    const auth = readAuth(req);
    const r = await fetch(`${API_BASE}/api/admin/licenses`, {
      method: "GET",
      headers: auth ? { Authorization: auth } : {},
      cache: "no-store",
    });
    const payload = (await r.json()) as LicencesListResponse | Licence[];
    return NextResponse.json(payload, { status: r.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateLicenceBody;
    const auth = readAuth(req);
    const r = await fetch(`${API_BASE}/api/admin/licenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    });
    const payload = (await r.json()) as Licence | { error: string } | unknown;
    return NextResponse.json(payload, { status: r.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
