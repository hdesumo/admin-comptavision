'use client';
export function getToken(){ if (typeof window==='undefined') return null; return localStorage.getItem('admin_token'); }
export function setToken(token: string){
  if (typeof document==='undefined') return;
  localStorage.setItem('admin_token', token);
  document.cookie = `admin_token=${token}; Path=/; Max-Age=${7*24*3600}; SameSite=Lax`;
}
export function clearToken(){
  if (typeof document==='undefined') return;
  localStorage.removeItem('admin_token');
  document.cookie = 'admin_token=; Path=/; Max-Age=0; SameSite=Lax';
}
