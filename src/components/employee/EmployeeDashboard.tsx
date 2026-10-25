import { useEffect, useState } from 'react';
import { Aviso, Employee, HRDocument, EPI, NR, ASO, Notification } from '../../types';
import SignatureModal from '../SignatureModal';
import { Badge, CheckIcon } from '../ui';
import logoImg from '../../imports/Logo_VM-1.png';

interface Props {
  employee: Employee;
  documents: HRDocument[];
  epis: EPI[];
  nrs: NR[];
  asos: ASO[];
  avisos: Aviso[];
  notifications: Notification[];
  onSignDocument: (id: string, sig: string) => void;
  onSignEPI: (id: string, sig: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkNotificationsRead: () => void;
  onClearNotifications: () => void;
  onUpdatePhoto: (photo: string) => void;
  onLogout: () => void;
}

type Tab = 'documents' | 'epi' | 'nrs' | 'aso' | 'avisos';

const HERO = 'https://images.unsplash.com/photo-1603239564387-c5b5ea6f635e?w=1400&h=400&fit=crop&auto=format';

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

const nrStatus = (date: string): NR['status'] => {
  const d = (new Date(date).getTime() - Date.now()) / 86400000;
  return d < 0 ? 'expired' : d <= 60 ? 'expiring' : 'valid';
};

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  documents: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  epi: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  nrs: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  aso: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  avisos: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
};

function dataUrlToBlobUrl(dataUrl: string): string {
  try {
    const [header, b64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)![1];
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return dataUrl;
  }
}


/* ── PDF Viewer dentro do aplicativo ── */

