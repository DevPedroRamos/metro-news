"use client"

import { useDistrato } from "@/hooks/useDistratos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DistratosPage() {
  const { distratos, loading, error } = useDistrato()

  if (loading) {
    return <p className="p-4">Carregando distratos...</p>
  }

  if (error) {
    return <p className="p-4 text-red-500">Erro ao carregar: {error}</p>
  }

  if (!distratos || distratos.length === 0) {
    return <p className="p-4">Nenhum distrato encontrado para o período.</p>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
  }

  return (
    <div className="max-w-[1800px] w-[100%] overflow-x-auto">
      <Card>
        <CardHeader>
          <CardTitle>Distratos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Empreendimento</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead>Data do Distrato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Comissão Paga</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distratos.map((distrato) => (
                <TableRow key={distrato.id}>
                  <TableCell className="whitespace-nowrap">{distrato.cliente}</TableCell>
                  <TableCell className="whitespace-nowrap">{distrato.empreendimento}</TableCell>
                  <TableCell>{distrato.apto}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(distrato.dt_distrato)}</TableCell>
                  <TableCell>{distrato.tipo_distrato}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{distrato.motivo}</TableCell>
                  <TableCell>{distrato.vendedor}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(distrato.valor_total)}</TableCell>
                  <TableCell className="whitespace-nowrap">{distrato.comissao_paga ? 'Sim' : 'Não'}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(distrato.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
