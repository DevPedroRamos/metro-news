"use client"

import { usePremios } from "@/hooks/usePremios"
import { useProfileUsers } from "@/hooks/useProfileUsers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PremiacaoPage() {
  const { userData } = useProfileUsers()
  const isAdmin = userData?.role === 'adm'
  const isDiretor = userData?.role === 'diretor'
  const showPremiado = isAdmin || isDiretor
  const { data, isLoading, error } = usePremios({ viewAsAdmin: isAdmin })

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
    <div className="max-w-[1280px] w-[100%]">
      <Card>
        <CardHeader>
          <CardTitle>
            {showPremiado ? "Premiações da Equipe" : "Minhas Premiações"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {showPremiado && <TableHead>Premiado</TableHead>}
                <TableHead>Descrição</TableHead>
                <TableHead>Qtd. Vendas</TableHead>
                <TableHead>Valor Prêmio</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  {showPremiado && (
                    <TableCell className="font-medium">{p.premiado}</TableCell>
                  )}
                  <TableCell>{p.descricao_premio_regra}</TableCell>
                  <TableCell>{p.qtd_vendas}</TableCell>
                  <TableCell>R$ {Number(p.valor_premio).toFixed(2)}</TableCell>
                  <TableCell>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString("pt-BR") : "-"}
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
