import {NextResponse} from 'next/server'; import {getAvailableSlots} from '@/lib/availability';
export async function POST(req:Request){const body=await req.json(); const duration=Number(body.duration||40); const slots=getAvailableSlots({duration,buffer:Number(body.buffer||0),busy:body.busy||[]}); return NextResponse.json({slots});}
