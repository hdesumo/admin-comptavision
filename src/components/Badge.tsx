import { cx } from '@/lib/cx';

export default function Badge({ children, tone='default' }:{
  children: React.ReactNode; tone?: 'success'|'danger'|'warning'|'default'
}) {
  const map = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning:'bg-amber-100 text-amber-800',
    default:'bg-gray-100 text-gray-800',
  } as const;
  return <span className={cx('text-xs px-2 py-1 rounded', map[tone])}>{children}</span>;
}

