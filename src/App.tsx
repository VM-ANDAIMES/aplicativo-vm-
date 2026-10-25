import { useState, useEffect, useCallback, useRef } from 'react';
import { Admin, Aviso, AuthUser, Employee, HRDocument, EPI, NR, ASO, Notification } from './types';
import {
  initialAdmins, initialEmployees, initialDocuments, initialEPIs,
  initialNRs, initialASOs, initialAvisos, initialNotifications,
} from './data/mockData';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import { cloudGet, cloudSet } from './lib/cloud';

let nextId = Date.now();
const uid = () => `gen-${++nextId}`;

function lsGet<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) as T : fallback; }
  catch { return fallback; }
}
function lsSet<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function useCloudState<T>(key: string, fallback: T): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const [state, setLocal] = useState<T>(() => lsGet(key, fallback));
  const [synced, setSynced] = useState(false);
  const mountedRef = useRef(true);

  
  useEffect(() => {
    let active = true;
    let loading = false;

    const syncFromCloud = async () => {
      if (loading) return;
      loading = true;

      try {
        const data = await cloudGet<T>(key);

        if (active && data !== null) {
          setLocal(data);
          lsSet(key, data);
        }
      } catch (error) {
        console.error(`Erro ao sincronizar ${key}:`, error);
      } finally {
        loading = false;
      }
    };

    void syncFromCloud();

    const interval = window.setInterval(() => {
      void syncFromCloud();
    }, 10000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [key]);

  return [state, setState, synced];
}

export default function App() {
  const [auth, setAuth] = useState<AuthUser | null>(null);
  const [admins, setAdmins, adminsSynced] = useCloudState<Admin[]>('vm_admins', initialAdmins);
  const [employees, setEmployees] = useCloudState<Employee[]>('vm_employees', initialEmployees);
  const [documents, setDocuments] = useCloudState<HRDocument[]>('vm_documents', initialDocuments);
  const [epis, setEPIs] = useCloudState<EPI[]>('vm_epis', initialEPIs);
  const [nrs, setNRs] = useCloudState<NR[]>('vm_nrs', initialNRs);
  const [asos, setASOs] = useCloudState<ASO[]>('vm_asos', initialASOs);
  const [avisos, setAvisos] = useCloudState<Aviso[]>('vm_avisos', initialAvisos);
  const [notifications, setNotifications] = useCloudState<Notification[]>('vm_notifications', initialNotifications);

  const notify = (n: Omit<Notification, 'id'>) =>
    setNotifications(prev => [{ ...n, id: uid() }, ...prev]);

  const handleLogout = () => setAuth(null);

  // Admin
  const addAdmin = (adm: Omit<Admin, 'id'>) =>
    setAdmins(prev => [...prev, { ...adm, id: uid() }]);
  const removeAdmin = (id: string) =>
    setAdmins(prev => prev.filter(a => a.id !== id));
  const updateAdminPhoto = (id: string, photo: string) =>
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, photo } : a));

  // Employees
  const addEmployee = (emp: Omit<Employee, 'id'>) =>
    setEmployees(prev => [...prev, { ...emp, id: (emp as Omit<Employee, 'id'> & { id?: string }).id || uid() }]);
  const toggleEmployeeActive = (id: string) =>
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e));
  const removeEmployee = (id: string) =>
    setEmployees(prev => prev.filter(e => e.id !== id));
  const updateEmployeePhoto = (id: string, photo: string) =>
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, photo } : e));

  // Documents
  const addDocument = (doc: Omit<HRDocument, 'id' | 'uploadedAt'>) => {
    setDocuments(prev => [...prev, { ...doc, id: uid(), uploadedAt: new Date().toISOString() }]);
    const emp = employees.find(e => e.id === doc.employeeId);
    const typeLabel: Record<string, string> = { holerite: 'Holerite', 'espelho-ponto': 'Espelho de Ponto', rescisao: 'Rescisão' };
    notify({
      employeeId: doc.employeeId,
      type: 'document',
      title: `${typeLabel[doc.type] ?? 'Documento'} disponível`,
      message: `${emp?.name ?? 'Funcionário'}, seu ${typeLabel[doc.type]?.toLowerCase() ?? 'documento'} de ${doc.month}/${doc.year} foi anexado.`,
      createdAt: new Date().toISOString(),
    });
  };
  const removeDocument = (id: string) =>
    setDocuments(prev => prev.filter(d => d.id !== id));
  const signDocument = (docId: string, signature: string) =>
    setDocuments(prev => prev.map(d =>
      d.id === docId ? { ...d, signature, signedAt: new Date().toISOString() } : d
    ));

  // EPI
  const addEPI = (epi: Omit<EPI, 'id'>) => {
    setEPIs(prev => [...prev, { ...epi, id: uid() }]);
    const emp = employees.find(e => e.id === epi.employeeId);
    notify({
      employeeId: epi.employeeId,
      type: 'epi',
      title: 'Novo EPI registrado',
      message: `${emp?.name ?? 'Funcionário'}, o equipamento "${epi.name}" foi registrado e aguarda sua assinatura de recebimento.`,
      createdAt: new Date().toISOString(),
    });
  };
  const signEPI = (epiId: string, signature: string) =>
    setEPIs(prev => prev.map(e =>
      e.id === epiId ? { ...e, signed: true, signature, signedAt: new Date().toISOString() } : e
    ));
  const removeEPI = (id: string) =>
    setEPIs(prev => prev.filter(e => e.id !== id));

  // NR
  const addNR = (nr: Omit<NR, 'id' | 'status'>) => {
    const diff = (new Date(nr.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    const status: NR['status'] = diff < 0 ? 'expired' : diff <= 60 ? 'expiring' : 'valid';
    setNRs(prev => [...prev, { ...nr, id: uid(), status }]);
  };
  const removeNR = (id: string) =>
    setNRs(prev => prev.filter(n => n.id !== id));

  // ASO
  const addASO = (aso: Omit<ASO, 'id'>) =>
    setASOs(prev => [...prev, { ...aso, id: uid() }]);
  const removeASO = (id: string) =>
    setASOs(prev => prev.filter(a => a.id !== id));

  // Avisos
  const addAviso = (aviso: Omit<Aviso, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    setAvisos(prev => [{ ...aviso, id: uid(), createdAt: now }, ...prev]);
    notify({
      employeeId: 'all',
      type: 'aviso',
      title: aviso.priority === 'urgent' ? `⚠️ ${aviso.title}` : aviso.title,
      message: aviso.message,
      createdAt: now,
    });
  };
  const removeAviso = (id: string) =>
    setAvisos(prev => prev.filter(a => a.id !== id));

  // Notifications
  const markNotificationRead = (employeeId: string, notificationId: string) =>
    setNotifications(prev => prev.map(n => {
      if (n.id !== notificationId) return n;
      if (n.employeeId === 'all') {
        return n.readBy?.includes(employeeId)
          ? n
          : { ...n, readBy: [...(n.readBy ?? []), employeeId] };
      }
      return n.employeeId === employeeId && !n.readAt
        ? { ...n, readAt: new Date().toISOString() }
        : n;
    }));
  const markNotificationsRead = (employeeId: string) =>
    setNotifications(prev => prev.map(n => {
      if (n.employeeId === 'all') {
        return n.readBy?.includes(employeeId)
          ? n
          : { ...n, readBy: [...(n.readBy ?? []), employeeId] };
      }
      return n.employeeId === employeeId && !n.readAt
        ? { ...n, readAt: new Date().toISOString() }
        : n;
    }));
  const dismissNotifications = (employeeId: string) =>
    setNotifications(prev => prev.flatMap(n => {
      if (n.employeeId === 'all') {
        return n.dismissedBy?.includes(employeeId)
          ? [n]
          : [{ ...n, dismissedBy: [...(n.dismissedBy ?? []), employeeId] }];
      }
      return n.employeeId === employeeId ? [] : [n];
    }));

  if (!auth) return (
    <>
      <Login admins={admins} employees={employees} onLogin={setAuth} />
      {!adminsSynced && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-full shadow-xl">
          <svg className="w-3.5 h-3.5 text-orange-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-[11px] text-white/50 font-mono">Sincronizando dados...</span>
        </div>
      )}
    </>
  );

  if (auth.role === 'admin') {
    return (
      <AdminDashboard
        currentAdmin={auth.admin!}
        admins={admins}
        employees={employees}
        onUpdateAdminPhoto={updateAdminPhoto}
        documents={documents}
        epis={epis}
        nrs={nrs}
        asos={asos}
        avisos={avisos}
        onAddAdmin={addAdmin}
        onRemoveAdmin={removeAdmin}
        onAddEmployee={addEmployee}
        onToggleEmployeeActive={toggleEmployeeActive}
        onRemoveEmployee={removeEmployee}
        onAddDocument={addDocument}
        onRemoveDocument={removeDocument}
        onAddEPI={addEPI}
        onRemoveEPI={removeEPI}
        onAddNR={addNR}
        onRemoveNR={removeNR}
        onAddASO={addASO}
        onRemoveASO={removeASO}
        onAddAviso={addAviso}
        onRemoveAviso={removeAviso}
        onLogout={handleLogout}
      />
    );
  }

  if (auth.role === 'employee' && auth.employee) {
    const empId = auth.employee.id;
    const myNotifications = notifications.filter(
      n => (n.employeeId === empId || n.employeeId === 'all')
        && !n.dismissedBy?.includes(empId)
    );
    return (
      <EmployeeDashboard
        employee={auth.employee}
        documents={documents}
        epis={epis}
        nrs={nrs}
        asos={asos}
        avisos={avisos}
        notifications={myNotifications}
        onSignDocument={signDocument}
        onSignEPI={signEPI}
        onMarkNotificationRead={(id) => markNotificationRead(empId, id)}
        onMarkNotificationsRead={() => markNotificationsRead(empId)}
        onClearNotifications={() => dismissNotifications(empId)}
        onUpdatePhoto={(photo) => updateEmployeePhoto(empId, photo)}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}
