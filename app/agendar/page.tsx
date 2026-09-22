import {Suspense} from 'react';
import {BookingClient} from '@/components/BookingClient';

export default function BookingPage(){
  return <Suspense fallback={<div style={{minHeight:'70vh',background:'#f4f1eb'}}/>}><BookingClient/></Suspense>
}
