"use client"

import { useSaldoCef } from "@/hooks/useSaldoCef"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function SaldoCefPage() {
  const { saldoCef, loading, error } = useSaldoCef()

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
                <TableHead>Cliente</TableHead>
                <TableHead>Empreendimento</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Comissão Sinal</TableHead>
                <TableHead>Comissão VGV</TableHead>
                <TableHead>Prêmio Repasse</TableHead>
                <TableHead>VGV Vendedor</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saldoCef.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">{item.cliente}</TableCell>
                  <TableCell>{item.empreendimento}</TableCell>
                  <TableCell>{`${item.bl} - ${item.unid}`}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(item.comissao_sinal_valor)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(item.comissao_vgv_valor)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(item.vendedor_premio_repasse_fiador_valor)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(item.vendedor_vgv_valor)}</TableCell>
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
