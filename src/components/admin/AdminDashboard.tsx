import { useState } from 'react';
import { Admin, Aviso, Employee, HRDocument, EPI, NR, ASO } from '../../types';
import EmployeesTab from './EmployeesTab';
import DocumentsTab from './DocumentsTab';
import EPITab from './EPITab';
import NRTab from './NRTab';
import ASOTab from './ASOTab';
import AvisosTab from './AvisosTab';
import AdminsTab from './AdminsTab';
import DashboardHero from './DashboardHero';
import EmployeeProfileModal from './EmployeeProfileModal';
import logoImg from '../../imports/LOGO_FUNDO-3.png';

interface AdminDashboardProps {
  currentAdmin: Admin;
  admins: Admin[];
  employees: Employee[];
  documents: HRDocument[];
  epis: EPI[];
  nrs: NR[];
  asos: ASO[];
  avisos: Aviso[];
  onAddAdmin: (adm: Omit<Admin, 'id'>) => void;
  onRemoveAdmin: (id: string) => void;
  onAddEmployee: (emp: Omit<Employee, 'id'>) => void;
  onToggleEmployeeActive: (id: string) => void;
  onRemoveEmployee: (id: string) => void;
  onAddDocument: (doc: Omit<HRDocument, 'id' | 'uploadedAt'>) => void;
  onRemoveDocument: (id: string) => void;
  onAddEPI: (epi: Omit<EPI, 'id'>) => void;
  onRemoveEPI: (id: string) => void;
  onAddNR: (nr: Omit<NR, 'id' | 'status'>) => void;
  onRemoveNR: (id: string) => void;
  onAddASO: (aso: Omit<ASO, 'id'>) => void;
  onRemoveASO: (id: string) => void;
  onAddAviso: (aviso: Omit<Aviso, 'id' | 'createdAt'>) => void;
  onRemoveAviso: (id: string) => void;
  onUpdateAdminPhoto: (id: string, photo: string) => void;
  onLogout: () => void;
}

type Tab = 'employees' | 'documents' | 'epi' | 'nrs' | 'aso' | 'avisos' | 'admins';

