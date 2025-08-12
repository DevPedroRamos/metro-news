
-- 1) Tabela base pública para o "payments.resume"
create table if not exists public.payments_resume (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  period_start date not null,
  period_end date not null,
  -- Receita
  valor_base numeric not null default 0,
  pagar numeric not null default 0,
  comissao numeric not null default 0,
  premio numeric not null default 0,
  saldo_cef numeric not null default 0,
  outras numeric not null default 0,
  -- Descontos
  adiantamento numeric not null default 0,
  antecipacao numeric not null default 0,
  distrato numeric not null default 0,
  outros_desc numeric not null default 0,
  saldo_permuta numeric not null default 0,
  saldo_neg_periodos_anteriores numeric not null default 0,
  -- Metadados
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Restrições
  constraint payments_resume_period_check check (period_end >= period_start),
  constraint payments_resume_user_fk
    foreign key (user_id) references public.profiles(id) on delete cascade
);

-- Índices úteis
create index if not exists idx_payments_resume_user on public.payments_resume(user_id);
create index if not exists idx_payments_resume_period on public.payments_resume(period_start, period_end);

-- Trigger para manter updated_at
drop trigger if exists set_updated_at_payments_resume on public.payments_resume;
create trigger set_updated_at_payments_resume
before update on public.payments_resume
for each row
execute function public.update_updated_at_column();

-- 2) RLS
alter table public.payments_resume enable row level security;

-- Leitura: o usuário só lê o próprio registro; admin lê todos
drop policy if exists "Users can read own payments resume" on public.payments_resume;
create policy "Users can read own payments resume"
on public.payments_resume
for select
using (auth.uid() = user_id or has_role(auth.uid(), 'admin'));

-- Escrita: somente admin pode inserir/atualizar/excluir
drop policy if exists "Admins can manage payments resume" on public.payments_resume;
create policy "Admins can manage payments resume"
on public.payments_resume
for all
using (has_role(auth.uid(), 'admin'))
with check (has_role(auth.uid(), 'admin'));

-- 3) (Opcional) View no schema 'payments' com o nome solicitado
create schema if not exists payments;

drop view if exists payments.resume;
create view payments.resume as
  select * from public.payments_resume;
