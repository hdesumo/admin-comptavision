'use client';
export default function Toast({msg, onClose}:{msg:string|null; onClose:()=>void}) {
  if(!msg) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black text-white text-sm px-4 py-2 rounded shadow" onClick={onClose}>{msg}</div>
    </div>
  );
}

