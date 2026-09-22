export type Service = {
  id:string;
  name:string;
  description:string;
  price:number;
  duration:number;
  category:string;
  active:boolean;
  featured?:boolean;
};

export type Barber = {
  id:string;
  name:string;
  bio:string;
  specialties:string[];
  serviceIds:string[];
  active:boolean;
};

export const services: Service[] = [
  {id:'corte',name:'Corte Masculino',description:'Corte personalizado, acabamento preciso e finalização.',price:45,duration:40,category:'Cortes',active:true,featured:true},
  {id:'barba',name:'Barba',description:'Modelagem, toalha quente e acabamento para valorizar o rosto.',price:35,duration:30,category:'Barba',active:true,featured:true},
  {id:'combo',name:'Corte + Barba',description:'A experiência completa da Fiapos em uma única sessão.',price:75,duration:70,category:'Combos',active:true,featured:true},
  {id:'infantil',name:'Corte Infantil',description:'Atendimento cuidadoso e confortável para os pequenos.',price:40,duration:40,category:'Cortes',active:true},
  {id:'sobrancelha',name:'Sobrancelha',description:'Limpeza e alinhamento para um acabamento mais harmonioso.',price:15,duration:15,category:'Acabamentos',active:true},
  {id:'hidratacao',name:'Hidratação',description:'Tratamento rápido para recuperar maciez, brilho e aparência saudável.',price:30,duration:25,category:'Tratamentos',active:true},
];

export const barbers: Barber[] = [
  {id:'barber-1',name:'Profissional 01',bio:'Dado temporário para demonstração. Cadastre a equipe oficial no painel.',specialties:['Degradê','Social','Finalização'],serviceIds:['corte','barba','combo','infantil','sobrancelha','hidratacao'],active:true},
  {id:'barber-2',name:'Profissional 02',bio:'Dado temporário para demonstração. Cadastre a equipe oficial no painel.',specialties:['Barba','Navalhado','Degradê'],serviceIds:['corte','barba','combo','sobrancelha'],active:true},
];

export const haircutCatalog = [
  {id:'fade',name:'Degradê Clássico',category:'Degradê',description:'Transição suave nas laterais com topo personalizado.'},
  {id:'social',name:'Social Moderno',category:'Social',description:'Visual elegante, limpo e versátil para qualquer ocasião.'},
  {id:'navalhado',name:'Navalhado',category:'Navalhado',description:'Acabamento marcado, contraste forte e presença.'},
  {id:'afro',name:'Afro',category:'Afro',description:'Formato e acabamento valorizando a textura natural.'}
];