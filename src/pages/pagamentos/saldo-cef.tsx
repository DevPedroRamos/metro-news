"use client"

import { useSaldoCef } from "@/hooks/useSaldoCef"
import { useProfileUsers } from "@/hooks/useProfileUsers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function SaldoCefPage() {
  const { saldoCef, loading, error } = useSaldoCef()
  const { userData } = useProfileUsers()

  // Definir variáveis de controle de visualização
  const isGerente = userData?.role === 'gerente'
  const isSuperintendente = userData?.role === 'superintendente'

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
  }

  if (loading) {
    return <p className="p-4">Carregando saldo CEF...</p>
  }

  if (error) {
    return <p className="p-4 text-red-500">Erro ao carregar: {error}</p>
  }

  if (!saldoCef || saldoCef.length === 0) {
    return <p className="p-4">Nenhum registro de saldo CEF encontrado para o período.</p>
  }

  return (
    <div className="max-w-[1800px] w-[100%] overflow-x-auto">
      <Card>
        <CardHeader>
          <CardTitle>Saldo CEF</CardTitle>
          <CardDescription>Comissões e valores referentes ao período</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2}>Cliente</TableHead>
                <TableHead rowSpan={2}>Empreendimento</TableHead>
                <TableHead rowSpan={2}>Unidade</TableHead>
                <TableHead colSpan={4} className="text-center bg-blue-50/10 dark:bg-blue-950/20">Vendedor</TableHead>
                {(isGerente || isSuperintendente) && (
                  <TableHead colSpan={4} className="text-center bg-green-50/10 dark:bg-green-950/20">Gerente</TableHead>
                )}
                {isSuperintendente && (
                  <TableHead colSpan={4} className="text-center bg-purple-50/10 dark:bg-purple-950/20">Superintendente</TableHead>
                )}
                <TableHead rowSpan={2}>Subtotal</TableHead>
                <TableHead rowSpan={2}>Total</TableHead>
                <TableHead rowSpan={2}>Data</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="bg-blue-50/10 dark:bg-blue-950/20">Comissão Sinal</TableHead>
                <TableHead className="bg-blue-50/10 dark:bg-blue-950/20">VGV</TableHead>
                <TableHead className="bg-blue-50/10 dark:bg-blue-950/20">Prêmio</TableHead>
                <TableHead className="bg-blue-50/10 dark:bg-blue-950/20">VGV Valor</TableHead>
                
                {(isGerente || isSuperintendente) && (
                  <>
                    <TableHead className="bg-green-50/10 dark:bg-green-950/20">Comissão Sinal</TableHead>
                    <TableHead className="bg-green-50/10 dark:bg-green-950/20">VGV</TableHead>
                    <TableHead className="bg-green-50/10 dark:bg-green-950/20">Prêmio</TableHead>
                    <TableHead className="bg-green-50/10 dark:bg-green-950/20">VGV Valor</TableHead>
                  </>
                )}
                
                {isSuperintendente && (
                  <>
                    <TableHead className="bg-purple-50/10 dark:bg-purple-950/20">Comissão Sinal</TableHead>
                    <TableHead className="bg-purple-50/10 dark:bg-purple-950/20">VGV</TableHead>
                    <TableHead className="bg-purple-50/10 dark:bg-purple-950/20">Prêmio</TableHead>
                    <TableHead className="bg-purple-50/10 dark:bg-purple-950/20">VGV Valor</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {saldoCef.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">{item.cliente}</TableCell>
                  <TableCell>{item.empreendimento}</TableCell>
                  <TableCell>{`${item.bl} - ${item.unid}`}</TableCell>
                  
                  {/* Vendedor */}
                  <TableCell className="whitespace-nowrap bg-blue-50/5 dark:bg-blue-950/10">{formatCurrency(item.comissao_sinal_valor)}</TableCell>
                  <TableCell className="whitespace-nowrap bg-blue-50/5 dark:bg-blue-950/10">{formatCurrency(item.comissao_vgv_valor)}</TableCell>
                  <TableCell className="whitespace-nowrap bg-blue-50/5 dark:bg-blue-950/10">{formatCurrency(item.premio_repasse_fiador_valor)}</TableCell>
                  <TableCell className="whitespace-nowrap bg-blue-50/5 dark:bg-blue-950/10">{formatCurrency(item.vendedor_vgv_valor)}</TableCell>
                  
                  {/* Gerente */}
                  {(isGerente || isSuperintendente) && (
                    <>
                      <TableCell className="whitespace-nowrap bg-green-50/5 dark:bg-green-950/10">{formatCurrency(item.gerente_comissao_sinal_valor)}</TableCell>
                      <TableCell className="whitespace-nowrap bg-green-50/5 dark:bg-green-950/10">{formatCurrency(item.gerente_comissao_vgv_valor)}</TableCell>
                      <TableCell className="whitespace-nowrap bg-green-50/5 dark:bg-green-950/10">{formatCurrency(item.gerente_premio_repasse_fiador_valor)}</TableCell>
                      <TableCell className="whitespace-nowrap bg-green-50/5 dark:bg-green-950/10">{formatCurrency(item.gerente_vgv_valor)}</TableCell>
                    </>
                  )}
                  
                  {/* Superintendente */}
                  {isSuperintendente && (
                    <>
                      <TableCell className="whitespace-nowrap bg-purple-50/5 dark:bg-purple-950/10">{formatCurrency(item.superintendente_comissao_sinal_valor)}</TableCell>
                      <TableCell className="whitespace-nowrap bg-purple-50/5 dark:bg-purple-950/10">{formatCurrency(item.superintendente_comissao_vgv_valor)}</TableCell>
                      <TableCell className="whitespace-nowrap bg-purple-50/5 dark:bg-purple-950/10">{formatCurrency(item.superintendente_premio_repasse_fiador_valor)}</TableCell>
                      <TableCell className="whitespace-nowrap bg-purple-50/5 dark:bg-purple-950/10">{formatCurrency(item.superintendente_vgv_valor)}</TableCell>
                    </>
                  )}
                  
                  <TableCell className="whitespace-nowrap font-medium">{formatCurrency(item.subtotal)}</TableCell>
                  <TableCell className="whitespace-nowrap font-bold">{formatCurrency(item.total)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(item.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
