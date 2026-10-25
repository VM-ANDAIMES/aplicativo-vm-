import { ReactNode } from 'react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-[17px] font-bold text-white/95 tracking-tight">{title}</h2>
        <p className="text-[11px] text-white/35 font-mono mt-0.5 tracking-wide">{subtitle}</p>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function PrimaryButton({ children, onClick, type = 'button', disabled }: {
  children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[12px] font-semibold tracking-wide rounded-xl transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, type = 'button' }: {
  children: ReactNode; onClick?: () => void; type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 text-white/55 hover:text-white/90 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.09] hover:border-white/[0.18] text-[12px] font-medium tracking-wide rounded-xl transition-all"
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-white/25 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/8 text-xs rounded-lg transition-all"
    >
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'default' }: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'orange' | 'blue';
}) {
  const styles = {
    default:  'bg-white/[0.06] text-white/50 border-white/[0.08]',
    success:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger:   'bg-red-500/10 text-red-400 border-red-500/20',
    orange:   'bg-orange-500/12 text-orange-400 border-orange-500/25',
    blue:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function FormPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-5 mb-6 shadow-xl shadow-black/30">
      <div className="flex items-center gap-2 mb-4 pb-3.5 border-b border-white/[0.06]">
        <div className="w-1 h-4 bg-orange-500 rounded-full" />
        <h3 className="text-[13px] font-semibold text-white/85 tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputBase = "w-full bg-[#0d0d0d] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-[13px] text-white/90 placeholder-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15 transition-all";

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${className}`} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select {...props} className={inputBase + ' cursor-pointer'}>
      {children}
    </select>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#141414] border border-white/[0.07] rounded-2xl overflow-hidden shadow-lg shadow-black/20">
      <table className="w-full text-[13px]">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-[#111111] border-b border-white/[0.07]">
      {children}
    </thead>
  );
}

export function Th({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <th className={`text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] ${className}`}>
      {children}
    </th>
  );
}

export function Tr({ children, onClick, selected }: { children: ReactNode; onClick?: () => void; selected?: boolean }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-white/[0.04] last:border-0 transition-colors duration-100 ${
        onClick ? 'cursor-pointer' : ''
      } ${selected ? 'bg-orange-500/[0.07]' : 'hover:bg-white/[0.03]'}`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 text-white/65 ${className}`}>{children}</td>;
}

export function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-white/20 text-xs">{message}</p>
        </div>
      </td>
    </tr>
  );
}

export function FilterSelect({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#1a1a1a] border border-white/[0.09] rounded-xl px-3 py-2 text-[12px] text-white/60 hover:text-white/80 focus:outline-none focus:border-orange-500/50 transition-all cursor-pointer"
    >
      {children}
    </select>
  );
}

export function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
