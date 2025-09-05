
-- 1) Adicionar coluna periodo_id em todas as tabelas do schema payments (exceto payments.periodo)
alter table payments.resume add column if not exists periodo_id bigint;
alter table payments.premiacao add column if not exists periodo_id bigint;
alter table payments.distrato add column if not exists periodo_id bigint;
alter table payments.outros add column if not exists periodo_id bigint;
alter table payments.saldo_cef add column if not exists periodo_id bigint;
alter table payments."base-de-vendas" add column if not exists periodo_id bigint;

-- 2) Adicionar chaves estrangeiras para payments.periodo(id)
-- Observação: Postgres não suporta IF NOT EXISTS para constraints; assumimos que é a primeira execução.
alter table payments.resume
  add constraint resume_periodo_id_fkey
  foreign key (periodo_id) references payments.periodo(id)
  on update cascade on delete restrict;

alter table payments.premiacao
  add constraint premiacao_periodo_id_fkey
  foreign key (periodo_id) references payments.periodo(id)
  on update cascade on delete restrict;

alter table payments.distrato
  add constraint distrato_periodo_id_fkey
  foreign key (periodo_id) references payments.periodo(id)
  on update cascade on delete restrict;

alter table payments.outros
  add constraint outros_periodo_id_fkey
  foreign key (periodo_id) references payments.periodo(id)
  on update cascade on delete restrict;

alter table payments.saldo_cef
  add constraint saldo_cef_periodo_id_fkey
  foreign key (periodo_id) references payments.periodo(id)
  on update cascade on delete restrict;

alter table payments."base-de-vendas"
  add constraint base_de_vendas_periodo_id_fkey
  foreign key (periodo_id) references payments.periodo(id)
  on update cascade on delete restrict;

-- 3) Índices para melhorar performance de filtros por período
create index if not exists idx_payments_resume_periodo_id on payments.resume(periodo_id);
create index if not exists idx_payments_premiacao_periodo_id on payments.premiacao(periodo_id);
create index if not exists idx_payments_distrato_periodo_id on payments.distrato(periodo_id);
create index if not exists idx_payments_outros_periodo_id on payments.outros(periodo_id);
create index if not exists idx_payments_saldo_cef_periodo_id on payments.saldo_cef(periodo_id);
create index if not exists idx_payments_base_de_vendas_periodo_id on payments."base-de-vendas"(periodo_id);

-- 4) Backfill: popular periodo_id com base no intervalo de datas (created_at::date entre start e end)
-- Nota: Só atualiza linhas com created_at não nulo e periodo_id ainda nulo.
update payments.resume r
set periodo_id = p.id
from payments.periodo p
where r.periodo_id is null
  and r.created_at is not null
  and (r.created_at::date between p.start and p.end);

update payments.premiacao t
set periodo_id = p.id
from payments.periodo p
where t.periodo_id is null
  and t.created_at is not null
  and (t.created_at::date between p.start and p.end);

update payments.distrato t
set periodo_id = p.id
from payments.periodo p
where t.periodo_id is null
  and t.created_at is not null
  and (t.created_at::date between p.start and p.end);

update payments.outros t
set periodo_id = p.id
from payments.periodo p
where t.periodo_id is null
  and t.created_at is not null
  and (t.created_at::date between p.start and p.end);

update payments.saldo_cef t
set periodo_id = p.id
from payments.periodo p
where t.periodo_id is null
  and t.created_at is not null
  and (t.created_at::date between p.start and p.end);

update payments."base-de-vendas" t
set periodo_id = p.id
from payments.periodo p
where t.periodo_id is null
  and t.created_at is not null
  and (t.created_at::date between p.start and p.end);
