import { useState } from 'react';
import { Employee, ASO, ASOType } from '../../types';
import { Badge, Field, Input, Select, FilterSelect, PlusIcon, TrashIcon } from '../ui';

interface Props { employees: Employee[]; asos: ASO[]; onAdd: (aso: Omit<ASO, 'id'>) => void; onRemove: (id: string) => void; onSelectEmployee?: (emp: Employee) => void; }

const ASO_TYPES: { value: ASOType; label: string }[] = [
  { value: 'admissional', label: 'Admissional' },
  { value: 'periodico', label: 'Periódico' },
  { value: 'retorno', label: 'Retorno ao Trabalho' },
  { value: 'mudanca', label: 'Mudança de Função' },
  { value: 'demissional', label: 'Demissional' },
];

function AddASOModal({ employees, onAdd, onClose }: { employees: Employee[]; onAdd: Props['onAdd']; onClose: () => void }) {
  const [form, setForm] = useState({ employeeId: '', type: 'admissional' as ASOType, date: '', physician: '', crm: '', result: 'apto' as 'apto' | 'inapto', nextDate: '', fileName: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form, nextDate: form.nextDate || undefined, fileName: form.fileName || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl overflow-y-auto max-h-[92dvh]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-white/20 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            <h3 className="text-[15px] font-bold text-white/90">Registrar ASO</h3>
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo de ASO">
              <Select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as ASOType }))}>
                {ASO_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </Field>
            <Field label="Resultado">
              <Select value={form.result} onChange={e => setForm(p => ({ ...p, result: e.target.value as 'apto' | 'inapto' }))}>
                <option value="apto">Apto</option>
                <option value="inapto">Inapto</option>
              </Select>
            </Field>
            <Field label="Médico Responsável">
              <Input value={form.physician} onChange={e => setForm(p => ({ ...p, physician: e.target.value }))} placeholder="Dr. Nome Sobrenome" required />
            </Field>
            <Field label="CRM">
              <Input value={form.crm} onChange={e => setForm(p => ({ ...p, crm: e.target.value }))} placeholder="CRM-SP 000000" required />
            </Field>
            <Field label="Data do Exame">
              <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            </Field>
            <Field label="Próximo Exame (opcional)">
              <Input type="date" value={form.nextDate} onChange={e => setForm(p => ({ ...p, nextDate: e.target.value }))} />
            </Field>
          </div>
          <Field label="Arquivo (opcional)">
            <Input value={form.fileName} onChange={e => setForm(p => ({ ...p, fileName: e.target.value }))} placeholder="aso_nome_tipo.pdf" />
          </Field>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">Cancelar</button>
            <button type="submit" className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-orange-500 hover:bg-orange-400 text-white rounded-2xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]">Salvar ASO</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmRemove({ aso, empName, onConfirm, onClose }: { aso: ASO; empName: string; onConfirm: () => void; onClose: () => void }) {
  const label = ASO_TYPES.find(t => t.value === aso.type)?.label ?? aso.type;
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-white/20 rounded-full" /></div>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">🏥</div>
          <h3 className="text-[15px] font-bold text-white/90 mb-2">Remover ASO?</h3>
          <p className="text-[13px] text-white/45 mb-6">ASO <span className="text-white/70 font-semibold">{label}</span> de <span className="text-white/70 font-semibold">{empName}</span> será removido permanentemente.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-red-500 hover:bg-red-400 text-white rounded-2xl transition shadow-lg shadow-red-500/20 active:scale-[0.98]">Remover</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const nextStatus = (d?: string) => {
  if (!d) return null;
  const diff = (new Date(d).getTime() - Date.now()) / 86400000;
  if (diff < 0) return <Badge variant="danger">Vencido</Badge>;
  if (diff <= 60) return <Badge variant="warning">Em {Math.round(diff)}d</Badge>;
  return <span className="font-mono text-white/30 text-[11px]">{new Date(d).toLocaleDateString('pt-BR')}</span>;
};

