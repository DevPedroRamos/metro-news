import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

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

const StatCard: React.FC<{ title: string; value: number }>
  = ({ title, value }) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.functions.invoke<ApiResponse>("pagamentos");
        if (error) throw error as unknown as Error;
        setData(data ?? null);
      } catch (err) {
        console.error("Erro ao carregar pagamentos", err);
        setError("Não foi possível carregar os pagamentos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {receitaItems.map((item) => (
              <StatCard key={item.key} title={item.label} value={item.value} />
            ))}
          </div>
        )}
      </section>

      <Separator />

      <section>
        <SectionTitle>Descontos</SectionTitle>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {descontoItems.map((item) => (
              <StatCard key={item.key} title={item.label} value={item.value} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {loading ? (
            <Skeleton className="h-28" />
          ) : (
            <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Saldo Negativo total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-destructive">
                  {formatCurrency(data?.saldo_negativo_total ?? 0)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Pagamentos;
