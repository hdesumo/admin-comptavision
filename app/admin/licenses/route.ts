import { NextRequest, NextResponse } from "next/server";

function bearer(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token ? `Bearer ${token}` : "";
}

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const url = `${base.replace(/\/+$/, "")}/api/admin/licenses`;

  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: bearer(req),
    },
    cache: "no-store",
  });

  const txt = await r.text().catch(() => "");
  let json: any = {};
  try { json = txt ? JSON.parse(txt) : {}; } catch {}
  return NextResponse.json(json || txt || null, { status: r.status });
}

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const url = `${base.replace(/\/+$/, "")}/api/admin/licenses`;
  const body = await req.text();

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: bearer(req),
    },
    body,
  });

  const txt = await r.text().catch(() => "");
  let json: any = {};
  try { json = txt ? JSON.parse(txt) : {}; } catch {}
  return NextResponse.json(json || txt || null, { status: r.status });
}
