'use client';

export type AppointmentStatus='pending'|'confirmed'|'completed'|'cancelled';
export type AdminAppointment={
  id:string; customer:string; phone:string; serviceNames:string[]; barberId:string; barberName:string;
  date:string; time:string; duration:number; total:number; status:AppointmentStatus; notes?:string; createdAt:string;
};
export type Employee={
  id:string; name:string; role:string; phone:string; specialties:string[]; active:boolean; commission:number;
};

type Store={appointments:AdminAppointment[];employees:Employee[]};
const KEY='fiapos_admin_store_v2';

function isoDate(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)}
function seed():Store{return {
  employees:[
    {id:'barber-1',name:'Profissional 01',role:'Barbeiro',phone:'(21) 99999-1001',specialties:['Degradê','Social','Finalização'],active:true,commission:40},
    {id:'barber-2',name:'Profissional 02',role:'Barbeiro',phone:'(21) 99999-1002',specialties:['Barba','Navalhado','Degradê'],active:true,commission:40},
  ],
  appointments:[
    {id:'apt-1',customer:'Rafael Lima',phone:'(21) 99911-2233',serviceNames:['Corte Masculino','Barba'],barberId:'barber-1',barberName:'Profissional 01',date:isoDate(0),time:'10:00',duration:70,total:80,status:'confirmed',createdAt:new Date().toISOString()},
    {id:'apt-2',customer:'Bruno Costa',phone:'(21) 99822-3344',serviceNames:['Corte Masculino'],barberId:'barber-2',barberName:'Profissional 02',date:isoDate(0),time:'14:30',duration:40,total:45,status:'pending',createdAt:new Date().toISOString()},
    {id:'apt-3',customer:'Matheus Alves',phone:'(21) 99733-4455',serviceNames:['Corte + Barba'],barberId:'barber-1',barberName:'Profissional 01',date:isoDate(-1),time:'16:00',duration:70,total:75,status:'completed',createdAt:new Date().toISOString()},
    {id:'apt-4',customer:'Diego Santos',phone:'(21) 99644-5566',serviceNames:['Corte Masculino','Sobrancelha'],barberId:'barber-2',barberName:'Profissional 02',date:isoDate(-2),time:'11:00',duration:55,total:60,status:'completed',createdAt:new Date().toISOString()},
  ]
}}

export function readStore():Store{
  if(typeof window==='undefined') return seed();
  try{const raw=localStorage.getItem(KEY);if(raw)return JSON.parse(raw) as Store}catch{}
  const initial=seed();localStorage.setItem(KEY,JSON.stringify(initial));return initial;
}
export function writeStore(store:Store){if(typeof window!=='undefined'){localStorage.setItem(KEY,JSON.stringify(store));window.dispatchEvent(new Event('fiapos-store-change'))}}
export function subscribeStore(callback:()=>void){window.addEventListener('storage',callback);window.addEventListener('fiapos-store-change',callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener('fiapos-store-change',callback)}}
export function addPublicAppointment(input:Omit<AdminAppointment,'id'|'createdAt'>){const store=readStore();store.appointments.unshift({...input,id:`apt-${Date.now()}`,createdAt:new Date().toISOString()});writeStore(store)}