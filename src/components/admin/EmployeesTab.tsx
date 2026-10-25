import { useState } from 'react';
import { Employee } from '../../types';
import { Badge, Field, Input, EmptyRow, PlusIcon, TrashIcon } from '../ui';

interface Props {
  employees: Employee[];
  onAdd: (emp: Omit<Employee, 'id'>) => void;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
  onSelect: (emp: Employee) => void;
  selectedId?: string;
}

const blank = { name: '', cpf: '', role: '', department: '', admissionDate: '', email: '', login: '', password: '', phone: '', active: true };

function AddEmployeeModal({ onAdd, onClose }: { onAdd: (emp: Omit<Employee, 'id'>) => void; onClose: () => void }) {
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
        className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl shadow-black/60 overflow-y-auto max-h-[92dvh]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            <h3 className="text-[15px] font-bold text-white/90">Cadastrar Funcionário</h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Nome Completo">
                <Input value={form.name} onChange={e => f('name', e.target.value)} placeholder="João da Silva" required className="min-h-[48px] text-base" />
              </Field>
            </div>
            <Field label="CPF">
              <Input value={form.cpf} onChange={e => f('cpf', e.target.value)} placeholder="000.000.000-00" required className="min-h-[48px]" />
            </Field>
            <Field label="Telefone">
              <Input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="(11) 99999-0000" required className="min-h-[48px]" />
            </Field>
            <Field label="Cargo">
              <Input value={form.role} onChange={e => f('role', e.target.value)} placeholder="Operador de Andaime" required className="min-h-[48px]" />
            </Field>
            <Field label="Departamento">
              <Input value={form.department} onChange={e => f('department', e.target.value)} placeholder="Operações" required className="min-h-[48px]" />
            </Field>
            <Field label="Data de Admissão">
              <Input type="date" value={form.admissionDate} onChange={e => f('admissionDate', e.target.value)} required className="min-h-[48px]" />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="joao@empresa.com" className="min-h-[48px]" />
            </Field>
          </div>

          {/* Access credentials section */}
          <div className="border border-orange-500/20 bg-orange-500/[0.04] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              <p className="text-[11px] font-bold text-orange-400 uppercase tracking-[0.12em]">Acesso ao Portal</p>
            </div>
            <p className="text-[11px] text-orange-300/50 -mt-1">Defina o login e senha que o funcionário usará para entrar no aplicativo.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Login">
                <Input value={form.login} onChange={e => f('login', e.target.value)} placeholder="Ex: joao.silva ou CPF" required className="min-h-[48px]" />
              </Field>
              <Field label="Senha">
                <Input type="password" value={form.password} onChange={e => f('password', e.target.value)} placeholder="Senha de acesso" required className="min-h-[48px]" />
              </Field>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 hover:text-white/80 border border-white/[0.09] hover:border-white/20 rounded-2xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-2xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]"
            >
              Salvar Funcionário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmRemoveModal({ employee, onConfirm, onClose }: { employee: Employee; onConfirm: () => void; onClose: () => void }) {
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
          <h3 className="text-[15px] font-bold text-white/90 mb-2">Remover Funcionário?</h3>
          <p className="text-[13px] text-white/45 leading-relaxed mb-6">
            <span className="text-white/70 font-semibold">{employee.name}</span> será removido permanentemente do sistema, incluindo todos os seus documentos, EPIs, NRs e ASOs.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-red-500 hover:bg-red-400 active:bg-red-600 text-white rounded-2xl transition shadow-lg shadow-red-500/20 active:scale-[0.98]"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeesTab({ employees, onAdd, onToggleActive, onRemove }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<Employee | null>(null);
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter(e => e.active).length;

  return (
    <div>
      {showAdd && <AddEmployeeModal onAdd={onAdd} onClose={() => setShowAdd(false)} />}
      {confirmRemove && (
        <ConfirmRemoveModal
          employee={confirmRemove}
          onConfirm={() => { onRemove(confirmRemove.id); setConfirmRemove(null); }}
          onClose={() => setConfirmRemove(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[17px] font-bold text-white/95 tracking-tight">Funcionários</h2>
          <p className="text-[11px] text-white/35 font-mono mt-0.5">{activeCount} ativos · {employees.length} total</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white text-[12px] font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] flex-shrink-0"
        >
          <PlusIcon /> Novo
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, cargo ou departamento..."
          className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 min-h-[48px] text-[13px] text-white/80 placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/15 transition"
        />
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-orange-500/15 ring-1 ring-orange-500/20 flex items-center justify-center text-orange-400 text-[13px] font-bold flex-shrink-0 overflow-hidden">
                {emp.photo ? <img src={emp.photo} alt="foto" className="w-full h-full object-cover" /> : emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 font-semibold text-[14px] truncate">{emp.name}</p>
                <p className="text-white/35 text-[12px] truncate">{emp.role} · {emp.department}</p>
              </div>
              <Badge variant={emp.active ? 'success' : 'danger'}>
                {emp.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4 text-[11px]">
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px]">CPF</p>
                <p className="text-white/50 font-mono">{emp.cpf}</p>
              </div>
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px]">Admissão</p>
                <p className="text-white/50 font-mono">{new Date(emp.admissionDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px]">Telefone</p>
                <p className="text-white/50 font-mono">{emp.phone}</p>
              </div>
              <div>
                <p className="text-white/20 uppercase tracking-wider font-bold text-[9px]">Login</p>
                <p className="text-orange-400/70 font-mono truncate">{emp.login || '—'}</p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-white/[0.06] pt-3">
              <button
                onClick={() => onToggleActive(emp.id)}
                className="flex-1 min-h-[44px] py-2.5 text-[12px] font-semibold text-white/45 border border-white/[0.09] rounded-xl transition hover:bg-white/[0.04] hover:text-white/70"
              >
                {emp.active ? 'Inativar' : 'Ativar'}
              </button>
              <button
                onClick={() => setConfirmRemove(emp)}
                className="min-h-[44px] px-4 py-2.5 text-[12px] font-semibold text-red-400/60 border border-red-500/15 rounded-xl transition hover:bg-red-500/8 hover:text-red-400 hover:border-red-500/30 flex items-center gap-2"
              >
                <TrashIcon /> Remover
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-white/20 text-sm">{search ? 'Nenhum resultado encontrado.' : 'Nenhum funcionário cadastrado.'}</p>
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-[#141414] border border-white/[0.07] rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <table className="w-full text-[13px]">
          <thead className="bg-[#111111] border-b border-white/[0.07]">
            <tr>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Funcionário</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden lg:table-cell">Cargo / Departamento</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden xl:table-cell">Admissão</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Status</th>
              <th className="w-36"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => (
              <tr key={emp.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-500/15 ring-1 ring-orange-500/20 flex items-center justify-center text-orange-400 text-[11px] font-semibold flex-shrink-0 overflow-hidden">
                      {emp.photo ? <img src={emp.photo} alt="foto" className="w-full h-full object-cover" /> : emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p className="text-white/85 font-medium">{emp.name}</p>
                      <p className="text-white/25 font-mono text-[11px]">{emp.cpf}</p>
                      {emp.login && <p className="text-orange-400/50 font-mono text-[10px]">login: {emp.login}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <p className="text-white/65">{emp.role}</p>
                  <p className="text-white/30 text-[11px]">{emp.department}</p>
                </td>
                <td className="px-4 py-3.5 hidden xl:table-cell">
                  <span className="font-mono text-white/35 text-[11px]">{new Date(emp.admissionDate).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={emp.active ? 'success' : 'danger'}>
                    {emp.active ? '● Ativo' : '○ Inativo'}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleActive(emp.id)}
                      className="px-2.5 py-1.5 min-h-[36px] text-[11px] text-white/35 hover:text-white/70 border border-white/[0.07] hover:border-white/15 rounded-lg transition"
                    >
                      {emp.active ? 'Inativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => setConfirmRemove(emp)}
                      className="w-9 h-9 flex items-center justify-center text-white/25 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/8 rounded-lg transition"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <EmptyRow cols={5} message={search ? 'Nenhum resultado encontrado.' : 'Nenhum funcionário cadastrado.'} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
