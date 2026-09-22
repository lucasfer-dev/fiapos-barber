'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';
import {ArrowRight, Check, Clock3, Plus, ShoppingBag, Trash2} from 'lucide-react';
import {PublicLayout} from '@/components/PublicLayout';
import {services} from '@/lib/demo-data';

const money=(v:number)=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

export default function Page(){
  const [selected,setSelected]=useState<string[]>([]);
  const categories=['Todos',...Array.from(new Set(services.map(s=>s.category)))];
  const [category,setCategory]=useState('Todos');
  const visible=category==='Todos'?services:services.filter(s=>s.category===category);
  const chosen=services.filter(s=>selected.includes(s.id));
  const total=useMemo(()=>chosen.reduce((n,s)=>n+s.price,0),[chosen]);
  const duration=useMemo(()=>chosen.reduce((n,s)=>n+s.duration,0),[chosen]);
  const toggle=(id:string)=>setSelected(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
  const bookingHref=selected.length?`/agendar?services=${selected.join(',')}`:'/agendar';
  return <PublicLayout><main className="section section-light services-page"><div className="container">
    <div className="page-hero"><div><span className="eyebrow dark">Serviços Fiapos</span><h1>Monte seu atendimento do seu jeito.</h1><p>Escolha um ou vários serviços. O sistema soma o tempo e o valor e encontra um horário que comporte tudo em uma única reserva.</p></div><div className="page-hero-note"><ShoppingBag size={22}/><div><strong>Seleção múltipla</strong><span>Adicione quantos serviços quiser</span></div></div></div>
    <div className="category-tabs">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'active':''}>{c}</button>)}</div>
    <div className="services-layout"><div className="service-list">{visible.map(s=>{const isSelected=selected.includes(s.id);return <article className={`service-list-card ${isSelected?'selected':''}`} key={s.id}><button className="service-select" onClick={()=>toggle(s.id)} aria-label={`${isSelected?'Remover':'Adicionar'} ${s.name}`}><span className="service-check">{isSelected?<Check size={18}/>:<Plus size={18}/>}</span></button><div className="service-list-main"><div className="service-list-title"><div><span>{s.category}</span><h3>{s.name}</h3></div><strong>{money(s.price)}</strong></div><p>{s.description}</p><div className="service-list-footer"><span><Clock3 size={16}/>{s.duration} minutos</span><button onClick={()=>toggle(s.id)}>{isSelected?'Remover':'Adicionar serviço'}</button></div></div></article>})}</div>
      <aside className="cart-panel"><div className="cart-title"><div><span className="eyebrow dark">Sua seleção</span><h3>Seus serviços</h3></div><span className="cart-count">{chosen.length}</span></div>{chosen.length===0?<div className="empty-cart"><ShoppingBag size={30}/><strong>Nenhum serviço ainda</strong><p>Adicione os serviços que você quer fazer na mesma visita.</p></div>:<div className="cart-items">{chosen.map(s=><div className="cart-item" key={s.id}><div><strong>{s.name}</strong><span>{s.duration} min • {money(s.price)}</span></div><button onClick={()=>toggle(s.id)} aria-label={`Remover ${s.name}`}><Trash2 size={17}/></button></div>)}</div>}<div className="cart-totals"><div><span>Duração estimada</span><strong>{duration} min</strong></div><div className="grand-total"><span>Total</span><strong>{money(total)}</strong></div></div><Link className={`btn btn-primary btn-block ${!chosen.length?'disabled-link':''}`} href={bookingHref}>Continuar para agendamento <ArrowRight size={17}/></Link><small>O horário disponível será calculado com base em {duration||'toda a'} duração selecionada.</small></aside>
    </div>
  </div></main></PublicLayout>
}
