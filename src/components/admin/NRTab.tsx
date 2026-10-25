import { useState } from 'react';
import { Employee, NR } from '../../types';
import { Badge, Field, Input, Select, FilterSelect, PlusIcon, TrashIcon } from '../ui';

interface Props { employees: Employee[]; nrs: NR[]; onAdd: (nr: Omit<NR, 'id' | 'status'>) => void; onRemove: (id: string) => void; onSelectEmployee?: (emp: Employee) => void; }

const NR_LIST = [
  { number: 'NR-01', name: 'Disposições Gerais e Gerenciamento de Riscos' },
  { number: 'NR-05', name: 'CIPA' },
  { number: 'NR-06', name: 'Equipamentos de Proteção Individual' },
  { number: 'NR-07', name: 'PCMSO' },
  { number: 'NR-09', name: 'Avaliação e Controle das Exposições Ocupacionais' },
  { number: 'NR-10', name: 'Segurança em Instalações Elétricas' },
  { number: 'NR-11', name: 'Transporte, Movimentação e Armazenagem' },
  { number: 'NR-12', name: 'Segurança em Máquinas e Equipamentos' },
  { number: 'NR-17', name: 'Ergonomia' },
  { number: 'NR-18', name: 'Segurança na Construção Civil' },
  { number: 'NR-20', name: 'Inflamáveis e Combustíveis' },
  { number: 'NR-23', name: 'Proteção Contra Incêndios' },
  { number: 'NR-33', name: 'Espaços Confinados' },
  { number: 'NR-35', name: 'Trabalho em Altura' },
];

const nrStatus = (date: string): NR['status'] => {
  const d = (new Date(date).getTime() - Date.now()) / 86400000;
  return d < 0 ? 'expired' : d <= 60 ? 'expiring' : 'valid';
};

