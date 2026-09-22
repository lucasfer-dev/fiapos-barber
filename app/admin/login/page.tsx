'use client';
import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {LockKeyhole, Scissors, ShieldCheck} from 'lucide-react';

export default function AdminLoginPage(){
  const router=useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault(); setError(''); setLoading(true);
    try{
      const response=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok){setError(data.error||'Não foi possível entrar.');return;}
      router.replace('/admin'); router.refresh();
    }finally{setLoading(false)}
  }

  return <main className="admin-login-page"><section className="admin-login-card">
    <div className="admin-login-brand"><span><Scissors size={24}/></span><div><strong>FIAPOS</strong><small>PAINEL ADMINISTRATIVO</small></div></div>
    <div className="admin-login-copy"><div className="admin-login-icon"><LockKeyhole size={24}/></div><span className="eyebrow dark">Acesso restrito</span><h1>Administração da barbearia</h1><p>Este ambiente é exclusivo do administrador responsável pela operação da Fiapos.</p></div>
    <form onSubmit={submit} className="admin-login-form">
      <label><span>E-mail administrativo</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required placeholder="admin@fiapos.com"/></label>
      <label><span>Senha</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required placeholder="••••••••"/></label>
      {error&&<div className="admin-login-error">{error}</div>}
      <button className="btn btn-primary btn-block btn-lg" disabled={loading}>{loading?'Entrando...':'Entrar no painel'}</button>
    </form>
    <div className="admin-login-security"><ShieldCheck size={16}/><span>Sessão protegida por cookie HTTP-only. Configure as credenciais no arquivo <strong>.env.local</strong>.</span></div>
  </section></main>
}
