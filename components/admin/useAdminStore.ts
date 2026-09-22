'use client';
import {useEffect,useState} from 'react';
import {readStore,subscribeStore,writeStore,type AdminAppointment,type Employee} from '@/lib/admin-store';

export function useAdminStore(){
  const [appointments,setAppointmentsState]=useState<AdminAppointment[]>([]);
  const [employees,setEmployeesState]=useState<Employee[]>([]);
  const refresh=()=>{const s=readStore();setAppointmentsState(s.appointments);setEmployeesState(s.employees)};
  useEffect(()=>{refresh();return subscribeStore(refresh)},[]);
  const persist=(nextA=appointments,nextE=employees)=>{writeStore({appointments:nextA,employees:nextE});setAppointmentsState(nextA);setEmployeesState(nextE)};
  return {appointments,employees,setAppointments:(a:AdminAppointment[])=>persist(a,employees),setEmployees:(e:Employee[])=>persist(appointments,e),refresh};
}