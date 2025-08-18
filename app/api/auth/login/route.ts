import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const { email, password } = await req.json();

  const upstream = await fetch(`${base.replace(/\/+$/, "")}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const text = await upstream.text().catch(() => "");
  const json = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};

  if (!upstream.ok) {
    return NextResponse.json({ error: json?.error || text || "Login failed" }, { status: upstream.status });
  }

  const token = json?.token;
  if (!token) {
    return NextResponse.json({ error: "Réponse backend sans token" }, { status: 502 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
