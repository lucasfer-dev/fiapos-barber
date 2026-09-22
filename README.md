# Fiapos Barbershop

Base funcional em Next.js + TypeScript para o sistema de agendamento e administração da Fiapos Barbearia.

## Rodar
```bash
npm install
npm run dev
```
Acesse http://localhost:3000 e /admin.

## Supabase
1. Crie um projeto Supabase.
2. Rode `supabase/migrations/001_init.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local` e preencha as chaves.
4. Substitua os seeds temporários de `lib/demo-data.ts` pelas consultas reais ao Supabase.

## Segurança importante
A migration inclui RLS e uma constraint PostgreSQL que impede sobreposição de agendamentos ativos para o mesmo barbeiro. O painel /admin ainda precisa ser conectado ao Supabase Auth para bloqueio de rota antes de publicação.

## Estado atual
- Home premium responsiva.
- Serviços e tabela de preços.
- Catálogo de cortes com referência enviada ao agendamento.
- Profissionais.
- Fluxo de agendamento completo no frontend.
- Algoritmo de disponibilidade considerando duração + buffer + horários ocupados.
- Área “Meus agendamentos”.
- Dashboard administrativo e rotas principais.
- Schema Supabase completo com RLS base e prevenção de conflito no banco.
- SEO metadata básica.

## Pendências para produção
- Credenciais Supabase e integração de persistência real.
- Login admin e proteção server-side das rotas /admin.
- CRUDs administrativos ligados ao banco.
- Upload de fotos no Supabase Storage.
- WhatsApp, endereço e horários oficiais.
- Fotos e dados oficiais da equipe/catálogo.

## Painel administrativo

Acesse `/admin`. O painel possui login exclusivo para um único administrador e permite:

- acompanhar a agenda do dia;
- criar, confirmar, concluir, cancelar e excluir agendamentos;
- acompanhar faturamento realizado e previsto;
- visualizar ticket médio e faturamento por profissional;
- cadastrar, ativar/desativar e excluir funcionários;
- configurar comissão e especialidades da equipe.

### Credenciais

Crie `.env.local` e defina:

```env
ADMIN_EMAIL=seu-email@dominio.com
ADMIN_PASSWORD=uma-senha-forte
ADMIN_SESSION_SECRET=uma-chave-longa-e-aleatoria-com-mais-de-32-caracteres
```

Em desenvolvimento, caso essas variáveis não existam, o projeto usa apenas localmente:

- e-mail: `admin@fiapos.local`
- senha: `Fiapos@2026`

Não publique usando as credenciais de desenvolvimento.

### Persistência desta demonstração

As telas administrativas funcionam imediatamente e armazenam os dados no `localStorage` do navegador. A estrutura SQL em `supabase/migrations` está preparada para levar a persistência para Supabase/PostgreSQL em produção, inclusive com relação N:N entre agendamentos e serviços.
