"use client"

import { useDistrato } from "@/hooks/useDistratos"
import { useProfileUsers } from "@/hooks/useProfileUsers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DistratoStats } from "@/components/distratos/DistratoStats"

export default function DistratosPage() {
  const { userData } = useProfileUsers()
  const isAdmin = userData?.role === 'adm'
  const { distratos, loading, error, userRole } = useDistrato(isAdmin)

  // Definir variáveis de controle de visualização
  const isGerente = userData?.role === 'gerente'
  const isSuperintendente = userData?.role === 'superintendente'

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
    <div className="max-w-[1800px] w-[100%] overflow-x-auto space-y-6">
      <DistratoStats distratos={distratos} userRole={userData?.role} />
      
      <Card>
        <CardHeader>
          <CardTitle>Distratos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2}>Cliente</TableHead>
                <TableHead rowSpan={2}>Empreendimento</TableHead>
                <TableHead rowSpan={2}>Apartamento</TableHead>
                <TableHead rowSpan={2}>Data do Distrato</TableHead>
                <TableHead rowSpan={2}>Tipo</TableHead>
                <TableHead rowSpan={2}>Motivo</TableHead>
                
                <TableHead colSpan={2} className="text-center">
                  Vendedor
                </TableHead>
                
                {(isGerente || isSuperintendente) && (
                  <TableHead colSpan={2} className="text-center">
                    Gerente
                  </TableHead>
                )}
                
                {isSuperintendente && (
                  <TableHead className="text-center">
                    Superintendente
                  </TableHead>
                )}
                
                <TableHead rowSpan={2}>Valor Total</TableHead>
                <TableHead rowSpan={2}>Comissão Paga</TableHead>
                <TableHead rowSpan={2}>Data de Criação</TableHead>
              </TableRow>
              
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor</TableHead>
                
                {(isGerente || isSuperintendente) && (
                  <>
                    <TableHead>Nome</TableHead>
                    <TableHead>Valor</TableHead>
                  </>
                )}
                
                {isSuperintendente && (
                  <TableHead>Valor</TableHead>
                )}
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
                  <TableCell className="whitespace-nowrap">{formatCurrency(distrato.valor_vendedor)}</TableCell>
                  
                  {(isGerente || isSuperintendente) && (
                    <>
                      <TableCell>{distrato.gerente}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCurrency(distrato.valor_gerente)}</TableCell>
                    </>
                  )}
                  
                  {isSuperintendente && (
                    <TableCell className="whitespace-nowrap">{formatCurrency(distrato.valor_superintendente)}</TableCell>
                  )}
                  
                  <TableCell className="whitespace-nowrap font-semibold">{formatCurrency(distrato.valor_total)}</TableCell>
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
