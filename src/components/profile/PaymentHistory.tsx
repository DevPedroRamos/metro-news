import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Calendar, DollarSign, Download, FileText, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { useInvoiceUploads } from "@/hooks/useInvoiceUploads";

const PaymentHistorySkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-48" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export function PaymentHistory() {
  const { data: paymentHistory, loading, error, refetch } = usePaymentHistory();
  const { allInvoices, downloadInvoice } = useInvoiceUploads();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getInvoiceForWeek = (weekStart: string) => {
    // Converte a data da semana para Date e procura comprovante do período correspondente
    const [day, month, year] = weekStart.split('/');
    const weekDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return allInvoices.find(invoice => {
      if (!invoice.created_at) return false;
      const invoiceDate = new Date(invoice.created_at);
      
      // Verifica se o comprovante foi enviado na mesma semana
      const weekStartDate = new Date(weekDate);
      const weekEndDate = new Date(weekDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      
      return invoiceDate >= weekStartDate && invoiceDate <= weekEndDate;
    });
  };

  const handleDownloadInvoice = async (weekStart: string) => {
    const invoice = getInvoiceForWeek(weekStart);
    if (invoice) {
      await downloadInvoice(invoice);
    }
  };

  if (loading) {
    return <PaymentHistorySkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Erro ao carregar histórico</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refetch}
                className="mt-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum pagamento encontrado</p>
            <p className="text-muted-foreground">
              Seu histórico de pagamentos aparecerá aqui quando disponível.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalReceita = paymentHistory.reduce((sum, week) => sum + week.totalValue, 0);
  const totalSemanas = paymentHistory.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Histórico de Pagamentos
        </CardTitle>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Total: {formatCurrency(totalReceita)}</span>
          </div>
          <div>
            <span>{totalSemanas} semana{totalSemanas !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Nº de Pagamentos</TableHead>
                <TableHead>Comprovante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((week) => {
                const invoice = getInvoiceForWeek(week.weekStart);
                
                return (
                  <TableRow key={`${week.weekStart}-${week.weekEnd}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {week.weekStart} - {week.weekEnd}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-mono font-medium text-green-700">
                          {formatCurrency(week.totalValue)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {week.paymentCount} pagamento{week.paymentCount !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      {invoice ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Enviado
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(week.weekStart)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Não enviado
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}