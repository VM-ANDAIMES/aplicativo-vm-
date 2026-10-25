interface DashboardHeroProps {
  activeEmployees: number;
  pendingDocs: number;
  pendingEPIs: number;
  expiredNRs: number;
}

const IMAGES = [
  'https://images.unsplash.com/photo-1761973673877-3139d1eae106?w=1400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1783535618208-ac4109dbc680?w=1400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1759390304428-fbe1752a999e?w=1400&h=500&fit=crop&auto=format',
];

const img = IMAGES[new Date().getDate() % IMAGES.length];

export default function DashboardHero({ activeEmployees, pendingDocs, pendingEPIs, expiredNRs }: DashboardHeroProps) {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const kpis = [
    {
      value: activeEmployees,
      label: 'Funcionários Ativos',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      alert: false,
    },
    {
      value: pendingDocs,
      label: 'Docs p/ Assinar',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: pendingDocs > 0 ? 'text-orange-400' : 'text-white/35',
      bg: pendingDocs > 0 ? 'bg-orange-500/12 border-orange-500/25' : 'bg-white/[0.05] border-white/[0.08]',
      alert: pendingDocs > 0,
    },
    {
      value: pendingEPIs,
      label: 'EPIs Pendentes',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: pendingEPIs > 0 ? 'text-amber-400' : 'text-white/35',
      bg: pendingEPIs > 0 ? 'bg-amber-500/12 border-amber-500/25' : 'bg-white/[0.05] border-white/[0.08]',
      alert: pendingEPIs > 0,
    },
    {
      value: expiredNRs,
      label: 'NRs Vencidas',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: expiredNRs > 0 ? 'text-red-400' : 'text-white/35',
      bg: expiredNRs > 0 ? 'bg-red-500/12 border-red-500/25' : 'bg-white/[0.05] border-white/[0.08]',
      alert: expiredNRs > 0,
    },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden mb-7 select-none" style={{ minHeight: 180 }}>
      <img src={img} alt="Equipe VM Andaimes" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />

      <div className="relative z-10 p-6 md:p-8">
        <p className="text-orange-400/70 text-[10px] font-mono uppercase tracking-[0.22em] mb-2 capitalize">{today}</p>
        <h2 className="text-white text-2xl font-extrabold leading-tight tracking-tight mb-1">
          Painel de Gestão
        </h2>
        <p className="text-white/35 text-[12px] mb-6">VM Andaimes · Segurança, conformidade e gestão de equipes</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((k) => (
            <div
              key={k.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${k.bg} transition-all`}
            >
              <span className={k.color}>{k.icon}</span>
              <div>
                <p className={`text-2xl font-extrabold font-mono leading-none ${k.color}`}>{k.value}</p>
                <p className="text-white/40 text-[10px] mt-0.5 leading-tight">{k.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
