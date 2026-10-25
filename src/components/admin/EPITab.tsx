import { useState } from 'react';
import { Employee, EPI } from '../../types';
import { Badge, Field, Input, Select, FilterSelect, PlusIcon, TrashIcon, CheckIcon } from '../ui';

interface Props {
  employees: Employee[];
  epis: EPI[];
  onAdd: (epi: Omit<EPI, 'id'>) => void;
  onRemove: (id: string) => void;
  onSelectEmployee?: (emp: Employee) => void;
}

const daysDiff = (date: string) => (new Date(date).getTime() - Date.now()) / 86400000;

function usePDFUpload() {
  const [pdfData, setPdfData] = useState<string | undefined>();
  const [pdfName, setPdfName] = useState('');
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setPdfData(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  return { pdfData, pdfName, handleFile };
}

function PDFUploadField({ pdfName, onChange, hint }: { pdfName: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; hint: string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] mb-1.5">Arquivo PDF (opcional)</label>
      <label className={`flex items-center gap-3 w-full min-h-[52px] px-4 rounded-xl border cursor-pointer transition ${
        pdfName
          ? 'bg-green-500/8 border-green-500/25 hover:border-green-500/40'
          : 'bg-[#0d0d0d] border-white/[0.09] hover:border-orange-500/40'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${pdfName ? 'bg-green-500/15' : 'bg-white/[0.05]'}`}>
          {pdfName
            ? <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-medium truncate ${pdfName ? 'text-green-300/80' : 'text-white/25'}`}>
            {pdfName || 'Selecionar PDF do dispositivo'}
          </p>
          <p className="text-[10px] text-white/20 mt-0.5">{hint}</p>
        </div>
        <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
}

function AddEPIModal({ employees, onAdd, onClose }: { employees: Employee[]; onAdd: Props['onAdd']; onClose: () => void }) {
  const [form, setForm] = useState({ employeeId: '', name: '', ca: '', quantity: 1, deliveryDate: '', expirationDate: '', signed: false });
  const { pdfData, pdfName, handleFile } = usePDFUpload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form, pdfUrl: pdfData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl overflow-y-auto max-h-[92dvh]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-white/20 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded-full" />
            <h3 className="text-[15px] font-bold text-white/90">Registrar EPI</h3>
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
          <Field label="Nome do EPI">
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Capacete de Segurança" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CA">
              <Input value={form.ca} onChange={e => setForm(p => ({ ...p, ca: e.target.value }))} placeholder="CA 00000" required />
            </Field>
            <Field label="Quantidade">
              <Input type="number" min={1} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: Number(e.target.value) }))} />
            </Field>
            <Field label="Data de Entrega">
              <Input type="date" value={form.deliveryDate} onChange={e => setForm(p => ({ ...p, deliveryDate: e.target.value }))} required />
            </Field>
            <Field label="Validade">
              <Input type="date" value={form.expirationDate} onChange={e => setForm(p => ({ ...p, expirationDate: e.target.value }))} required />
            </Field>
          </div>
          <PDFUploadField pdfName={pdfName} onChange={handleFile} hint="O funcionário visualizará antes de assinar o recibo." />
          <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <p className="text-[11px] text-orange-300/70">O funcionário receberá notificação e deverá assinar o recibo de recebimento.</p>
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

function ConfirmRemove({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 bg-white/20 rounded-full" /></div>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">🦺</div>
          <h3 className="text-[15px] font-bold text-white/90 mb-2">Remover EPI?</h3>
          <p className="text-[13px] text-white/45 mb-6">O registro de <span className="text-white/70 font-semibold">"{name}"</span> será removido permanentemente.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">Cancelar</button>
            <button onClick={onConfirm} className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-red-500 hover:bg-red-400 text-white rounded-2xl transition shadow-lg shadow-red-500/20 active:scale-[0.98]">Remover</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EPITab({ employees, epis, onAdd, onRemove, onSelectEmployee }: Props) {
  const [filterEmp, setFilterEmp] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<EPI | null>(null);

  const filtered = epis.filter(e => !filterEmp || e.employeeId === filterEmp);
  const getEmp = (id: string) => employees.find(e => e.id === id);
  const empName = (id: string) => getEmp(id)?.name ?? id;
  const EmpLink = ({ id }: { id: string }) => {
    const emp = getEmp(id);
    if (!emp || !onSelectEmployee) return <span className="text-white/55">{empName(id)}</span>;
    return <button onClick={() => onSelectEmployee(emp)} className="text-white/80 hover:text-orange-400 font-medium transition hover:underline underline-offset-2 text-left">{emp.name}</button>;
  };

  const expiryBadge = (date: string) => {
    const d = daysDiff(date);
    if (d < 0) return <Badge variant="danger">Vencido</Badge>;
    if (d <= 60) return <Badge variant="warning">Vence em {Math.round(d)}d</Badge>;
    return <span className="text-white/30 font-mono text-[11px]">{new Date(date).toLocaleDateString('pt-BR')}</span>;
  };

  return (
    <div>
      {showAdd && <AddEPIModal employees={employees} onAdd={onAdd} onClose={() => setShowAdd(false)} />}
      {confirmRemove && (
        <ConfirmRemove
          name={confirmRemove.name}
          onConfirm={() => { onRemove(confirmRemove.id); setConfirmRemove(null); }}
          onClose={() => setConfirmRemove(null)}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-[17px] font-bold text-white/95 tracking-tight">Controle de EPI</h2>
          <p className="text-[11px] text-white/35 font-mono mt-0.5">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterSelect value={filterEmp} onChange={setFilterEmp}>
            <option value="">Todos os funcionários</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </FilterSelect>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-orange-500 hover:bg-orange-400 text-white text-[12px] font-bold rounded-xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]">
            <PlusIcon /> Registrar EPI
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map(epi => (
          <div key={epi.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg flex-shrink-0">🦺</div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 font-semibold text-[14px]">{epi.name}</p>
                <p className="text-white/35 text-[12px]"><EmpLink id={epi.employeeId} /></p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-white/30 font-mono">
                  <span>{epi.ca}</span><span>·</span><span>Qtd {epi.quantity}</span>
                </div>
              </div>
              <button onClick={() => setConfirmRemove(epi)} className="w-9 h-9 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition flex-shrink-0">
                <TrashIcon />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
              <div>{expiryBadge(epi.expirationDate)}</div>
              {epi.signed ? <Badge variant="success"><CheckIcon /> Assinado</Badge> : <Badge variant="warning">Aguardando assinatura</Badge>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-14 text-white/20 text-sm">Nenhum EPI registrado.</div>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-[#141414] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[#111111] border-b border-white/[0.07]">
            <tr>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Equipamento</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden md:table-cell">Funcionário</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden lg:table-cell">CA / Qtd</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Validade</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Recibo</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(epi => (
              <tr key={epi.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span>🦺</span>
                    <p className="text-white/80 font-medium">{epi.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell"><EmpLink id={epi.employeeId} /></td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <p className="font-mono text-white/35 text-[11px]">{epi.ca}</p>
                  <p className="text-white/25 text-[11px]">Qtd {epi.quantity}</p>
                </td>
                <td className="px-4 py-3.5">{expiryBadge(epi.expirationDate)}</td>
                <td className="px-4 py-3.5">
                  {epi.signed ? <Badge variant="success"><CheckIcon /> Assinado</Badge> : <Badge variant="warning">Aguardando</Badge>}
                </td>
                <td className="px-4 py-3.5">
                  <button onClick={() => setConfirmRemove(epi)} className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-14 text-center text-white/20 text-sm">Nenhum EPI registrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
