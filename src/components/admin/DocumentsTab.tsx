import { useState } from 'react';
import { Employee, HRDocument, DocumentType } from '../../types';
import { Badge, Field, Input, Select, FilterSelect, PlusIcon, TrashIcon, CheckIcon } from '../ui';

interface Props {
  employees: Employee[];
  documents: HRDocument[];
  onAdd: (doc: Omit<HRDocument, 'id' | 'uploadedAt'>) => void;
  onRemove: (id: string) => void;
  onSelectEmployee?: (emp: Employee) => void;
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'holerite', label: 'Holerite' },
  { value: 'espelho-ponto', label: 'Espelho de Ponto' },
  { value: 'rescisao', label: 'Rescisão' },
];

const typeLabel = (t: DocumentType) => DOC_TYPES.find(d => d.value === t)?.label ?? t;

const DOC_ICONS: Record<DocumentType, string> = {
  holerite: '💰',
  'espelho-ponto': '🕐',
  rescisao: '📋',
};

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

function AddDocModal({ employees, onAdd, onClose }: { employees: Employee[]; onAdd: Props['onAdd']; onClose: () => void }) {
  const [form, setForm] = useState<{
    employeeId: string; type: DocumentType; month: string; year: number; fileName: string;
  }>({ employeeId: '', type: 'holerite', month: MONTHS[new Date().getMonth()], year: new Date().getFullYear(), fileName: '' });
  const { pdfData, pdfName, handleFile } = usePDFUpload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = DOC_TYPES.find(t => t.value === form.type)?.label ?? form.type;
    onAdd({ ...form, fileName: pdfName || `${typeLabel}-${form.month}-${form.year}.pdf`, pdfUrl: pdfData });
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
            <h3 className="text-[15px] font-bold text-white/90">Anexar Documento</h3>
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
          <Field label="Tipo de Documento">
            <Select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as DocumentType }))}>
              {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mês">
              <Select value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </Select>
            </Field>
            <Field label="Ano">
              <Input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))} />
            </Field>
          </div>
          <PDFUploadField pdfName={pdfName} onChange={handleFile} hint="O funcionário visualizará o documento antes de assinar." />
          <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <p className="text-[11px] text-orange-300/70">O funcionário receberá uma notificação assim que este documento for salvo.</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 min-h-[52px] py-3 text-[13px] font-semibold text-white/50 border border-white/[0.09] rounded-2xl transition hover:bg-white/[0.04]">Cancelar</button>
            <button type="submit" className="flex-1 min-h-[52px] py-3 text-[13px] font-bold bg-orange-500 hover:bg-orange-400 text-white rounded-2xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DocumentsTab({ employees, documents, onAdd, onRemove, onSelectEmployee }: Props) {
  const [filterEmp, setFilterEmp] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = documents.filter(d =>
    (!filterEmp || d.employeeId === filterEmp) &&
    (!filterType || d.type === filterType)
  );
  const getEmp = (id: string) => employees.find(e => e.id === id);
  const empName = (id: string) => getEmp(id)?.name ?? id;
  const EmpLink = ({ id }: { id: string }) => {
    const emp = getEmp(id);
    if (!emp || !onSelectEmployee) return <span className="text-white/55">{empName(id)}</span>;
    return (
      <button onClick={() => onSelectEmployee(emp)} className="text-white/80 hover:text-orange-400 font-medium transition underline-offset-2 hover:underline text-left">
        {emp.name}
      </button>
    );
  };

  return (
    <div>
      {showAdd && <AddDocModal employees={employees} onAdd={onAdd} onClose={() => setShowAdd(false)} />}

      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-[17px] font-bold text-white/95 tracking-tight">Documentos</h2>
          <p className="text-[11px] text-white/35 font-mono mt-0.5">{filtered.length} documento{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterSelect value={filterEmp} onChange={setFilterEmp}>
            <option value="">Todos os funcionários</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </FilterSelect>
          <FilterSelect value={filterType} onChange={setFilterType}>
            <option value="">Todos os tipos</option>
            {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </FilterSelect>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-orange-500 hover:bg-orange-400 text-white text-[12px] font-bold rounded-xl transition shadow-lg shadow-orange-500/25 active:scale-[0.98]"
          >
            <PlusIcon /> Anexar
          </button>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1e1e1e] flex items-center justify-center text-lg flex-shrink-0">
                {DOC_ICONS[doc.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/85 font-semibold text-[13px]">{typeLabel(doc.type)}</p>
                <p className="text-white/35 text-[11px] font-mono truncate">{doc.fileName}</p>
                <p className="text-white/25 text-[11px] mt-1"><EmpLink id={doc.employeeId} /> · {doc.month}/{doc.year}</p>
              </div>
              <button onClick={() => onRemove(doc.id)} className="w-9 h-9 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-xl transition flex-shrink-0">
                <TrashIcon />
              </button>
            </div>
            <div className="mt-3">
              {doc.signedAt
                ? <Badge variant="success"><CheckIcon /> Assinado em {new Date(doc.signedAt).toLocaleDateString('pt-BR')}</Badge>
                : <Badge variant="warning">Aguardando assinatura</Badge>
              }
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-14 text-white/20 text-sm">Nenhum documento encontrado.</div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-[#141414] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[#111111] border-b border-white/[0.07]">
            <tr>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Documento</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] hidden md:table-cell">Funcionário</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Período</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.14em]">Assinatura</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(doc => (
              <tr key={doc.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.025] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] flex items-center justify-center text-base flex-shrink-0">
                      {DOC_ICONS[doc.type]}
                    </div>
                    <div>
                      <p className="text-white/80 font-medium">{typeLabel(doc.type)}</p>
                      <p className="text-white/25 font-mono text-[11px] truncate max-w-[140px]">{doc.fileName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell"><EmpLink id={doc.employeeId} /></td>
                <td className="px-4 py-3.5"><span className="font-mono text-white/35 text-[11px]">{doc.month}/{doc.year}</span></td>
                <td className="px-4 py-3.5">
                  {doc.signedAt
                    ? <Badge variant="success"><CheckIcon /> Assinado em {new Date(doc.signedAt).toLocaleDateString('pt-BR')}</Badge>
                    : <Badge variant="warning">Aguardando</Badge>
                  }
                </td>
                <td className="px-4 py-3.5">
                  <button onClick={() => onRemove(doc.id)} className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-14 text-center text-white/20 text-sm">Nenhum documento encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
