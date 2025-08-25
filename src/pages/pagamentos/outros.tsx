"use client"

import { useOutros } from "@/hooks/useOutros"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function OutrosPage() {
  const { outros, loading, error } = useOutros()

  if (loading) {
    return <p className="p-4">Carregando registros...</p>
  }

  if (error) {
    return <p className="p-4 text-red-500">Erro ao carregar: {error}</p>
  }

  if (!outros || outros.length === 0) {
    return <p className="p-4">Nenhum registro encontrado para o período.</p>
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
    <div className="max-w-[1280px] w-[100%] overflow-x-auto">
      <Card>
        <CardHeader>
          <CardTitle>Outros Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outros.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">{formatCurrency(item.valor)}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{item.descricao}</TableCell>
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