'use client';
import Link from 'next/link';
import {CalendarCheck,ChevronRight,Clock3,DollarSign,Scissors,UsersRound} from 'lucide-react';
import {useAdminStore} from './useAdminStore';
const money=(v:number)=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const statusLabel={pending:'Pendente',confirmed:'Confirmado',completed:'Concluído',cancelled:'Cancelado'} as const;

export function AdminDashboard(){
 const {appointments,employees}=useAdminStore(); const today=new Date().toISOString().slice(0,10); const month=today.slice(0,7);
 const todayApps=appointments.filter(a=>a.date===today&&a.status!=='cancelled');
 const revenue=appointments.filter(a=>a.status==='completed'&&a.date.startsWith(month)).reduce((n,a)=>n+a.total,0);
 const completed=appointments.filter(a=>a.status==='completed'&&a.date.startsWith(month));
 const avg=completed.length?revenue/completed.length:0;
 const next=todayApps.slice().sort((a,b)=>a.time.localeCompare(b.time)).slice(0,5);
 return <>
  <div className="admin-heading"><div><span className="eyebrow dark">Visão geral</span><h1>Bom trabalho. Aqui está a operação de hoje.</h1><p>Acompanhe agenda, equipe e faturamento em um só lugar.</p></div><Link href="/admin/agendamentos" className="btn btn-primary">Novo agendamento <ChevronRight size={16}/></Link></div>
  <div className="admin-kpis">
   <div className="admin-kpi"><span className="admin-kpi-icon"><CalendarCheck/></span><div><small>Agendamentos hoje</small><strong>{todayApps.length}</strong><em>{todayApps.filter(a=>a.status==='pending').length} aguardando confirmação</em></div></div>
   <div className="admin-kpi"><span className="admin-kpi-icon"><DollarSign/></span><div><small>Faturamento do mês</small><strong>{money(revenue)}</strong><em>{completed.length} atendimentos concluídos</em></div></div>
   <div className="admin-kpi"><span className="admin-kpi-icon"><UsersRound/></span><div><small>Equipe ativa</small><strong>{employees.filter(e=>e.active).length}</strong><em>{employees.length} cadastrados</em></div></div>
   <div className="admin-kpi"><span className="admin-kpi-icon"><Scissors/></span><div><small>Ticket médio</small><strong>{money(avg)}</strong><em>Somente atendimentos concluídos</em></div></div>
  </div>
  <div className="admin-grid-2"><section className="admin-card"><div className="admin-card-head"><div><small>AGENDA DE HOJE</small><h2>Próximos clientes</h2></div><Link href="/admin/agenda">Ver agenda</Link></div>{next.length?<div className="admin-appointment-list">{next.map(a=><div className="admin-appointment-row" key={a.id}><div className="admin-time"><Clock3 size={15}/><strong>{a.time}</strong></div><div className="admin-client"><strong>{a.customer}</strong><span>{a.serviceNames.join(' + ')}</span></div><div className="admin-barber">{a.barberName}</div><span className={`status-badge ${a.status}`}>{statusLabel[a.status]}</span></div>)}</div>:<div className="admin-empty">Nenhum agendamento para hoje.</div>}</section>
   <section className="admin-card"><div className="admin-card-head"><div><small>EQUIPE</small><h2>Funcionários</h2></div><Link href="/admin/profissionais">Gerenciar</Link></div><div className="admin-team-list">{employees.map(e=><div key={e.id}><span className="admin-avatar">{e.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span><div><strong>{e.name}</strong><small>{e.role} • Comissão {e.commission}%</small></div><span className={`employee-dot ${e.active?'active':''}`}/></div>)}</div></section>
  </div>
 </>
}