export default function ASOTab({ employees, asos, onAdd, onRemove, onSelectEmployee }: Props) {
  const [filterEmp, setFilterEmp] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<ASO | null>(null);

  const filtered = asos.filter(a => !filterEmp || a.employeeId === filterEmp);
  const getEmp = (id: string) => employees.find(e => e.id === id);
  const empName = (id: string) => getEmp(id)?.name ?? id;
  const typeLabel = (v: string) => ASO_TYPES.find(t => t.value === v)?.label ?? v;
  const EmpLink = ({ id }: { id: string }) => {
    const emp = getEmp(id);
    if (!emp || !onSelectEmployee) return <span className="text-white/55">{empName(id)}</span>;
    return <button onClick={() => onSelectEmployee(emp)} className="text-white/80 hover:text-orange-400 font-medium transition hover:underline underline-offset-2 text-left">{emp.name}</button>;
  };

  return (
    <div>
      {showAdd && <AddASOModal employees={employees} onAdd={onAdd} onClose={() => setShowAdd(false)} />}
      {confirmRemove && (
        <ConfirmRemove
          aso={confirmRemove}
          empName={empName(confirmRemove.employeeId)}
          onConfirm={() => { onRemove(confirmRemove.id); setConfirmRemove(null); }}
          onClose={() => setConfirmRemove(null)}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-[17px] font-bold text-white/95 tracking-tight">Saúde Ocupacional — ASO</h2>
          <p className="text-[11px] text-white/35 font-mono mt-0.5">{filtered.length} atestado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterSelect value={filterEmp} onChange={setFilterEmp}>
            <option value="">Todos os funcionários</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </FilterSelect>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-orange-500 hover:bg-orange-400 text-white text-[12px] font-bold rounded-xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]">
            <PlusIcon /> Registrar ASO
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map(aso => (
          <div key={aso.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg flex-shrink-0">🏥</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="blue">{typeLabel(aso.type)}</Badge>
                  <Badge variant={aso.result === 'apto' ? 'success' : 'danger'}>{aso.result === 'apto' ? 'Apto' : 'Inapto'}</Badge>
                </div>
                <p className="text-[12px]"><EmpLink id={aso.employeeId} /></p>
              </div>
              <button onClick={() => setConfirmRemove(aso)} className="w-9 h-9 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition flex-shrink-0">
                <TrashIcon />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/[0.05] text-[11px]">
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Médico</p>
                <p className="text-white/45">{aso.physician}</p>
                <p className="text-white/25 font-mono">{aso.crm}</p>
              </div>
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Data / Próximo</p>
                <p className="text-white/45 font-mono">{new Date(aso.date).toLocaleDateString('pt-BR')}</p>
                {aso.nextDate && <p className="text-white/25 font-mono">{new Date(aso.nextDate).toLocaleDateString('pt-BR')}</p>}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-14 text-white/20 text-sm">Nenhum ASO registrado.</div>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-[#141414] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[#111111] border-b border-white/[0.07]">
            <tr>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Tipo</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden md:table-cell">Funcionário</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden lg:table-cell">Médico</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Data</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Resultado</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden md:table-cell">Próximo</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(aso => (
              <tr key={aso.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors">
                <td className="px-4 py-3.5"><Badge variant="blue">{typeLabel(aso.type)}</Badge></td>
                <td className="px-4 py-3.5 hidden md:table-cell"><EmpLink id={aso.employeeId} /></td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <p className="text-white/50">{aso.physician}</p>
                  <p className="text-white/25 font-mono text-[11px]">{aso.crm}</p>
                </td>
                <td className="px-4 py-3.5"><span className="font-mono text-white/35 text-[11px]">{new Date(aso.date).toLocaleDateString('pt-BR')}</span></td>
                <td className="px-4 py-3.5">
                  <Badge variant={aso.result === 'apto' ? 'success' : 'danger'}>{aso.result === 'apto' ? 'Apto' : 'Inapto'}</Badge>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">{nextStatus(aso.nextDate) ?? <span className="text-white/20">—</span>}</td>
                <td className="px-4 py-3.5">
                  <button onClick={() => setConfirmRemove(aso)} className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-14 text-center text-white/20 text-sm">Nenhum ASO registrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