const TABS: { id: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  {
    id: 'employees', label: 'Funcionários', shortLabel: 'Equipe',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    id: 'documents', label: 'Documentos', shortLabel: 'Docs',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    id: 'epi', label: 'Controle de EPI', shortLabel: 'EPI',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    id: 'nrs', label: 'Normas Regulamentadoras', shortLabel: 'NRs',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  },
  {
    id: 'aso', label: 'Saúde Ocupacional', shortLabel: 'ASO',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  },
  {
    id: 'avisos', label: 'Avisos', shortLabel: 'Avisos',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  },
  {
    id: 'admins', label: 'Administradores', shortLabel: 'Admins',
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
];

export default function AdminDashboard({
  currentAdmin, admins, employees, documents, epis, nrs, asos, avisos,
  onAddAdmin, onRemoveAdmin,
  onAddEmployee, onToggleEmployeeActive, onRemoveEmployee,
  onAddDocument, onRemoveDocument,
  onAddEPI, onRemoveEPI,
  onAddNR, onRemoveNR,
  onAddASO, onRemoveASO,
  onAddAviso, onRemoveAviso,
  onUpdateAdminPhoto,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [profileEmployee, setProfileEmployee] = useState<Employee | null>(null);

  const pendingDocs = documents.filter(d => !d.signedAt).length;
  const pendingEPIs = epis.filter(e => !e.signed).length;
  const expiredNRs = nrs.filter(n => (new Date(n.expirationDate).getTime() - Date.now()) / 86400000 < 0).length;

  const badges: Partial<Record<Tab, number>> = {
    documents: pendingDocs || undefined,
    epi: pendingEPIs || undefined,
    nrs: expiredNRs || undefined,
    avisos: avisos.length || undefined,
  } as Partial<Record<Tab, number>>;

  const activeTabLabel = TABS.find(t => t.id === activeTab)?.label ?? '';

  return (
    <div className="h-screen h-[100dvh] bg-[#0c0c0c] flex flex-col overflow-hidden">
      {profileEmployee && (
        <EmployeeProfileModal
          employee={profileEmployee}
          documents={documents.filter(d => d.employeeId === profileEmployee.id)}
          epis={epis.filter(e => e.employeeId === profileEmployee.id)}
          nrs={nrs.filter(n => n.employeeId === profileEmployee.id)}
          asos={asos.filter(a => a.employeeId === profileEmployee.id)}
          onClose={() => setProfileEmployee(null)}
        />
      )}
      {/* Top bar */}
      <header
        className="border-b border-white/[0.08] flex items-center px-4 gap-4 flex-shrink-0 z-30 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #ffffff 0%, #ffffff 180px, #2a2a2a 420px, #1a1a1a 100%)',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          paddingBottom: '12px',
          minHeight: 'calc(56px + env(safe-area-inset-top, 0px))',
        }}>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600/60" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

        <img src={logoImg} alt="VM Andaimes" className="h-10 md:h-14 w-auto object-contain flex-shrink-0 relative z-10" />

        <div className="hidden sm:flex items-center gap-3 flex-1">
          <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          <span className="text-[11px] text-white/60 font-mono uppercase tracking-[0.18em] whitespace-nowrap">Painel Administrativo</span>
          <div className="h-px flex-1 bg-gradient-to-l from-white/15 to-transparent" />
        </div>
        <div className="flex-1 sm:hidden" />

        <span className="text-xs text-white/35 hidden md:inline">{activeTabLabel}</span>
        <div className="h-4 w-px bg-white/10 hidden md:block" />

        <div className="flex items-center gap-3">
          <label className="relative w-9 h-9 rounded-full cursor-pointer group flex-shrink-0" title="Alterar foto de perfil">
            {currentAdmin.photo
              ? <img src={currentAdmin.photo} alt="foto" className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/40" />
              : <div className="w-9 h-9 rounded-full bg-orange-500/20 ring-1 ring-orange-500/40 flex items-center justify-center text-orange-400 text-[11px] font-bold select-none">
                  {currentAdmin.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
            }
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files?.[0]; if (!f) return;
              const r = new FileReader(); r.onload = ev => onUpdateAdminPhoto(currentAdmin.id, ev.target?.result as string); r.readAsDataURL(f);
            }} />
          </label>
          <div className="hidden sm:block">
            <p className="text-xs text-white/85 font-semibold leading-none">{currentAdmin.name}</p>
            <p className="text-[10px] text-white/35 font-mono mt-0.5">{currentAdmin.login}</p>
          </div>
          <button
            onClick={onLogout}
            className="ml-1 px-3 py-2 text-[11px] font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-xl transition min-h-[44px] flex items-center"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-60 bg-[#111111] border-r border-white/[0.06] flex-shrink-0 flex-col">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.18em]">Módulos</p>
          </div>

          <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-semibold transition-all relative min-h-[44px] ${
                    isActive ? 'bg-orange-500/15 text-orange-400' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-orange-500 rounded-r-full" />}
                  <span className={`flex-shrink-0 ${isActive ? 'text-orange-400' : 'text-white/25'}`}>{tab.icon}</span>
                  <span className="flex-1 text-left truncate">{tab.shortLabel}</span>
                  {badges[tab.id] ? (
                    <span className="flex-shrink-0 min-w-[20px] h-[20px] px-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-orange-500/40">
                      {badges[tab.id]}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="mx-4 h-px bg-white/[0.06] my-3" />

          <div className="px-3 pb-3 space-y-3">
            <div className="bg-[#0e0e0e] rounded-xl p-3.5 border border-white/[0.06]">
              <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.18em] mb-3">Resumo</p>
              {[
                { label: 'Funcionários ativos', value: employees.filter(e => e.active).length, color: 'text-emerald-400', dot: 'bg-emerald-500' },
                { label: 'Pendentes de assinatura', value: pendingDocs + pendingEPIs, color: pendingDocs + pendingEPIs > 0 ? 'text-orange-400' : 'text-white/25', dot: pendingDocs + pendingEPIs > 0 ? 'bg-orange-500' : 'bg-white/10' },
                { label: 'NRs vencidas', value: expiredNRs, color: expiredNRs > 0 ? 'text-red-400' : 'text-white/25', dot: expiredNRs > 0 ? 'bg-red-500' : 'bg-white/10' },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className="text-[11px] text-white/35">{s.label}</span>
                  </div>
                  <span className={`text-[13px] font-mono font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-[#0c0c0c] pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0">
          <div className="p-4 md:p-7 max-w-6xl mx-auto">
            <DashboardHero
              activeEmployees={employees.filter(e => e.active).length}
              pendingDocs={pendingDocs}
              pendingEPIs={pendingEPIs}
              expiredNRs={expiredNRs}
            />

            {activeTab === 'employees' && <EmployeesTab employees={employees} onAdd={onAddEmployee} onToggleActive={onToggleEmployeeActive} onRemove={onRemoveEmployee} onSelect={emp => setProfileEmployee(emp)} selectedId={selectedEmployee?.id} />}
            {activeTab === 'documents' && <DocumentsTab employees={employees} documents={documents} onAdd={onAddDocument} onRemove={onRemoveDocument} onSelectEmployee={setProfileEmployee} />}
            {activeTab === 'epi' && <EPITab employees={employees} epis={epis} onAdd={onAddEPI} onRemove={onRemoveEPI} onSelectEmployee={setProfileEmployee} />}
            {activeTab === 'nrs' && <NRTab employees={employees} nrs={nrs} onAdd={onAddNR} onRemove={onRemoveNR} onSelectEmployee={setProfileEmployee} />}
            {activeTab === 'aso' && <ASOTab employees={employees} asos={asos} onAdd={onAddASO} onRemove={onRemoveASO} onSelectEmployee={setProfileEmployee} />}
            {activeTab === 'avisos' && <AvisosTab avisos={avisos} onAdd={onAddAviso} onRemove={onRemoveAviso} />}
            {activeTab === 'admins' && <AdminsTab currentAdminId={currentAdmin.id} admins={admins} onAdd={onAddAdmin} onRemove={onRemoveAdmin} />}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#111111]/95 backdrop-blur-xl border-t border-white/[0.08]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex-1 min-w-[52px] flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-all relative ${
                  isActive ? 'text-orange-400' : 'text-white/30'
                }`}
              >
                {badges[tab.id] ? (
                  <span className="absolute top-1.5 right-1/2 translate-x-[10px] min-w-[15px] h-[15px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center z-10">
                    {badges[tab.id]}
                  </span>
                ) : null}
                <span className={`transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>{tab.icon}</span>
                <span className={`text-[9px] font-semibold leading-none ${isActive ? 'text-orange-400' : 'text-white/30'}`}>
                  {tab.shortLabel}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-orange-500 rounded-b-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
