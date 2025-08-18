import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, DollarSign, Calendar } from "lucide-react";
import { InvoiceUpload } from "@/components/profile/InvoiceUpload";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { usePayments } from "@/hooks/usePayments";

const useCountUp = (value: number, duration = 800) => {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
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
  React.useEffect(() => {
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
    descontoItems,
  } = usePayments();

  return (
    <div className="space-y-6">
      <MetaSEO />
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
    </div>
  );
};

export default Pagamentos;