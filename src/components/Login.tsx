import { useState } from 'react';
import { Admin, AuthUser, Employee } from '../types';
import logoImg from '../imports/Logo_VM-2.png';

interface LoginProps {
  admins: Admin[];
  employees: Employee[];
  onLogin: (user: AuthUser) => void;
}

const HERO_IMG = 'https://images.unsplash.com/photo-1713593930871-e21d7f9ef4a1?w=1400&h=1000&fit=crop&auto=format';

export default function Login({ admins, employees, onLogin }: LoginProps) {
  const [mode, setMode] = useState<'admin' | 'employee'>('admin');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'admin') {
      const adm = admins.find(a => a.login === login && a.password === password);
      if (adm) { onLogin({ role: 'admin', admin: adm }); return; }
    } else {
      const emp = employees.find(e => e.login === login && e.password === password && e.active);
      if (emp) { onLogin({ role: 'employee', employee: emp }); return; }
    }
    setError('Login ou senha incorretos.');
  };

  return (
    <div
      className="h-[100dvh] w-full flex flex-col lg:flex-row overflow-hidden"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* ═══ Hero panel (full background on mobile, left column on desktop) ═══ */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Background image */}
        <img
          src={HERO_IMG}
          alt="Andaimes VM"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/65 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600/40" />

        {/* Desktop: content inside left panel */}
        <div className="hidden lg:flex relative z-10 flex-col h-full p-12">
          <img
            src={logoImg}
            alt="VM Andaimes"
            className="h-14 w-auto object-contain self-start"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <div className="flex-1" />
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-0.5 bg-orange-500" />
              <span className="text-orange-400 text-xs font-mono uppercase tracking-[0.2em]">VM Andaimes</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Gestão Segura<br />de Equipes em<br />Altura
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Controle completo de EPI, NRs, ASOs, espelhos de ponto e holerites — tudo em um só lugar.
            </p>
            <div className="flex gap-8 mt-8">
              {[
                { value: 'NR-35', label: 'Trabalho em Altura' },
                { value: 'NR-06', label: 'EPI Certificado' },
                { value: 'ASO', label: 'Saúde Ocupacional' },
              ].map(s => (
                <div key={s.value}>
                  <p className="text-orange-400 font-mono font-bold text-sm">{s.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/15 text-[10px] font-mono mt-10">
            © {new Date().getFullYear()} VM Andaimes — Sistema de RH
          </p>
        </div>

        {/* Mobile: logo over the hero at top */}
        <div className="lg:hidden relative z-10 flex flex-col items-center pt-14 px-6">
          <img
            src={logoImg}
            alt="VM Andaimes"
            className="h-24 w-auto object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Mobile: push content up so form card has room */}
        <div className="lg:hidden flex-1" />
      </div>

      {/* ═══ Form panel ═══
           Mobile  → absolute bottom sheet layered over the hero
           Desktop → right sidebar, part of normal flex flow              */}

      {/* Mobile bottom sheet */}
      <div
        className="lg:hidden absolute bottom-0 left-0 right-0 z-20 bg-[#0d0d0d] rounded-t-3xl border-t border-white/[0.07] shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/15 rounded-full" />
        </div>
        <LoginForm
          mode={mode}
          login={login}
          password={password}
          error={error}
          onChangeMode={m => { setMode(m); setError(''); setLogin(''); setPassword(''); }}
          onChangeLogin={setLogin}
          onChangePassword={setPassword}
          onSubmit={handleSubmit}
          dark
        />
      </div>

      {/* Desktop sidebar */}
      <div
        className="hidden lg:flex flex-col w-[460px] flex-shrink-0 bg-white border-l border-gray-100 overflow-y-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="h-1 bg-orange-500 flex-shrink-0" />
        <div className="flex flex-col flex-1 px-10 py-10">
          <div className="flex justify-center mb-8">
            <img src={logoImg} alt="VM Andaimes" className="h-24 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-orange-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold whitespace-nowrap">Acesso ao Sistema</span>
            <div className="flex-1 h-px bg-orange-400" />
          </div>
          <LoginForm
            mode={mode}
            login={login}
            password={password}
            error={error}
            onChangeMode={m => { setMode(m); setError(''); setLogin(''); setPassword(''); }}
            onChangeLogin={setLogin}
            onChangePassword={setPassword}
            onSubmit={handleSubmit}
            dark={false}
          />
          <div className="flex-1" />
          <p className="text-center text-[10px] text-gray-300 font-mono mt-8">
            © {new Date().getFullYear()} VM Andaimes
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared form component ─── */
function LoginForm({
  mode, login, password, error, dark,
  onChangeMode, onChangeLogin, onChangePassword, onSubmit,
}: {
  mode: 'admin' | 'employee';
  login: string; password: string; error: string; dark: boolean;
  onChangeMode: (m: 'admin' | 'employee') => void;
  onChangeLogin: (v: string) => void;
  onChangePassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const inputCls = dark
    ? 'w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 min-h-[48px] text-base text-white/90 placeholder-white/20 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15 transition'
    : 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 min-h-[48px] text-base text-gray-800 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15 transition';
  const labelCls = `block text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 ${dark ? 'text-white/30' : 'text-gray-400'}`;

  return (
    <div className="px-6 pb-4 lg:px-0 lg:pb-0 space-y-0">
      {/* Mode tabs */}
      <div className={`flex rounded-xl p-1 mb-5 border ${dark ? 'bg-white/[0.05] border-white/[0.07]' : 'bg-gray-100 border-gray-200'}`}>
        {(['admin', 'employee'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChangeMode(m)}
            className={`flex-1 py-2.5 min-h-[44px] text-[11px] font-bold rounded-lg transition-all uppercase tracking-wider ${
              mode === m
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : dark ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {m === 'admin' ? 'Administrador' : 'Funcionário'}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className={labelCls}>Login</label>
          <input
            type="text"
            value={login}
            onChange={e => onChangeLogin(e.target.value)}
            placeholder="Login"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => onChangePassword(e.target.value)}
            placeholder="Senha"
            required
            className={inputCls}
          />
        </div>

        {error && (
          <div className={`text-xs rounded-xl px-4 py-2.5 ${dark ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-red-500 bg-red-50 border border-red-200'}`}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold py-4 min-h-[52px] rounded-xl text-base transition shadow-lg shadow-orange-500/25 active:scale-[0.98]"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
