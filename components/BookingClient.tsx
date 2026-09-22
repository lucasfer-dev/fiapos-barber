'use client';
import {useMemo,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {ArrowRight,CalendarDays,Check,Clock3,Scissors,ShoppingBag,UserRound} from 'lucide-react';
import {PublicLayout} from '@/components/PublicLayout';
import {services,barbers,haircutCatalog} from '@/lib/demo-data';
import {getAvailableSlots} from '@/lib/availability';
import {addPublicAppointment} from '@/lib/admin-store';

const money=(v:number)=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const stages=['Serviços','Profissional','Data','Horário','Seus dados','Confirmar'];

export function BookingClient(){
  const q=useSearchParams();
  const queryServices=(q.get('services')||q.get('service')||'').split(',').filter(Boolean).filter(id=>services.some(s=>s.id===id));
  const [selectedIds,setSelectedIds]=useState<string[]>(queryServices.length?queryServices:[services[0].id]);
  const [barber,setBarber]=useState(q.get('barber')||'any');
  const [date,setDate]=useState('');
  const [slot,setSlot]=useState('');
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [email,setEmail]=useState('');
  const [done,setDone]=useState(false);
  const haircut=haircutCatalog.find(h=>h.id===q.get('haircut'));
  const selected=services.filter(s=>selectedIds.includes(s.id));
  const duration=selected.reduce((n,s)=>n+s.duration,0);
  const total=selected.reduce((n,s)=>n+s.price,0);
  const compatible=barbers.filter(b=>b.active && selectedIds.every(id=>b.serviceIds.includes(id)));
  const effectiveBarber=barber==='any'||compatible.some(b=>b.id===barber)?barber:'any';
  const slots=useMemo(()=>getAvailableSlots({duration,buffer:10,busy:[{start:'10:00',end:'11:10'},{start:'14:00',end:'15:00'}]}),[duration]);
  const toggleService=(id:string)=>{setSelectedIds(curr=>curr.includes(id)?(curr.length===1?curr:curr.filter(x=>x!==id)):[...curr,id]);setSlot('');setBarber('any')};
  const canConfirm=date&&slot&&name.trim()&&phone.trim();
  const confirmBooking=()=>{
    if(!canConfirm)return;
    const chosenBarber=effectiveBarber==='any'?compatible[0]:barbers.find(b=>b.id===effectiveBarber);
    if(!chosenBarber)return;
    addPublicAppointment({customer:name.trim(),phone:phone.trim(),serviceNames:selected.map(s=>s.name),barberId:chosenBarber.id,barberName:chosenBarber.name,date,time:slot,duration,total,status:'confirmed',notes:email?`E-mail: ${email}`:undefined});
    setDone(true);
  };

  if(done)return <PublicLayout><section className="section section-light"><div className="container booking-success"><div className="success-icon"><Check size={34}/></div><span className="eyebrow dark">Agendamento confirmado</span><h1>Pronto. Seu horário está reservado.</h1><p>Confira o resumo da sua visita à Fiapos.</p><div className="success-summary"><div><span>Serviços</span><strong>{selected.map(s=>s.name).join(' + ')}</strong></div><div><span>Profissional</span><strong>{effectiveBarber==='any'?'Qualquer profissional disponível':barbers.find(b=>b.id===effectiveBarber)?.name}</strong></div><div><span>Data e horário</span><strong>{date} às {slot}</strong></div><div><span>Duração</span><strong>{duration} min</strong></div><div><span>Total</span><strong>{money(total)}</strong></div>{haircut&&<div><span>Referência</span><strong>{haircut.name}</strong></div>}</div><div className="notice">Versão demonstrativa: ao conectar o Supabase, esta confirmação passa a persistir no banco e validar o conflito no momento da gravação.</div></div></section></PublicLayout>;

  return <PublicLayout><main className="booking-page section-light"><div className="container"><div className="booking-page-head"><div><span className="eyebrow dark">Agendamento online</span><h1>Seu horário, sem complicação.</h1><p>Monte o atendimento e veja em tempo real o tempo total e o valor da sua visita.</p></div><div className="booking-progress">{stages.map((s,i)=><div className={`progress-step ${i===0?'current':''}`} key={s}><span>{i+1}</span><small>{s}</small></div>)}</div></div>
    <div className="booking-shell"><section className="booking-main">
      <div className="booking-section"><div className="booking-section-title"><span className="section-icon"><ShoppingBag/></span><div><small>ETAPA 1</small><h2>Escolha seus serviços</h2><p>Você pode selecionar vários serviços para a mesma reserva.</p></div></div><div className="booking-service-grid">{services.map(s=>{const active=selectedIds.includes(s.id);return <button key={s.id} className={`booking-service ${active?'selected':''}`} onClick={()=>toggleService(s.id)}><span className="booking-service-check">{active?<Check size={16}/>:<span/>}</span><div><strong>{s.name}</strong><small>{s.duration} min • {money(s.price)}</small></div></button>})}</div></div>
      <div className="booking-section"><div className="booking-section-title"><span className="section-icon"><UserRound/></span><div><small>ETAPA 2</small><h2>Quem vai cuidar de você?</h2><p>Mostramos somente quem realiza todos os serviços selecionados.</p></div></div><div className="pro-choice"><button onClick={()=>setBarber('any')} className={effectiveBarber==='any'?'selected':''}><span className="avatar any"><Scissors/></span><div><strong>Primeiro disponível</strong><small>Mais opções de horário</small></div><Check size={18}/></button>{compatible.map(b=><button key={b.id} onClick={()=>setBarber(b.id)} className={effectiveBarber===b.id?'selected':''}><span className="avatar">{b.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><strong>{b.name}</strong><small>{b.specialties.join(' • ')}</small></div>{effectiveBarber===b.id&&<Check size={18}/>}</button>)}</div></div>
      <div className="booking-two-col"><div className="booking-section"><div className="booking-section-title compact"><span className="section-icon"><CalendarDays/></span><div><small>ETAPA 3</small><h2>Escolha a data</h2></div></div><label className="date-field"><span>Data do atendimento</span><input type="date" value={date} onChange={e=>{setDate(e.target.value);setSlot('')}}/></label></div><div className="booking-section"><div className="booking-section-title compact"><span className="section-icon"><Clock3/></span><div><small>ETAPA 4</small><h2>Escolha o horário</h2></div></div>{date?<div className="slots modern">{slots.slice(0,16).map(s=><button className={`slot ${slot===s?'selected':''}`} key={s} onClick={()=>setSlot(s)}>{s}</button>)}</div>:<div className="booking-placeholder"><CalendarDays size={26}/><span>Escolha uma data para ver os horários.</span></div>}</div></div>
      <div className="booking-section"><div className="booking-section-title"><span className="section-icon"><UserRound/></span><div><small>ETAPA 5</small><h2>Seus dados</h2><p>Usaremos essas informações para identificar a reserva.</p></div></div><div className="form-grid"><label className="field"><span>Nome</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome completo"/></label><label className="field"><span>WhatsApp</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(21) 99999-9999"/></label><label className="field full"><span>E-mail <em>opcional</em></span><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="voce@email.com"/></label></div></div>
    </section>
    <aside className="booking-summary"><div className="summary-top"><span className="eyebrow dark">Sua reserva</span><h3>Resumo do atendimento</h3></div><div className="summary-services">{selected.map(s=><div key={s.id}><div><strong>{s.name}</strong><span>{s.duration} min</span></div><strong>{money(s.price)}</strong></div>)}</div><div className="summary-line"><span>Profissional</span><strong>{effectiveBarber==='any'?'Primeiro disponível':barbers.find(b=>b.id===effectiveBarber)?.name}</strong></div><div className="summary-line"><span>Data</span><strong>{date||'—'}</strong></div><div className="summary-line"><span>Horário</span><strong>{slot||'—'}</strong></div>{haircut&&<div className="summary-line"><span>Referência</span><strong>{haircut.name}</strong></div>}<div className="summary-totals"><div><span>Duração total</span><strong>{duration} min</strong></div><div><span>Total</span><strong>{money(total)}</strong></div></div><button className="btn btn-primary btn-block btn-lg" disabled={!canConfirm} onClick={confirmBooking}>Confirmar agendamento <ArrowRight size={18}/></button><small className="summary-note">Ao confirmar, o sistema deve validar novamente a disponibilidade antes de salvar.</small></aside>
    </div></div></main></PublicLayout>
}