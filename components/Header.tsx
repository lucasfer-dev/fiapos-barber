import Link from 'next/link';
import { CalendarDays, UserRound } from 'lucide-react';

export function Header(){
  return <>
    <div className="topbar"><div className="container topbar-inner"><span>Nova Iguaçu • RJ</span><span>Tradição, técnica e atendimento com hora marcada</span></div></div>
    <header className="header">
      <div className="container nav">
        <Link className="brand" href="/" aria-label="Fiapos Barbershop - início">
          <span className="brand-mark">F</span>
          <span className="brand-copy"><strong>FIAPOS</strong><small>BARBERSHOP</small></span>
        </Link>
        <nav className="navlinks" aria-label="Navegação principal">
          <Link href="/">Início</Link><Link href="/servicos">Serviços</Link><Link href="/cortes">Cortes</Link><Link href="/profissionais">Equipe</Link><Link href="/sobre">A Fiapos</Link><Link href="/contato">Contato</Link>
        </nav>
        <div className="nav-actions">
          <Link className="icon-link" href="/meus-agendamentos" aria-label="Meus agendamentos"><UserRound size={18}/></Link>
          <Link className="btn btn-primary nav-cta" href="/agendar"><CalendarDays size={17}/> Agendar</Link>
        </div>
      </div>
    </header>
  </>
}