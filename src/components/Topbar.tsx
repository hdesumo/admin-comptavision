'use client';
import { clearToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
export default function Topbar(){
  const router = useRouter();
  return (
    <div className="h-12 border-b flex items-center justify-between px-4">
      <div className="font-semibold">ComptaVision Admin</div>
      <button className="text-sm border px-3 py-1 rounded" onClick={()=>{ clearToken(); router.replace('/login'); }}>
        Déconnexion
      </button>
    </div>
  );
}
