"use client"

import { usePremios } from "@/hooks/usePremios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PremiacaoPage() {
  const { data, isLoading, error } = usePremios()

  if (isLoading) {
    return <p className="p-4">Carregando premiações...</p>
  }

  if (error) {
    return <p className="p-4 text-red-500">Erro ao carregar: {error.message}</p>
  }

  if (!data || data.length === 0) {
    return <p className="p-4">Nenhuma premiação encontrada.</p>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Premiações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Gerente</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Qtd. Vendas</TableHead>
                <TableHead>Valor Prêmio</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.descricao_premio_regra}</TableCell>
                  <TableCell>{p.funcao}</TableCell>
                  <TableCell>{p.gerente || "-"}</TableCell>
                  <TableCell>{p.gestor || "-"}</TableCell>
                  <TableCell>{p.qtd_vendas}</TableCell>
                  <TableCell>R$ {Number(p.valor_premio).toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
