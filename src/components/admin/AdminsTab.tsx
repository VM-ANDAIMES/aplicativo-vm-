import { useState } from 'react';
import { Admin } from '../../types';
import { PlusIcon, TrashIcon } from '../ui';

interface Props {
  currentAdminId: string;
  admins: Admin[];
  onAdd: (adm: Omit<Admin, 'id'>) => void;
  onRemove: (id: string) => void;
}

const blank = { name: '', login: '', password: '' };

function AddAdminModal({ onAdd, onClose }: { onAdd: (adm: Omit<Admin, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState(blank);
  const f = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div
        className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl shadow-black/60"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            <h3 className="text-[15px] font-bold text-white/90">Novo Administrador</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] rounded-xl transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">Nome</label>
            <input
              value={form.name}
              onChange={e => f('name', e.target.value)}
              placeholder="Nome do administrador"
              required
              className="w-full bg-[#0d0d0d] border border-white/[0.09] rounded-xl px-3.5 py-3 min-h-[48px] text-[14px] text-white/90 placeholder-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15 transition"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">Login</label>
            <input
              value={form.login}
              onChange={e => f('login', e.target.value)}
              placeholder="Login de acesso"
              required
              className="w-full bg-[#0d0d0d] border border-white/[0.09] rounded-xl px-3.5 py-3 min-h-[48px] text-[14px] text-white/90 placeholder-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15 transition"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={e => f('password', e.target.value)}
              placeholder="Senha de acesso"
              required
              className="w-full bg-[#0d0d0d] border border-white/[0.09] rounded-xl px-3.5 py-3 min-h-[48px] text-[14px] text-white/90 placeholder-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15 transition"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-2xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmRemoveModal({ admin, onConfirm, onClose }: { admin: Admin; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div
        className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl shadow-black/60"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <TrashIcon />
          </div>
          <h3 className="text-[15px] font-bold text-white/90 mb-2">Remover Administrador?</h3>
          <p className="text-[13px] text-white/45 leading-relaxed mb-6">
            <span className="text-white/70 font-semibold">{admin.name}</span> perderá o acesso ao sistema imediatamente.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">
              Cancelar
            </button>
            <button onClick={onConfirm} className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-red-500 hover:bg-red-400 text-white rounded-2xl transition shadow-lg shadow-red-500/20 active:scale-[0.98]">
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminsTab({ currentAdminId, admins, onAdd, onRemove }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<Admin | null>(null);

  return (
    <div>
      {showAdd && <AddAdminModal onAdd={onAdd} onClose={() => setShowAdd(false)} />}
      {confirmRemove && (
        <ConfirmRemoveModal
          admin={confirmRemove}
          onConfirm={() => { onRemove(confirmRemove.id); setConfirmRemove(null); }}
          onClose={() => setConfirmRemove(null)}
        />
      )}

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[17px] font-bold text-white/95 tracking-tight">Administradores</h2>
          <p className="text-[11px] text-white/35 font-mono mt-0.5">{admins.length} admin{admins.length !== 1 ? 's' : ''} cadastrado{admins.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white text-[12px] font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] flex-shrink-0"
        >
          <PlusIcon /> Novo
        </button>
      </div>

      <div className="space-y-3">
        {admins.map(adm => {
          const isMe = adm.id === currentAdminId;
          const initials = adm.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          return (
            <div key={adm.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-orange-500/15 ring-1 ring-orange-500/20 flex items-center justify-center text-orange-400 text-[13px] font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white/90 font-semibold text-[14px]">{adm.name}</p>
                  {isMe && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25 rounded-full">
                      Você
                    </span>
                  )}
                </div>
                <p className="text-white/35 font-mono text-[12px] mt-0.5">Login: {adm.login}</p>
              </div>
              {!isMe && (
                <button
                  onClick={() => setConfirmRemove(adm)}
                  className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/8 rounded-xl transition flex-shrink-0"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
