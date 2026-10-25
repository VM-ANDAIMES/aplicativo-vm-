import { useEffect, useRef } from 'react';
import { Employee, HRDocument, EPI, NR, ASO } from '../../types';
import { Badge, CheckIcon } from '../ui';

interface Props {
  employee: Employee;
  documents: HRDocument[];
  epis: EPI[];
  nrs: NR[];
  asos: ASO[];
  onClose: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  holerite: 'Holerite',
  'espelho-ponto': 'Espelho de Ponto',
  rescisao: 'Rescisão',
  admissional: 'Admissional',
  periodico: 'Periódico',
  retorno: 'Retorno ao Trabalho',
  mudanca: 'Mudança de Função',
  demissional: 'Demissional',
};
const DOC_ICONS: Record<string, string> = { holerite: '💰', 'espelho-ponto': '🕐', rescisao: '📋' };

const nrStatusBadge = (date: string) => {
  const diff = (new Date(date).getTime() - Date.now()) / 86400000;
  if (diff < 0) return <Badge variant="danger">Vencida</Badge>;
  if (diff <= 60) return <Badge variant="warning">A vencer</Badge>;
  return <Badge variant="success">Válida</Badge>;
};

function openPDF(pdfUrl: string, title: string) {
  try {
    const [header, b64] = pdfUrl.split(',');
    const mime = header.match(/:(.*?);/)![1];
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (!w) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } catch {
    window.open(pdfUrl, '_blank');
  }
}

function Section({ title, icon, count, children }: { title: string; icon: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <h4 className="text-[13px] font-bold text-white/80">{title}</h4>
        <span className="text-[11px] font-mono text-white/25 ml-1">{count}</span>
        <div className="flex-1 h-px bg-white/[0.06] ml-2" />
      </div>
      {children}
    </div>
  );
}

export default function EmployeeProfileModal({ employee, documents, epis, nrs, asos, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initials = employee.name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const pendingDocs = documents.filter(d => !d.signedAt).length;
  const pendingEPIs = epis.filter(e => !e.signed).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={scrollRef}
        className="relative bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          maxHeight: '92dvh',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-3 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 ring-2 ring-orange-500/30 flex items-center justify-center text-orange-300 font-extrabold text-base flex-shrink-0 overflow-hidden">
              {employee.photo
                ? <img src={employee.photo} alt="foto" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/95 font-extrabold text-[16px] leading-tight truncate">{employee.name}</p>
              <p className="text-white/35 text-[12px] mt-0.5">{employee.role} · {employee.department}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] rounded-xl transition flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Info row */}
          <div className="flex gap-5 mt-3 flex-wrap">
            {[
              { label: 'CPF', value: employee.cpf },
              { label: 'Login', value: employee.login },
              { label: 'Admissão', value: new Date(employee.admissionDate).toLocaleDateString('pt-BR') },
              { label: 'Telefone', value: employee.phone },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[9px] text-white/20 uppercase tracking-[0.16em] font-bold mb-0.5">{f.label}</p>
                <p className="text-[11px] text-white/50 font-mono">{f.value}</p>
              </div>
            ))}
            <div>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.16em] font-bold mb-0.5">Status</p>
              {employee.active ? <Badge variant="success">Ativo</Badge> : <Badge variant="danger">Inativo</Badge>}
            </div>
          </div>

          {/* Pending summary */}
          {(pendingDocs > 0 || pendingEPIs > 0) && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {pendingDocs > 0 && <span className="px-2 py-1 text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/20 rounded-lg">{pendingDocs} doc{pendingDocs > 1 ? 's' : ''} p/ assinar</span>}
              {pendingEPIs > 0 && <span className="px-2 py-1 text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/20 rounded-lg">{pendingEPIs} EPI p/ assinar</span>}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">

          {/* Documents */}
          <Section title="Documentos" icon="📄" count={documents.length}>
            {documents.length === 0
              ? <p className="text-white/20 text-[12px] text-center py-4">Nenhum documento.</p>
              : <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-base flex-shrink-0">{DOC_ICONS[doc.type] ?? '📄'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 font-semibold text-[13px]">{TYPE_LABEL[doc.type]}</p>
                        <p className="text-white/30 font-mono text-[10px]">{doc.month}/{doc.year}</p>
                      </div>
                      {doc.signedAt
                        ? <Badge variant="success"><CheckIcon /> Assinado</Badge>
                        : <Badge variant="orange">Pendente</Badge>
                      }
                      {doc.pdfUrl && (
                        <button
                          onClick={() => openPDF(doc.pdfUrl!, `${TYPE_LABEL[doc.type]}-${doc.month}-${doc.year}`)}
                          className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition flex-shrink-0"
                          title="Ver PDF"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
            }
          </Section>

          {/* EPI */}
          <Section title="Equipamentos de Proteção (EPI)" icon="🦺" count={epis.length}>
            {epis.length === 0
              ? <p className="text-white/20 text-[12px] text-center py-4">Nenhum EPI registrado.</p>
              : <div className="space-y-2">
                  {epis.map(epi => (
                    <div key={epi.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-base flex-shrink-0">🦺</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 font-semibold text-[13px]">{epi.name}</p>
                        <p className="text-white/30 font-mono text-[10px]">CA {epi.ca} · Qtd {epi.quantity} · Validade {new Date(epi.expirationDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                      {epi.signed
                        ? <Badge variant="success"><CheckIcon /> Assinado</Badge>
                        : <Badge variant="orange">Pendente</Badge>
                      }
                      {epi.pdfUrl && (
                        <button
                          onClick={() => openPDF(epi.pdfUrl!, `EPI-${epi.name}`)}
                          className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition flex-shrink-0"
                          title="Ver PDF"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
            }
          </Section>

          {/* NRs */}
          <Section title="Treinamentos / NRs" icon="📖" count={nrs.length}>
            {nrs.length === 0
              ? <p className="text-white/20 text-[12px] text-center py-4">Nenhum treinamento registrado.</p>
              : <div className="space-y-2">
                  {nrs.map(nr => (
                    <div key={nr.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-base flex-shrink-0">📖</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono font-bold text-orange-400 text-[12px]">{nr.number}</span>
                          <p className="text-white/70 font-semibold text-[12px] truncate">{nr.name}</p>
                        </div>
                        <p className="text-white/25 font-mono text-[10px]">Validade: {new Date(nr.expirationDate).toLocaleDateString('pt-BR')} · {nr.cargaHoraria}h</p>
                      </div>
                      {nrStatusBadge(nr.expirationDate)}
                    </div>
                  ))}
                </div>
            }
          </Section>

          {/* ASO */}
          <Section title="Atestados de Saúde (ASO)" icon="🏥" count={asos.length}>
            {asos.length === 0
              ? <p className="text-white/20 text-[12px] text-center py-4">Nenhum ASO registrado.</p>
              : <div className="space-y-2">
                  {asos.map(aso => (
                    <div key={aso.id} className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-base flex-shrink-0">🏥</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <Badge variant="blue">{TYPE_LABEL[aso.type]}</Badge>
                          <p className="text-white/40 font-mono text-[10px]">{new Date(aso.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <p className="text-white/30 text-[11px]">{aso.physician} · {aso.crm}</p>
                      </div>
                      <Badge variant={aso.result === 'apto' ? 'success' : 'danger'}>{aso.result === 'apto' ? 'Apto' : 'Inapto'}</Badge>
                    </div>
                  ))}
                </div>
            }
          </Section>
        </div>
      </div>
    </div>
  );
}