function PDFViewerModal({
  title,
  url,
  onClose,
}: {
  title: string;
  url: string;
  onClose: () => void;
}) {
  const [viewerUrl, setViewerUrl] = useState('');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let currentUrl = url;

    try {
      // Converte o PDF em Base64 para uma URL que o visualizador
      // interno do navegador consiga exibir.
      if (url.startsWith('data:application/pdf;base64,')) {
        currentUrl = dataUrlToBlobUrl(url);
      }

      setViewerUrl(currentUrl);
      setLoadError(false);
    } catch (error) {
      console.error('Erro ao preparar o PDF:', error);
      setLoadError(true);
    }

    return () => {
      // Libera a memória quando o visualizador for fechado.
      if (currentUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [url]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização do documento: ${title}`}
    >
      <div className="flex h-full max-h-[95dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl">
        {/* Cabeçalho do visualizador */}
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white sm:text-base">
              Documento PDF
            </h2>
            <p className="mt-1 truncate text-xs text-white/55">
              {title}
            </p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            {viewerUrl && !loadError && (
              <a
                href={viewerUrl}
                download={`${title.replace(/[\\/:*?"<>|]/g, '_')}.pdf`}
                className="flex min-h-[40px] items-center justify-center rounded-xl border border-white/15 px-3 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                Baixar PDF
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[40px] items-center justify-center rounded-xl bg-orange-500 px-4 text-xs font-bold text-white transition hover:bg-orange-400"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Documento exibido dentro do aplicativo */}
        <div className="relative min-h-0 flex-1 bg-white">
          {loadError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#141414] px-6 text-center">
              <span className="text-4xl">📄</span>
              <p className="text-sm font-semibold text-white">
                Não foi possível carregar o documento.
              </p>
              <p className="max-w-md text-xs leading-relaxed text-white/50">
                Verifique se o arquivo PDF está válido e tente novamente.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 min-h-[44px] rounded-xl bg-orange-500 px-5 text-sm font-bold text-white hover:bg-orange-400"
              >
                Voltar
              </button>
            </div>
          ) : viewerUrl ? (
            <iframe
              key={viewerUrl}
              src={viewerUrl}
              title={`PDF: ${title}`}
              className="h-full w-full border-0 bg-white"
              style={{ minHeight: 0 }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#141414]">
              <p className="text-sm text-white/60">
                Carregando documento...
              </p>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex flex-shrink-0 items-center justify-center border-t border-white/10 bg-[#141414] px-3 py-2">
          <p className="text-center text-[10px] text-white/35">
            VM Andaimes · Portal do Colaborador
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Notification Panel ── */
function NotificationPanel({
  notifications, isUnread, onClose, onRead, onMarkAllRead, onClear, onNavigate,
}: {
  notifications: Notification[];
  isUnread: (notification: Notification) => boolean;
  onClose: () => void;
  onRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const unread = notifications.filter(isUnread).length;

  const tabForType = (type: Notification['type']): Tab => {
    if (type === 'document') return 'documents';
    if (type === 'epi') return 'epi';
    return 'avisos';
  };

  const typeIcon = (type: Notification['type']) => {
    if (type === 'document') return '📄';
    if (type === 'epi') return '🦺';
    return '📢';
  };

  const handleNotificationClick = (n: Notification) => {
    onRead(n.id);
    onNavigate(tabForType(n.type));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-[#141414] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl w-full sm:w-[380px] sm:m-4 shadow-2xl flex flex-col max-h-[85dvh]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-white/90">Notificações</h3>
            {unread > 0 && <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded-full">{unread} nova{unread !== 1 ? 's' : ''}</span>}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && <button onClick={onMarkAllRead} className="text-[11px] text-white/45 hover:text-white/70 transition">Marcar lidas</button>}
            {notifications.length > 0 && <button onClick={() => { onClear(); onClose(); }} className="text-[11px] text-orange-400 hover:text-orange-300 transition">Limpar todas</button>}
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] rounded-xl transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl mb-3">🔔</div>
              <p className="text-white/20 text-sm">Nenhuma notificação ainda.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full flex items-start gap-3 px-5 py-4 text-left transition hover:bg-white/[0.04] active:bg-white/[0.07] ${isUnread(n) ? 'bg-orange-500/[0.04]' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                    n.type === 'aviso' ? 'bg-blue-500/15' : n.type === 'epi' ? 'bg-orange-500/15' : 'bg-white/[0.06]'
                  }`}>
                    {typeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white/85 font-semibold text-[13px] leading-snug">{n.title}</p>
                      {isUnread(n) && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-white/40 text-[12px] leading-relaxed mt-0.5">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-white/20 font-mono text-[10px]">{new Date(n.createdAt).toLocaleString('pt-BR')}</p>
                      <span className="text-orange-400/60 text-[10px] font-semibold">Toque para ver →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function EmployeeDashboard({ employee, documents, epis, nrs, asos, avisos, notifications, onSignDocument, onSignEPI, onMarkNotificationRead, onMarkNotificationsRead, onClearNotifications, onUpdatePhoto, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('documents');
  const [signDocTarget, setSignDocTarget] = useState<HRDocument | null>(null);
  const [signEPITarget, setSignEPITarget] = useState<EPI | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pdfViewer, setPdfViewer] = useState<{ title: string; url: string } | null>(null);

  const myDocs = documents.filter(d => d.employeeId === employee.id);
  const myEPIs = epis.filter(e => e.employeeId === employee.id);
  const myNRs = nrs.filter(n => n.employeeId === employee.id);
  const myASOs = asos.filter(a => a.employeeId === employee.id);

  const pendingDocs = myDocs.filter(d => !d.signedAt).length;
  const pendingEPIs = myEPIs.filter(e => !e.signed).length;
  const isUnreadNotification = (notification: Notification) =>
    notification.employeeId === 'all'
      ? !notification.readAt && !notification.readBy?.includes(employee.id)
      : !notification.readAt;
  const unreadNotifications = notifications.filter(isUnreadNotification).length;
  const unreadAvisos = notifications.filter(
    notification => notification.type === 'aviso' && isUnreadNotification(notification)
  ).length;
  const initials = employee.name.split(' ').map(n => n[0]).slice(0, 2).join('');

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: 'documents', label: 'Documentos', badge: pendingDocs },
    { id: 'epi', label: 'EPI', badge: pendingEPIs },
    { id: 'nrs', label: 'NRs' },
    { id: 'aso', label: 'ASO' },
    { id: 'avisos', label: 'Avisos', badge: unreadAvisos },
  ];

  const nrStatusBadge = (status: NR['status']) => {
    if (status === 'expired') return <Badge variant="danger">Vencida</Badge>;
    if (status === 'expiring') return <Badge variant="warning">A vencer</Badge>;
    return <Badge variant="success">Válida</Badge>;
  };

  return (
    <div className="h-[100dvh] bg-[#0c0c0c] flex flex-col overflow-hidden">
      {signDocTarget && (
        <SignatureModal
          title={`${TYPE_LABEL[signDocTarget.type]} · ${signDocTarget.month}/${signDocTarget.year}`}
          onConfirm={sig => { onSignDocument(signDocTarget.id, sig); setSignDocTarget(null); }}
          onClose={() => setSignDocTarget(null)}
        />
      )}
      {signEPITarget && (
        <SignatureModal
          title={`EPI: ${signEPITarget.name}`}
          onConfirm={sig => { onSignEPI(signEPITarget.id, sig); setSignEPITarget(null); }}
          onClose={() => setSignEPITarget(null)}
        />
      )}
      {pdfViewer && <PDFViewerModal title={pdfViewer.title} url={pdfViewer.url} onClose={() => setPdfViewer(null)} />}
      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          isUnread={isUnreadNotification}
          onClose={() => setShowNotifications(false)}
          onRead={onMarkNotificationRead}
          onMarkAllRead={onMarkNotificationsRead}
          onClear={onClearNotifications}
          onNavigate={tab => { setActiveTab(tab); setShowNotifications(false); }}
        />
      )}

      {/* Header */}
      <header
        className="border-b border-white/[0.08] flex items-center px-4 gap-3 flex-shrink-0 z-10 relative"
        style={{
          background: 'linear-gradient(to right, #ffffff 0%, #ffffff 170px, #2a2a2a 400px, #1a1a1a 100%)',
          paddingTop: 'max(10px, env(safe-area-inset-top))',
          paddingBottom: '10px',
          minHeight: 'calc(56px + env(safe-area-inset-top, 0px))',
        }}>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600/60" />
        <img src={logoImg} alt="VM Andaimes" className="h-11 md:h-14 w-auto object-contain flex-shrink-0 relative z-10" />
        <div className="hidden sm:flex items-center gap-3 flex-1">
          <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          <span className="text-[11px] text-white/50 font-mono uppercase tracking-[0.18em] whitespace-nowrap">Portal do Colaborador</span>
          <div className="h-px flex-1 bg-gradient-to-l from-white/15 to-transparent" />
        </div>
        <div className="flex-1 sm:hidden" />
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.05] rounded-xl transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-orange-500/40">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
          <label className="relative w-9 h-9 rounded-full cursor-pointer group flex-shrink-0" title="Alterar foto de perfil">
            {employee.photo
              ? <img src={employee.photo} alt="foto" className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/40" />
              : <div className="w-9 h-9 rounded-full bg-orange-500/20 ring-1 ring-orange-500/40 flex items-center justify-center text-orange-400 text-[11px] font-bold select-none">{initials}</div>
            }
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files?.[0]; if (!f) return;
              const r = new FileReader(); r.onload = ev => onUpdatePhoto(ev.target?.result as string); r.readAsDataURL(f);
            }} />
          </label>
          <div className="hidden sm:block">
            <p className="text-xs text-white/85 font-semibold leading-none">{employee.name.split(' ').slice(0, 2).join(' ')}</p>
            <p className="text-[10px] text-white/35 font-mono mt-0.5">{employee.role}</p>
          </div>
          <button onClick={onLogout} className="ml-1 px-3 py-2 text-[11px] font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-xl transition min-h-[44px] flex items-center">Sair</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom,0px))] sm:pb-0">
        {/* Hero */}
        <div className="relative h-28 md:h-44 overflow-hidden bg-[#1a1a1a]">
          <img src={HERO} alt="VM Andaimes" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-end px-4 md:px-8 pb-3 gap-3">
            <label className="relative w-10 h-10 rounded-xl cursor-pointer group flex-shrink-0" title="Alterar foto">
              {employee.photo
                ? <img src={employee.photo} alt="foto" className="w-10 h-10 rounded-xl object-cover ring-2 ring-orange-500/35" />
                : <div className="w-10 h-10 rounded-xl bg-orange-500/25 ring-2 ring-orange-500/35 flex items-center justify-center text-orange-300 font-extrabold text-sm">{initials}</div>
              }
              <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader(); r.onload = ev => onUpdatePhoto(ev.target?.result as string); r.readAsDataURL(f);
              }} />
            </label>
            <div>
              <h1 className="text-white font-extrabold text-base md:text-xl leading-tight">{employee.name}</h1>
              <p className="text-white/45 text-[11px]">{employee.role} · {employee.department}</p>
            </div>
            <div className="flex-1" />
            <div className="hidden sm:flex gap-2">
              {pendingDocs > 0 && <Badge variant="orange">{pendingDocs} doc{pendingDocs > 1 ? 's' : ''} p/ assinar</Badge>}
              {pendingEPIs > 0 && <Badge variant="orange">{pendingEPIs} EPI p/ assinar</Badge>}
              {pendingDocs === 0 && pendingEPIs === 0 && <Badge variant="success">✓ Tudo em dia</Badge>}
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="bg-[#111111] border-b border-white/[0.06] px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center gap-4 flex-wrap">
            {[
              { label: 'CPF', value: employee.cpf },
              { label: 'Admissão', value: new Date(employee.admissionDate).toLocaleDateString('pt-BR') },
              { label: 'Telefone', value: employee.phone },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[9px] text-white/20 uppercase tracking-[0.16em] font-bold mb-0.5">{f.label}</p>
                <p className="text-[11px] text-white/50 font-mono">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-3 md:px-6 py-4">
          {/* Desktop tabs */}
          <div className="hidden sm:flex gap-1 bg-[#141414] border border-white/[0.07] rounded-xl p-1 w-fit mb-5 flex-wrap">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all min-h-[40px] ${
                  activeTab === tab.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'text-white/35 hover:text-white/65 hover:bg-white/[0.04]'
                }`}>
                <span className={activeTab === tab.id ? 'text-white/80' : 'text-white/25'}>{TAB_ICONS[tab.id]}</span>
                {tab.label}
                {tab.badge && tab.badge > 0 ? (
                  <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{tab.badge}</span>
                ) : null}
              </button>
            ))}
          </div>

          {/* ── DOCUMENTS ── */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {pendingDocs > 0 && (
                <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  <p className="text-[12px] text-orange-300/80">{pendingDocs} documento{pendingDocs > 1 ? 's' : ''} aguardando sua assinatura.</p>
                </div>
              )}
              {myDocs.map(doc => (
                <div key={doc.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1e1e1e] flex items-center justify-center text-lg flex-shrink-0">{DOC_ICONS[doc.type] ?? '📄'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 font-semibold text-[14px]">{TYPE_LABEL[doc.type]}</p>
                      <p className="text-white/30 font-mono text-[11px] mt-0.5">{doc.month}/{doc.year} · {doc.fileName}</p>
                    </div>
                    {doc.signedAt
                      ? <Badge variant="success"><CheckIcon /> Assinado</Badge>
                      : <Badge variant="orange">Pendente</Badge>
                    }
                  </div>
                  {!doc.signedAt && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                      {doc.pdfUrl && (
                        <button
                          onClick={() => setPdfViewer({ title: `${TYPE_LABEL[doc.type]} · ${doc.month}/${doc.year}`, url: doc.pdfUrl! })}
                          className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] text-[12px] font-semibold text-white/60 border border-white/[0.12] hover:border-white/30 rounded-xl transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          Ver documento
                        </button>
                      )}
                      <button
                        onClick={() => setSignDocTarget(doc)}
                        className="flex-1 min-h-[44px] text-[12px] font-bold bg-orange-500 hover:bg-orange-400 text-white rounded-xl transition shadow-md shadow-orange-500/20 active:scale-[0.97]"
                      >
                        Assinar
                      </button>
                    </div>
                  )}
                  {doc.signedAt && (
                    <p className="text-white/20 font-mono text-[10px] mt-2">Assinado em {new Date(doc.signedAt).toLocaleString('pt-BR')}</p>
                  )}
                </div>
              ))}
              {myDocs.length === 0 && (
                <div className="text-center py-16"><div className="text-3xl mb-3">📄</div><p className="text-white/20 text-sm">Nenhum documento disponível.</p></div>
              )}
            </div>
          )}

          {/* ── EPI ── */}
          {activeTab === 'epi' && (
            <div className="space-y-3">
              {pendingEPIs > 0 && (
                <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  <p className="text-[12px] text-orange-300/80">{pendingEPIs} EPI{pendingEPIs > 1 ? 's' : ''} aguardando assinatura de recebimento.</p>
                </div>
              )}
              {myEPIs.map(epi => (
                <div key={epi.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg flex-shrink-0">🦺</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 font-semibold text-[14px]">{epi.name}</p>
                      <p className="text-white/30 font-mono text-[11px] mt-0.5">CA {epi.ca} · Qtd {epi.quantity}</p>
                    </div>
                    {epi.signed
                      ? <Badge variant="success"><CheckIcon /> Assinado</Badge>
                      : <Badge variant="orange">Pendente</Badge>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/[0.05] text-[11px]">
                    <div>
                      <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Entregue em</p>
                      <p className="text-white/45 font-mono">{new Date(epi.deliveryDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Validade</p>
                      <p className="text-white/45 font-mono">{new Date(epi.expirationDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  {!epi.signed && (
                    <div className="flex gap-2 mt-3">
                      {epi.pdfUrl && (
                        <button
                          onClick={() => setPdfViewer({ title: `EPI: ${epi.name}`, url: epi.pdfUrl! })}
                          className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] text-[12px] font-semibold text-white/60 border border-white/[0.12] hover:border-white/30 rounded-xl transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          Ver ficha
                        </button>
                      )}
                      <button
                        onClick={() => setSignEPITarget(epi)}
                        className="flex-1 min-h-[44px] text-[12px] font-bold bg-orange-500 hover:bg-orange-400 text-white rounded-xl transition shadow-md shadow-orange-500/20 active:scale-[0.97]"
                      >
                        Assinar recibo
                      </button>
                    </div>
                  )}
                  {epi.signed && epi.signedAt && (
                    <p className="text-white/20 font-mono text-[10px] mt-2">Assinado em {new Date(epi.signedAt).toLocaleString('pt-BR')}</p>
                  )}
                </div>
              ))}
              {myEPIs.length === 0 && (
                <div className="text-center py-16"><div className="text-3xl mb-3">🦺</div><p className="text-white/20 text-sm">Nenhum EPI registrado.</p></div>
              )}
            </div>
          )}

          {/* ── NRs ── */}
          {activeTab === 'nrs' && (
            <div className="space-y-3">
              {myNRs.map(nr => (
                <div key={nr.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg flex-shrink-0">📖</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-mono font-bold text-orange-400 text-[13px]">{nr.number}</span>
                        {nrStatusBadge(nrStatus(nr.expirationDate))}
                      </div>
                      <p className="text-white/55 text-[12px] truncate">{nr.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/[0.05] text-[11px]">
                    <div>
                      <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Realizado</p>
                      <p className="text-white/45 font-mono">{new Date(nr.trainingDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Validade</p>
                      <p className="text-white/45 font-mono">{new Date(nr.expirationDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Instrutor</p>
                      <p className="text-white/45">{nr.instructor}</p>
                    </div>
                    <div>
                      <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Carga Horária</p>
                      <p className="text-white/45">{nr.cargaHoraria}h</p>
                    </div>
                  </div>
                </div>
              ))}
              {myNRs.length === 0 && (
                <div className="text-center py-16"><div className="text-3xl mb-3">📖</div><p className="text-white/20 text-sm">Nenhum treinamento registrado.</p></div>
              )}
            </div>
          )}

          {/* ── ASO ── */}
          {activeTab === 'aso' && (
            <div className="space-y-3">
              {myASOs.map(aso => (
                <div key={aso.id} className="bg-[#141414] border border-white/[0.07] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg flex-shrink-0">🏥</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <Badge variant="blue">{TYPE_LABEL[aso.type]}</Badge>
                        <Badge variant={aso.result === 'apto' ? 'success' : 'danger'}>{aso.result === 'apto' ? 'Apto' : 'Inapto'}</Badge>
                      </div>
                      <p className="text-white/30 font-mono text-[11px] mt-1">{new Date(aso.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/[0.05] text-[11px]">
                    <div>
                      <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Médico</p>
                      <p className="text-white/45">{aso.physician}</p>
                      <p className="text-white/25 font-mono">{aso.crm}</p>
                    </div>
                    {aso.nextDate && (
                      <div>
                        <p className="text-white/20 uppercase tracking-wider font-bold text-[9px] mb-0.5">Próximo Exame</p>
                        <p className="text-white/45 font-mono">{new Date(aso.nextDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {myASOs.length === 0 && (
                <div className="text-center py-16"><div className="text-3xl mb-3">🏥</div><p className="text-white/20 text-sm">Nenhum ASO registrado.</p></div>
              )}
            </div>
          )}

          {/* ── AVISOS ── */}
          {activeTab === 'avisos' && (
            <div className="space-y-3">
              {avisos.map(aviso => (
                <div key={aviso.id} className={`bg-[#141414] border rounded-2xl p-4 ${aviso.priority === 'urgent' ? 'border-red-500/25' : 'border-white/[0.07]'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${aviso.priority === 'urgent' ? 'bg-red-500/15' : 'bg-orange-500/15'}`}>
                      {aviso.priority === 'urgent' ? '⚠️' : '📢'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-white/90 font-semibold text-[14px]">{aviso.title}</p>
                        {aviso.priority === 'urgent' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/25 rounded-full">Urgente</span>
                        )}
                      </div>
                      <p className="text-white/50 text-[13px] leading-relaxed">{aviso.message}</p>
                      <p className="text-white/20 font-mono text-[10px] mt-2">{new Date(aviso.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              ))}
              {avisos.length === 0 && (
                <div className="text-center py-16"><div className="text-3xl mb-3">📢</div><p className="text-white/20 text-sm">Nenhum aviso publicado.</p></div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#111111]/95 backdrop-blur-xl border-t border-white/[0.08]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-all relative ${isActive ? 'text-orange-400' : 'text-white/30'}`}
              >
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-1.5 right-1/2 translate-x-[10px] min-w-[15px] h-[15px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center z-10">{tab.badge}</span>
                ) : null}
                <span className={`transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>{TAB_ICONS[tab.id]}</span>
                <span className="text-[9px] font-semibold leading-none">{tab.label}</span>
                {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-orange-500 rounded-b-full" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
