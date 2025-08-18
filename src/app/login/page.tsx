"use client";

import { useState } from "react";

type LoginResponse = { token: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("admin@comptavision.net");
  const [password, setPassword] = useState<string>("Admin@12345");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean>(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setError(null);
      const r = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) throw new Error(`Login failed (${r.status})`);
      const data = (await r.json()) as LoginResponse;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      setOk(true);
      // TODO: rediriger vers /admin/licenses si tu as un routeur côté client
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setOk(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={login} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Admin • Connexion</h1>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Email</label>
          <input
            className="border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Mot de passe</label>
          <input
            className="border rounded px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </div>

        <button type="submit" className="w-full py-2 rounded bg-black text-white">
          Se connecter
        </button>

        {ok && <p className="text-green-600 text-sm">Connecté. Token stocké.</p>}
        {error && <p className="text-red-600 text-sm">Erreur : {error}</p>}
      </form>
    </main>
  );
}

