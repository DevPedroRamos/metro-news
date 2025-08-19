"use client"

import { useState, useMemo } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarDays, Building2, DollarSign, TrendingUp, Users, Calculator } from "lucide-react"
import { useVendas } from "@/hooks/useVendas"

// Função para formatar valores em BRL
const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "R$ 0,00"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Função para formatar percentual
const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "0,00%"
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

// Função para formatar data
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "-"
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR")
  } catch {
    return dateStr
  }
}

export default function VendasPage() {
  const { data, loading, error } = useVendas()
  const [selectedVendaId, setSelectedVendaId] = useState<number | null>(null)

  // Selecionar a venda mais recente por padrão
  const vendaMaisRecente = useMemo(() => {
    if (!data?.vendas || data.vendas.length === 0) return null
    return data.vendas.reduce((latest, current) => {
      const latestDate = new Date(latest.data_do_contrato)
      const currentDate = new Date(current.data_do_contrato)
      return currentDate > latestDate ? current : latest
    })
  }, [data?.vendas])

  // Definir venda selecionada
  const vendaSelecionada = useMemo(() => {
    if (selectedVendaId) {
      return data?.vendas.find((v) => v.id === selectedVendaId) || null
    }
    return vendaMaisRecente
  }, [selectedVendaId, data?.vendas, vendaMaisRecente])

  // Calcular total das comissões integrais
  const totalComissaoIntegral = useMemo(() => {
    if (!vendaSelecionada) return 0
    return (
      (vendaSelecionada.comissao_integral_sinal || 0) +
      (vendaSelecionada.comissao_integral_vgv_pre_chaves || 0) +
      (vendaSelecionada.comissao_integral_extra || 0)
    )
  }, [vendaSelecionada])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando vendas...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-destructive">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data?.vendas || data.vendas.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Nenhuma venda encontrada.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Vendas</h1>
      </div>

      {/* Filtro de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Selecionar Venda por Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedVendaId?.toString() || vendaMaisRecente?.id.toString() || ""}
            onValueChange={(value) => setSelectedVendaId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma venda..." />
            </SelectTrigger>
            <SelectContent>
              {data.vendas.map((venda) => (
                <SelectItem key={venda.id} value={venda.id.toString()}>
                  {venda.cliente} - {venda.empreendimento} ({formatDate(venda.data_do_contrato)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {vendaSelecionada && (
        <>
          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="h-5 w-5" />
                  Informações do Contrato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data do Contrato:</span>
                  <span className="font-medium">{formatDate(vendaSelecionada.data_do_contrato)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo Venda:</span>
                  <Badge variant="secondary">{vendaSelecionada.tipo_venda}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data SICAQ:</span>
                  <span className="font-medium">{formatDate(vendaSelecionada.data_sicaq)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data Pagto:</span>
                  <span className="font-medium">{formatDate(vendaSelecionada.data_pagto)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Detalhes do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{vendaSelecionada.cliente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Empreendimento:</span>
                  <span className="font-medium">{vendaSelecionada.empreendimento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">BL:</span>
                  <span className="font-medium">{vendaSelecionada.bl || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">UNID:</span>
                  <span className="font-medium">{vendaSelecionada.unid}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Valores Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">VLR Tabela:</span>
                  <span className="font-medium">{formatCurrency(vendaSelecionada.vlr_tabela)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">VLR Venda:</span>
                  <span className="font-medium">{formatCurrency(vendaSelecionada.vlr_venda)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">% Desc:</span>
                  <span className="font-medium">{formatPercentage(vendaSelecionada.perc_desconto)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">VLR Contrato:</span>
                  <span className="font-medium text-primary">{formatCurrency(vendaSelecionada.vlr_contrato)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Fluxo</div>
                  <div className="text-lg font-semibold">{vendaSelecionada.fluxo || "-"}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Entrada</div>
                  <div className="text-lg font-semibold">{formatCurrency(vendaSelecionada.entrada)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Recebido</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(vendaSelecionada.recebido)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">A Receber</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {formatCurrency(vendaSelecionada.receber)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comissões */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">Percentuais de Comissão</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Percentuais aplicados sobre os valores de venda</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground cursor-help">Sinal:</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Comissão sobre o valor do sinal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="font-medium">{formatPercentage(vendaSelecionada.comissao_sinal_perc)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground cursor-help">VGV / Pré-Chaves:</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Comissão sobre o Valor Geral de Vendas até a entrega das chaves</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="font-medium">{formatPercentage(vendaSelecionada.comissao_vgv_pre_chaves_perc)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground cursor-help">Extra Comissão:</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Comissão extra por performance ou metas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="font-medium">{formatPercentage(vendaSelecionada.comissao_extra_perc)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valores da Comissão Integral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sinal:</span>
                  <span className="font-medium">{formatCurrency(vendaSelecionada.comissao_integral_sinal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">VGV / Pré-Chaves:</span>
                  <span className="font-medium">
                    {formatCurrency(vendaSelecionada.comissao_integral_vgv_pre_chaves)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Extra Comissão:</span>
                  <span className="font-medium">{formatCurrency(vendaSelecionada.comissao_integral_extra)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(totalComissaoIntegral)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Adiantamento Comissão */}
          <Card>
            <CardHeader>
              <CardTitle>Adiantamento Comissão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Cota (%)</div>
                  <div className="text-lg font-semibold">{formatPercentage(vendaSelecionada.perc_sinal_recebido)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">VGV / Pré-Chaves</div>
                  <div className="text-lg font-semibold">
                    {formatPercentage(vendaSelecionada.comissao_vgv_pre_chaves_perc)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Sinal + Comissão + Extra</div>
                  <div className="text-lg font-semibold text-primary">
                    {formatCurrency(vendaSelecionada.sinal_comissao_extra_vendedor)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Base de Vendas Extensa */}
      <Card>
        <CardHeader>
          <CardTitle>Base de Vendas Completa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-md">
            <Table className="min-w-[2000px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[60px]">ID</TableHead>
                  <TableHead className="min-w-[120px]">Data Contrato</TableHead>
                  <TableHead className="min-w-[150px]">Cliente</TableHead>
                  <TableHead className="min-w-[140px]">Empreendimento</TableHead>
                  <TableHead className="min-w-[60px]">BL</TableHead>
                  <TableHead className="min-w-[60px]">UNID</TableHead>
                  <TableHead className="min-w-[100px]">Tipo Venda</TableHead>
                  <TableHead className="min-w-[120px]">VLR Tabela</TableHead>
                  <TableHead className="min-w-[120px]">VLR Venda</TableHead>
                  <TableHead className="min-w-[80px]">% Desc</TableHead>
                  <TableHead className="min-w-[120px]">VLR Contrato</TableHead>
                  <TableHead className="min-w-[80px]">Fluxo</TableHead>
                  <TableHead className="min-w-[120px]">Entrada</TableHead>
                  <TableHead className="min-w-[120px]">Recebido</TableHead>
                  <TableHead className="min-w-[120px]">A Receber</TableHead>
                  <TableHead className="min-w-[120px]">Data SICAQ</TableHead>
                  <TableHead className="min-w-[120px]">Data Pagto</TableHead>
                  <TableHead className="min-w-[120px]">% Comissão Sinal</TableHead>
                  <TableHead className="min-w-[120px]">% Comissão VGV</TableHead>
                  <TableHead className="min-w-[120px]">% Comissão Extra</TableHead>
                  <TableHead className="min-w-[140px]">Comissão Integral Sinal</TableHead>
                  <TableHead className="min-w-[140px]">Comissão Integral VGV</TableHead>
                  <TableHead className="min-w-[140px]">Comissão Integral Extra</TableHead>
                  <TableHead className="min-w-[120px]">% Sinal Recebido</TableHead>
                  <TableHead className="min-w-[160px]">Sinal + Comissão + Extra</TableHead>
                  <TableHead className="min-w-[120px]">Comissão Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.vendas.map((venda) => {
                  const comissaoTotal =
                    (venda.comissao_integral_sinal || 0) +
                    (venda.comissao_integral_vgv_pre_chaves || 0) +
                    (venda.comissao_integral_extra || 0)

                  return (
                    <TableRow key={venda.id} className={venda.id === vendaSelecionada?.id ? "bg-muted/50" : ""}>
                      <TableCell className="font-mono text-xs">{venda.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(venda.data_do_contrato)}</TableCell>
                      <TableCell className="font-medium">{venda.cliente}</TableCell>
                      <TableCell>{venda.empreendimento}</TableCell>
                      <TableCell>{venda.bl || "-"}</TableCell>
                      <TableCell>{venda.unid}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {venda.tipo_venda}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">{formatCurrency(venda.vlr_tabela)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{formatCurrency(venda.vlr_venda)}</TableCell>
                      <TableCell className="text-right">{formatPercentage(venda.perc_desconto)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap font-semibold">
                        {formatCurrency(venda.vlr_contrato)}
                      </TableCell>
                      <TableCell>{venda.fluxo || "-"}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{formatCurrency(venda.entrada)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap text-green-600">
                        {formatCurrency(venda.recebido)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap text-orange-600">
                        {formatCurrency(venda.receber)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(venda.data_sicaq)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(venda.data_pagto)}</TableCell>
                      <TableCell className="text-right">{formatPercentage(venda.comissao_sinal_perc)}</TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(venda.comissao_vgv_pre_chaves_perc)}
                      </TableCell>
                      <TableCell className="text-right">{formatPercentage(venda.comissao_extra_perc)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(venda.comissao_integral_sinal)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(venda.comissao_integral_vgv_pre_chaves)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(venda.comissao_integral_extra)}
                      </TableCell>
                      <TableCell className="text-right">{formatPercentage(venda.perc_sinal_recebido)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(venda.sinal_comissao_extra_vendedor)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap font-semibold text-primary">
                        {formatCurrency(comissaoTotal)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
