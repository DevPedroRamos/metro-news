import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useProfileUsers } from "@/hooks/useProfileUsers";
import { InvoiceUpload } from "@/components/profile/InvoiceUpload";
import { DollarSign } from "lucide-react";
import { Calendar } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

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

interface PaymentHistoryItem {
  id: string;
  period_start: string;
  period_end: string;
  receita_total: number;
  descontos_total: number;
  total_receber: number;
  created_at: string;
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

const StatCard: React.FC<{ title: string; value: number }> = ({ title, value }) => {
  const animated = useCountUp(value);
  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-sm animate-fade-in hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{formatCurrency(animated)}</div>
      </CardContent>
    </Card>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-semibold tracking-tight mb-3">{children}</h2>
);

const MetaSEO: React.FC = () => {
  useEffect(() => {
    document.title = "Pagamentos | Metro News";
    const desc = "Resumo de pagamentos: receita, descontos e saldo negativo total.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    // canonical (simple SPA handling)
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
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userLoading) return;
        
        setLoading(true);
        setError(null);
        
        if (userError) {
          throw new Error(userError);
        }
        
        if (!user?.id) {
          const errorMsg = "Usuário não autenticado";
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        console.log('Buscando pagamentos para o usuário ID:', user.id);
        
        // Buscamos os dados mais recentes do resume para este usuário
        const { data: rows, error } = await (supabase as any)
          .from('resume')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        console.log('Rows:', rows, 'Error:', error);
        if (error) throw error;
        
        const row = rows?.[0];
        if (row) {
          // Usar a data de criação do registro
          const createdDate = new Date(row.created_at);
          const createdDay = createdDate.getDay(); // 0 (domingo) a 6 (sábado)
          
          // Encontrar a última quinta-feira (dia 4) a partir da data de criação
          const lastThursday = new Date(createdDate);
          const daysSinceLastThursday = (createdDay + 7 - 4) % 7 || 7;
          lastThursday.setDate(createdDate.getDate() - daysSinceLastThursday);
          
          // Encontrar a próxima quarta-feira (6 dias após a última quinta)
          const nextWednesday = new Date(lastThursday);
          nextWednesday.setDate(lastThursday.getDate() + 6);
          
          // Formatando as datas para DD/MM/YYYY
          const formatDate = (date: Date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          };
          
          const mapped: ApiResponse = {
            period_start: formatDate(lastThursday),
            period_end: formatDate(nextWednesday),
            receita: {
              valor_base: Number(row.valor_base || 0),
              pagar: Number(row.pagar || 0),
              comissao: Number(row.comissao || 0),
              premio: Number(row.premio || 0),
              saldo_cef: Number(row.saldo_cef || 0),
              outras: Number(row.outras || 0),
            },
            descontos: {
              adiantamento: Number(row.adiantamento || 0),
              antecipacao: Number(row.antecipacao || 0),
              distrato: Number(row.distrato || 0),
              outros: Number(row.outros || 0),
              saldo_permuta: Number(row.saldo_permuta || 0),
              saldo_neg_periodos_anteriores: Number(row.saldo_neg_periodos_anteriores || 0),
            },
            saldo_negativo_total:
              Number(row.adiantamento || 0) +
              Number(row.antecipacao || 0) +
              Number(row.distrato || 0) +
              Number(row.outros || 0) +
              Number(row.saldo_permuta || 0) +
              Number(row.saldo_neg_periodos_anteriores || 0),
          };
          setData(mapped);
        } else {
          setData({
            period_start: "",
            period_end: "",
            receita: {
              valor_base: 0,
              pagar: 0,
              comissao: 0,
              premio: 0,
              saldo_cef: 0,
              outras: 0,
            },
            descontos: {
              adiantamento: 0,
              antecipacao: 0,
              distrato: 0,
              outros: 0,
              saldo_permuta: 0,
              saldo_neg_periodos_anteriores: 0,
            },
            saldo_negativo_total: 0,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar pagamentos", err);
        setError("Não foi possível carregar os pagamentos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, userLoading, userError]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      
      try {
        setHistoryLoading(true);
        
        // Buscar histórico de pagamentos (todas as linhas, ordenadas por data de criação)
        const { data: historyData, error: historyError } = await (supabase as any)
          .from('resume')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (historyError) throw historyError;
        
        if (historyData && historyData.length > 0) {
          // Pular o primeiro item (já mostrado no topo)
          const historicalItems = historyData.slice(1).map((row: any) => {
            const receitaTotal = 
              Number(row.pagar || 0) + 
              Number(row.comissao || 0) + 
              Number(row.premio || 0) + 
              Number(row.outras || 0);
              
            const descontosTotal = 
              Number(row.adiantamento || 0) +
              Number(row.antecipacao || 0) +
              Number(row.distrato || 0) +
              Number(row.outros || 0) +
              Number(row.saldo_permuta || 0) +
              Number(row.saldo_neg_periodos_anteriores || 0);
              
            return {
              id: row.id,
              period_start: row.period_start || '',
              period_end: row.period_end || '',
              receita_total: receitaTotal,
              descontos_total: descontosTotal,
              total_receber: receitaTotal - descontosTotal,
              created_at: row.created_at
            };
          });
          
          setHistory(historicalItems);
        }
      } catch (err) {
        console.error('Erro ao carregar histórico de pagamentos:', err);
      } finally {
        setHistoryLoading(false);
      }
    };
    
    fetchHistory();
  }, [user]);

  const receitaItems = useMemo(() => ([
    { key: "valor_base", label: "Fixo", value: data?.receita.valor_base ?? 0 },
    { key: "pagar", label: "Pagamento Semanal", value: data?.receita.pagar ?? 0 },
    { key: "comissao", label: "Comissão", value: data?.receita.comissao ?? 0 },
    { key: "premio", label: "Prêmio", value: data?.receita.premio ?? 0 },
    { key: "saldo_cef", label: "Saldo Cef", value: data?.receita.saldo_cef ?? 0 },
    { key: "outras", label: "Outras", value: data?.receita.outras ?? 0 },
  ]), [data]);

  const descontoItems = useMemo(() => ([
    { key: "adiantamento", label: "Adiantamento", value: data?.descontos.adiantamento ?? 0 },
    { key: "antecipacao", label: "Antecipação", value: data?.descontos.antecipacao ?? 0 },
    { key: "distrato", label: "Distrato", value: data?.descontos.distrato ?? 0 },
    { key: "outros", label: "Outros", value: data?.descontos.outros ?? 0 },
    { key: "saldo_permuta", label: "Saldo Permuta", value: data?.descontos.saldo_permuta ?? 0 },
    { key: "saldo_neg_periodos_anteriores", label: "Saldo Neg. de Períodos Anteriores", value: data?.descontos.saldo_neg_periodos_anteriores ?? 0 },
  ]), [data]);

  const totalReceita = useMemo(() => {
    if (!data) return 0;
    return (data.receita.pagar || 0) + 
           (data.receita.comissao || 0) + 
           (data.receita.premio || 0) + 
           (data.receita.outras || 0) +
           (data.receita.saldo_cef || 0);
  }, [data]);

  const totalDescontos = useMemo(() => {
    if (!data) return 0;
    return Object.values(data.descontos).reduce((sum, value) => sum + (Number(value) || 0), 0);
  }, [data]);

  const totalReceber = useMemo(() => {
    return totalReceita - totalDescontos;
  }, [totalReceita, totalDescontos]);

  return (
    <div className="space-y-6">
      <MetaSEO />
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
      </header>

      {error && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section>
        <SectionTitle>Período</SectionTitle>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Início</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium">{data?.period_start || "—"}</div>
              </CardContent>
            </Card>
            <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Fim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium">{data?.period_end || "—"}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      <Separator />

      <section>
        <SectionTitle>Receita</SectionTitle>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {receitaItems.map((item) => (
              <StatCard key={item.key} title={item.label} value={item.value} />
            ))}
            <div className="md:col-span-2">
              <Card className="h-full bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">Total Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(totalReceita)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>

      <Separator />

      <section>
        <SectionTitle>Descontos</SectionTitle>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {descontoItems.map((item) => (
              <StatCard key={item.key} title={item.label} value={item.value} />
            ))}
            <div className="md:col-span-2">
              <Card className="h-full bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-rose-700 dark:text-rose-300">Total Descontos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-rose-700 dark:text-rose-300">
                    {formatCurrency(totalDescontos)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* Total a Receber */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total a Receber</p>
                <p className="text-xs text-green-600 dark:text-green-400">Receita total menos descontos</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(totalReceber)}
              </p>
              <div className="text-sm text-green-600 dark:text-green-400">
                <span className="font-medium">Receita:</span> {formatCurrency(totalReceita)} • 
                <span className="font-medium"> Descontos:</span> {formatCurrency(totalDescontos)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <InvoiceUpload />
      {/* Seção de Histórico de Pagamentos */}
      <section>
        {historyLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : history.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico de Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Receita Total</TableHead>
                      <TableHead className="text-right">Total de Descontos</TableHead>
                      <TableHead className="text-right">Total a Receber</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">
                            {item.period_start} - {item.period_end}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium text-green-600">
                            {formatCurrency(item.receita_total)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-rose-600">
                            {formatCurrency(item.descontos_total)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-bold">
                            {formatCurrency(item.total_receber)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum histórico de pagamento anterior encontrado.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

        {/* Teste */}
      
    </div>
  );
};

export default Pagamentos;