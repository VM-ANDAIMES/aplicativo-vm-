import { useState } from 'react';
import { Aviso } from '../../types';
import { PlusIcon, TrashIcon } from '../ui';

interface Props {
  avisos: Aviso[];
  onAdd: (aviso: Omit<Aviso, 'id' | 'createdAt'>) => void;
  onRemove: (id: string) => void;
}

function AddAvisoModal({ onAdd, onClose }: { onAdd: Props['onAdd']; onClose: () => void }) {
  const [form, setForm] = useState({ title: '', message: '', priority: 'normal' as 'normal' | 'urgent' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div
        className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl overflow-y-auto max-h-[92dvh]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            <h3 className="text-[15px] font-bold text-white/90">Novo Aviso</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] rounded-xl transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">Prioridade</label>
            <div className="flex gap-2">
              {([['normal', 'Normal'], ['urgent', '⚠️ Urgente']] as const).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, priority: val }))}
                  className={`flex-1 py-2.5 min-h-[44px] text-[12px] font-bold rounded-xl border transition ${
                    form.priority === val
                      ? val === 'urgent'
                        ? 'bg-red-500/15 border-red-500/40 text-red-400'
                        : 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                      : 'border-white/[0.09] text-white/35 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">Título</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Ex: Reunião obrigatória na sexta-feira"
              required
              className="w-full bg-[#0d0d0d] border border-white/[0.09] rounded-xl px-3.5 py-3 min-h-[48px] text-[14px] text-white/90 placeholder-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15 transition"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">Mensagem</label>
            <textarea
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              placeholder="Descreva o aviso em detalhes..."
              required
              rows={4}
              className="w-full bg-[#0d0d0d] border border-white/[0.09] rounded-xl px-3.5 py-3 text-[14px] text-white/90 placeholder-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15 transition resize-none"
            />
          </div>
          <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-[11px] text-blue-300/70">Este aviso será enviado para <strong className="text-blue-300">todos os funcionários</strong> via notificação.</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">Cancelar</button>
            <button type="submit" className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-orange-500 hover:bg-orange-400 text-white rounded-2xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]">Publicar Aviso</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AvisosTab({ avisos, onAdd, onRemove }: Props) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      {showAdd && <AddAvisoModal onAdd={onAdd} onClose={() => setShowAdd(false)} />}

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[17px] font-bold text-white/95 tracking-tight">Avisos</h2>
          <p className="text-[11px] text-white/35 font-mono mt-0.5">Enviados para todos os funcionários</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-orange-500 hover:bg-orange-400 text-white text-[12px] font-bold rounded-xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98] flex-shrink-0"
        >
          <PlusIcon /> Novo Aviso
        </button>
      </div>

      <div className="space-y-3">
        {avisos.map(aviso => (
          <div
            key={aviso.id}
            className={`bg-[#141414] border rounded-2xl p-4 ${
              aviso.priority === 'urgent' ? 'border-red-500/25' : 'border-white/[0.07]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                aviso.priority === 'urgent' ? 'bg-red-500/15' : 'bg-orange-500/15'
              }`}>
                {aviso.priority === 'urgent' ? '⚠️' : '📢'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white/90 font-semibold text-[14px]">{aviso.title}</p>
                  {aviso.priority === 'urgent' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/25 rounded-full">Urgente</span>
                  )}
                </div>
                <p className="text-white/45 text-[13px] leading-relaxed">{aviso.message}</p>
                <p className="text-white/20 font-mono text-[10px] mt-2">
                  {new Date(aviso.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => onRemove(aviso.id)}
                className="w-9 h-9 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition flex-shrink-0"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        {avisos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-2xl">📢</div>
            <p className="text-white/20 text-sm">Nenhum aviso publicado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