function AddNRModal({ employees, onAdd, onClose }: { employees: Employee[]; onAdd: Props['onAdd']; onClose: () => void }) {
  const [form, setForm] = useState({ employeeId: '', number: 'NR-06', name: NR_LIST[2].name, trainingDate: '', expirationDate: '', instructor: '', cargaHoraria: 8 });

  const handleNRSelect = (num: string) => {
    const nr = NR_LIST.find(n => n.number === num);
    setForm(p => ({ ...p, number: num, name: nr?.name ?? '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl overflow-y-auto max-h-[92dvh]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-white/20 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            <h3 className="text-[15px] font-bold text-white/90">Registrar Treinamento NR</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] rounded-xl transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Funcionário">
            <Select value={form.employeeId} onChange={e => setForm(p => ({ ...p, employeeId: e.target.value }))} required>
              <option value="">Selecionar funcionário...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </Select>
          </Field>
          <Field label="Norma Regulamentadora">
            <Select value={form.number} onChange={e => handleNRSelect(e.target.value)}>
              {NR_LIST.map(n => <option key={n.number} value={n.number}>{n.number} — {n.name}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Instrutor Responsável">
              <Input value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))} placeholder="Nome do instrutor" required />
            </Field>
            <Field label="Carga Horária (h)">
              <Input type="number" min={1} value={form.cargaHoraria} onChange={e => setForm(p => ({ ...p, cargaHoraria: Number(e.target.value) }))} />
            </Field>
            <Field label="Data do Treinamento">
              <Input type="date" value={form.trainingDate} onChange={e => setForm(p => ({ ...p, trainingDate: e.target.value }))} required />
            </Field>
            <Field label="Validade">
              <Input type="date" value={form.expirationDate} onChange={e => setForm(p => ({ ...p, expirationDate: e.target.value }))} required />
            </Field>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">Cancelar</button>
            <button type="submit" className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-orange-500 hover:bg-orange-400 text-white rounded-2xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmRemove({ nr, onConfirm, onClose }: { nr: NR; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-white/20 rounded-full" /></div>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">📖</div>
          <h3 className="text-[15px] font-bold text-white/90 mb-2">Remover Treinamento?</h3>
          <p className="text-[13px] text-white/45 mb-6">O registro de <span className="text-white/70 font-semibold">{nr.number} — {nr.name}</span> será removido permanentemente.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-red-500 hover:bg-red-400 text-white rounded-2xl transition shadow-lg shadow-red-500/20 active:scale-[0.98]">Remover</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const statusBadge = (date: string) => {
  const s = nrStatus(date);
  if (s === 'expired') return <Badge variant="danger">Vencida</Badge>;
  if (s === 'expiring') return <Badge variant="warning">A vencer</Badge>;
  return <Badge variant="success">Válida</Badge>;
};

export default function NRTab({ employees, nrs, onAdd, onRemove, onSelectEmployee }: Props) {
  const [filterEmp, setFilterEmp] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<NR | null>(null);

  const filtered = nrs.filter(n => !filterEmp || n.employeeId === filterEmp);
  const getEmp = (id: string) => employees.find(e => e.id === id);
  const empName = (id: string) => getEmp(id)?.name ?? id;
  const EmpLink = ({ id }: { id: string }) => {
    const emp = getEmp(id);
    if (!emp || !onSelectEmployee) return <span className="text-white/55">{empName(id)}</span>;
    return <button onClick={() => onSelectEmployee(emp)} className="text-white/80 hover:text-orange-400 font-medium transition hover:underline underline-offset-2 text-left">{emp.name}</button>;
  };

  return (
    <div>
      {showAdd && <AddNRModal employees={employees} onAdd={onAdd} onClose={() => setShowAdd(false)} />}
      {confirmRemove && (
        <ConfirmRemove
          nr={confirmRemove}
          onConfirm={() => { onRemove(confirmRemove.id); setConfirmRemove(null); }}
          onClose={() => setConfirmRemove(null)}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-[17px] font-bold text-white/95 tracking-tight">Normas Regulamentadoras</h2>
          <p className="text-[11px] text-white/35 font-mono mt-0.5">{filtered.length} treinamento{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterSelect value={filterEmp} onChange={setFilterEmp}>
            <option value="">Todos os funcionários</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </FilterSelect>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-orange-500 hover:bg-orange-400 text-white text-[12px] font-bold rounded-xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]">
            <PlusIcon /> Registrar
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map(nr => (
          <div key={nr.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg flex-shrink-0">📖</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono font-bold text-orange-400 text-[13px]">{nr.number}</span>
                  {statusBadge(nr.expirationDate)}
                </div>
                <p className="text-white/55 text-[12px] truncate">{nr.name}</p>
                <p className="text-white/30 text-[11px] mt-1"><EmpLink id={nr.employeeId} /></p>
              </div>
              <button onClick={() => setConfirmRemove(nr)} className="w-9 h-9 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition flex-shrink-0">
                <TrashIcon />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/[0.05] text-[11px]">
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Instrutor</p>
                <p className="text-white/45">{nr.instructor} · {nr.cargaHoraria}h</p>
              </div>
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Validade</p>
                <p className="text-white/45 font-mono">{new Date(nr.expirationDate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-14 text-white/20 text-sm">Nenhum treinamento registrado.</div>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-[#141414] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[#111111] border-b border-white/[0.07]">
            <tr>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Norma</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden md:table-cell">Funcionário</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden lg:table-cell">Instrutor</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Validade</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Status</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(nr => (
              <tr key={nr.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors">
                <td className="px-4 py-3.5">
                  <p className="font-mono font-semibold text-orange-400 text-[12px]">{nr.number}</p>
                  <p className="text-white/35 text-[11px] max-w-[180px] truncate">{nr.name}</p>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell"><EmpLink id={nr.employeeId} /></td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <p className="text-white/45">{nr.instructor}</p>
                  <p className="text-white/25 font-mono text-[11px]">{nr.cargaHoraria}h</p>
                </td>
                <td className="px-4 py-3.5"><span className="font-mono text-white/35 text-[11px]">{new Date(nr.expirationDate).toLocaleDateString('pt-BR')}</span></td>
                <td className="px-4 py-3.5">{statusBadge(nr.expirationDate)}</td>
                <td className="px-4 py-3.5">
                  <button onClick={() => setConfirmRemove(nr)} className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-14 text-center text-white/20 text-sm">Nenhum treinamento registrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
