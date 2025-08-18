'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
function Item({ href, label }: { href: string; label: string }){
  const p = usePathname();
  const active = p === href || p.startsWith(href + '/');
  return <Link href={href} className={`block px-3 py-2 rounded ${active?'bg-gray-900 text-white':'hover:bg-gray-100'}`}>{label}</Link>;
}
export default function Sidebar(){
  return (
    <div className="w-56 border-r h-[calc(100vh-3rem)] p-3 space-y-1">
      <Item href="/dashboard" label="Dashboard" />
      <Item href="/licences" label="Licences" />
    </div>
  );
}
