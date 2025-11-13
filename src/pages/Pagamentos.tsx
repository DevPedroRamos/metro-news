"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InvoiceUpload } from "@/components/profile/InvoiceUpload";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Info, TrendingUp, DollarSign, Calendar, Award, CreditCard, Wallet, Target, Gift, Banknote, AlertTriangle, ArrowDown, ArrowUp, Clock, CheckCircle } from "lucide-react";
import { useProfileUsers } from "@/hooks/useProfileUsers";
import { usePayments } from "@/hooks/usePayments";
import { UserSelector } from "@/components/pagamentos/UserSelector";
import type { UserSearchResult } from "@/hooks/useUserSearch";
interface ApiResponse {
  period_start: string;
  period_end: string;
  receita: {
    valor_base: number;
    pagar: number;
    comissao: number;
    premio: number;
    saldo_cef: number;
    outras: number;
  };
  descontos: {
    adiantamento: number;
    antecipacao: number;
    distrato: number;
    outros: number;
    saldo_permuta: number;
    saldo_neg_periodos_anteriores: number;
  };
  saldo_negativo_total: number;
}
const useCountUp = (value: number, duration = 800) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const startValue = display;
    const delta = value - startValue;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(startValue + delta * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);
  return display;
};
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  type?: "positive" | "negative" | "neutral";
}> = ({
  title,
  value,
  icon,
  type = "neutral"
}) => {
  const animated = useCountUp(value);
  const getTextColor = () => {
    if (type === "positive") return "text-gray-900";
    if (type === "negative") return "text-gray-900";
    return "text-gray-900";
  };
  const getIconBg = () => {
    return "bg-gray-50 text-gray-600";
  };
  return <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${getIconBg()}`}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-sm font-bold ${getTextColor()}`}>{formatCurrency(animated)}</div>
      </CardContent>
    </Card>;
};
const SectionHeader: React.FC<{
  title: string;
  icon: React.ReactNode;
  description?: string;
}> = ({
  title,
  icon,
  description
}) => <div className="flex items-center gap-3 mb-6">
    <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">{icon}</div>
    <div>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  </div>;
