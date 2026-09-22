export type BusyRange = { start: string; end: string };
const toMinutes = (value:string) => { const [h,m]=value.split(':').map(Number); return h*60+m; };
const toTime = (minutes:number) => `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
export function getAvailableSlots({open='09:00',close='20:00',duration,buffer=0,busy=[]}:{open?:string;close?:string;duration:number;buffer?:number;busy?:BusyRange[]}) {
 const slots:string[]=[]; const step=15; const endLimit=toMinutes(close); const total=duration+buffer;
 for(let start=toMinutes(open); start+duration<=endLimit; start+=step){
   const end=start+total;
   const conflict=busy.some(b => start < toMinutes(b.end) && end > toMinutes(b.start));
   if(!conflict) slots.push(toTime(start));
 }
 return slots;
}