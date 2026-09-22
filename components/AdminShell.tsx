'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {CalendarDays,CalendarRange,LayoutDashboard,LogOut,Scissors,Settings,UsersRound,WalletCards} from 'lucide-react';
const links=[
 ['/admin','Visão geral',LayoutDashboard],['/admin/agenda','Agenda',CalendarDays],['/admin/agendamentos','Agendamentos',CalendarRange],['/admin/faturamento','Faturamento',WalletCards],['/admin/profissionais','Funcionários',UsersRound],['/admin/servicos','Serviços',Scissors],['/admin/configuracoes','Configurações',Settings]
] as const;
export function AdminShell({children}:{children:React.ReactNode}){
 const path=usePathname();const router=useRouter();
 async function logout(){await fetch('/api/admin/logout',{method:'POST'});router.replace('/admin/login');router.refresh()}
 return <div className="admin-shell"><aside className="sidebar"><div className="sidebar-brand"><span><Scissors size={20}/></span><div><strong>FIAPOS</strong><small>ADMINISTRAÇÃO</small></div></div><nav>{links.map(([h,l,Icon])=><Link className={path===h?'active':''} href={h} key={h}><Icon size={17}/><span>{l}</span></Link>)}</nav><div className="sidebar-bottom"><div><span className="admin-avatar">AD</span><p><strong>Administrador</strong><small>Acesso exclusivo</small></p></div><button onClick={logout} title="Sair"><LogOut size={17}/></button></div></aside><main className="admin-main">{children}</main></div>
}