const MetaSEO: React.FC = () => {
  useEffect(() => {
    document.title = "Pagamentos | Metrocasa";
    const desc = "Resumo de pagamentos: receita, descontos e saldo negativo total.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.href);
  }, []);
  return null;
};
const Pagamentos: React.FC = () => {
  const { userData } = useProfileUsers();
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const isAdmin = userData?.role === 'adm';
  
  const {
    data,
    loading,
    error,
    history,
    historyLoading,
    totalReceita,
    totalDescontos,
    totalReceber,
    receitaItems,
    descontoItems
  } = usePayments(selectedUser?.cpf);
  const receitaItemsWithIcons = useMemo(() => {
    // Filter out the "valor_base" (Fixo) item
    const filteredItems = receitaItems.filter(item => item.key !== 'valor_base');
    return [
      { ...filteredItems[0], icon: <Calendar className="h-5 w-5" /> }, // pagar - Pagamento Semanal
      { ...filteredItems[1], icon: <TrendingUp className="h-5 w-5" /> }, // comissao
      { ...filteredItems[2], icon: <Award className="h-5 w-5" /> }, // premio
      { ...filteredItems[3], icon: <Wallet className="h-5 w-5" /> }, // saldo_cef
      { ...filteredItems[4], icon: <Gift className="h-5 w-5" /> }, // outras
    ];
  }, [receitaItems]);

  const descontoItemsWithIcons = useMemo(() => [
    { ...descontoItems[0], icon: <ArrowDown className="h-5 w-5" /> },
    { ...descontoItems[1], icon: <Clock className="h-5 w-5" /> },
    { ...descontoItems[2], icon: <AlertTriangle className="h-5 w-5" /> },
    { ...descontoItems[3], icon: <CreditCard className="h-5 w-5" /> },
    { ...descontoItems[4], icon: <ArrowDown className="h-5 w-5" /> },
    { ...descontoItems[5], icon: <ArrowDown className="h-5 w-5" /> },
  ], [descontoItems]);

  const saldoLiquido = totalReceber;
  return <div className="min-h-screen bg-gray-50">
      <MetaSEO />

      <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="max-w-7xl mx-auto p-6">
          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Selecionar Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <UserSelector 
                  selectedUser={selectedUser}
                  onSelectUser={setSelectedUser}
                />
                {!selectedUser && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selecione um usuário para visualizar seu resumo de pagamento
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="flex items-center gap-4">{/* ... keep existing code */}
            <div className="p-4 bg-red-600 text-white rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Central de Pagamentos</h1>
              <p className="text-gray-600 text-sm">Acompanhe sua performance financeira</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        {error && <Alert className="border-red-200 bg-red-50">
            <Info className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Erro</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>}

        {/* Período */}
        <section>
          <SectionHeader title="Período de Referência" icon={<Calendar className="h-4 w-4" />} description="Período atual de cálculo dos pagamentos" />
          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-gray-900">Data de Início</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold text-gray-900">{data?.period_start || "—"}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-gray-900">Data de Fim</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold text-gray-900">{data?.period_end || "—"}</div>
                </CardContent>
              </Card>
            </div>}
        </section>

        <Separator className="my-12" />

        {/* Receita */}
        <section>
          <SectionHeader title="Receitas" icon={<TrendingUp className="h-4 w-4" />} description="Todas as fontes de receita do período" />
          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-32 md:col-span-2 lg:col-span-2" />
              {Array.from({
            length: 4
          }).map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receitaItemsWithIcons.map((item, index) => 
                index === 0 ? (
                  <div key={item.key} className="md:col-span-2 lg:col-span-2">
                    <StatCard title={item.label} value={item.value} icon={item.icon} type="neutral" />
                  </div>
                ) : (
                  <StatCard key={item.key} title={item.label} value={item.value} icon={item.icon} type="neutral" />
                )
              )}
            </div>}
        </section>

        <Separator className="my-12" />

        {/* Descontos */}
        <section>
          <SectionHeader title="Descontos" icon={<ArrowDown className="h-4 w-4" />} description="Todos os descontos aplicados no período" />
          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({
            length: 6
          }).map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {descontoItemsWithIcons.map(item => <StatCard key={item.key} title={item.label} value={item.value} icon={item.icon} type="neutral" />)}
            </div>}
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resumo</h1>
              <p className="text-gray-600 text-sm mt-2">Valor total a receber</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <ArrowUp className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Receita Total</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(totalReceita)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <ArrowDown className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Descontos Total</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(totalDescontos)}</p>
                </div>
              </div>
            </div>
            <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${saldoLiquido >= 0 ? "bg-green-500" : "bg-red-600"}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-lime-950 font-bold">Valor da Nota</p>
                  <p className={`text-lg font-bold text-green-600`}>
                    {formatCurrency(saldoLiquido)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Upload de Comprovantes - Hidden for Admin */}
        {!isAdmin && (
          <section>
            <SectionHeader title="Enviar nota fiscal de prestação de serviço" icon={<CreditCard className="h-4 w-4" />} description="Envie seus comprovantes de pagamento" />
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <InvoiceUpload />
            </div>
          </section>
        )}

        <Separator className="my-12" />

        {/* Histórico de Pagamentos */}
        <section>
          <SectionHeader title="Histórico de Pagamentos" icon={<Calendar className="h-4 w-4" />} description="Histórico dos últimos períodos de pagamento" />
          {historyLoading ? <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div> : history.length > 0 ? <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-0">
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Período</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Receita Total</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Total de Descontos</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Total a Receber</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item, index) => <TableRow key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {item.period_start} - {item.period_end}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-semibold text-gray-900">{formatCurrency(item.receita_total)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-semibold text-gray-900">{formatCurrency(item.descontos_total)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={`font-bold ${item.total_receber >= 0 ? "text-gray-900" : "text-red-700"}`}>
                              {formatCurrency(item.total_receber)}
                            </div>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card> : <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="py-12 text-center">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Nenhum histórico encontrado</h3>
                <p className="text-gray-600">Nenhum histórico de pagamento anterior foi encontrado.</p>
              </CardContent>
            </Card>}
        </section>
      </div>
    </div>;
};
export default Pagamentos;