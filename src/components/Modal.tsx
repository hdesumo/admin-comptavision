'use client';
export default function Modal({open, onClose, title, children, footer}:{
  open: boolean; onClose: ()=>void; title: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold">{title}</div>
          <div className="p-4 space-y-3">{children}</div>
          {footer && <div className="px-4 py-3 border-t bg-gray-50">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

