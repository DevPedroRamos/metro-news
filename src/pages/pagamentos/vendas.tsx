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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Vendas</h1>
                <p className="text-gray-600 text-sm">Gestão de vendas e comissões</p>
              </div>
            </div>
            {data?.vendas && (
              <div className="bg-gray-100 px-3 py-1 rounded border">
                <span className="text-gray-700 text-sm font-medium">{data.vendas.length} vendas</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <Users className="h-5 w-5 text-gray-600" />
              Filtrar por Venda
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Select
              value={selectedVendaId?.toString() || vendaMaisRecente?.id.toString() || ""}
              onValueChange={(value) => setSelectedVendaId(Number(value))}
            >
              <SelectTrigger className="w-full border-gray-200 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Selecione uma venda..." />
              </SelectTrigger>
              <SelectContent>
                {data?.vendas.map((venda) => (
                  <SelectItem key={venda.id} value={venda.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{venda.cliente}</span>
                      <span className="text-gray-500 ml-4">
                        {venda.empreendimento} • {formatDate(venda.data_do_contrato)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {vendaSelecionada && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-base">
                    <CalendarDays className="h-4 w-4 text-gray-600" />
                    Informações do Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Data do Contrato</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatDate(vendaSelecionada.data_do_contrato)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Tipo Venda</span>
                    <Badge variant="outline" className="border-gray-300 text-gray-700 text-xs">
                      {vendaSelecionada.tipo_venda}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Data SICAQ</span>
                    <span className="font-medium text-gray-900 text-sm">{formatDate(vendaSelecionada.data_sicaq)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Data Pagto</span>
                    <span className="font-medium text-gray-900 text-sm">{formatDate(vendaSelecionada.data_pagto)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-base">
                    <Building2 className="h-4 w-4 text-gray-600" />
                    Detalhes do Imóvel
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Cliente</span>
                    <span className="font-medium text-gray-900 text-sm">{vendaSelecionada.cliente}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Empreendimento</span>
                    <span className="font-medium text-gray-900 text-sm">{vendaSelecionada.empreendimento}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">BL</span>
                    <span className="font-medium text-gray-900 text-sm">{vendaSelecionada.bl || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">UNID</span>
                    <span className="font-medium text-gray-900 text-sm">{vendaSelecionada.unid}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-base">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    Valores Financeiros
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">VLR Tabela</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatCurrency(vendaSelecionada.vlr_tabela)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">VLR Venda</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatCurrency(vendaSelecionada.vlr_venda)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">% Desc</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatPercentage(vendaSelecionada.perc_desconto)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-600 text-sm">VLR Contrato</span>
                    <span className="font-semibold text-red-600">{formatCurrency(vendaSelecionada.vlr_contrato)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-base">
                  <Calculator className="h-4 w-4 text-gray-600" />
                  Informações de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center border border-gray-200 p-3 rounded">
                    <div className="text-gray-600 text-sm mb-1">Fluxo</div>
                    <div className="text-lg font-semibold text-gray-900">{vendaSelecionada.fluxo || "-"}</div>
                  </div>
                  <div className="text-center border border-gray-200 p-3 rounded">
                    <div className="text-gray-600 text-sm mb-1">Entrada</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(vendaSelecionada.entrada)}
                    </div>
                  </div>
                  <div className="text-center border border-gray-200 p-3 rounded">
                    <div className="text-gray-600 text-sm mb-1">Recebido</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(vendaSelecionada.recebido)}
                    </div>
                  </div>
                  <div className="text-center border border-gray-200 p-3 rounded">
                    <div className="text-gray-600 text-sm mb-1">A Receber</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(vendaSelecionada.receber)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-gray-900 text-base">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gray-600" />
                            Percentuais de Comissão
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentuais aplicados sobre os valores de venda</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center py-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-600 text-sm cursor-help">Sinal</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comissão sobre o valor do sinal</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatPercentage(vendaSelecionada.comissao_sinal_perc)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-600 text-sm cursor-help">VGV / Pré-Chaves</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comissão sobre o Valor Geral de Vendas até a entrega das chaves</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatPercentage(vendaSelecionada.comissao_vgv_pre_chaves_perc)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-600 text-sm cursor-help">Extra Comissão</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comissão extra por performance ou metas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatPercentage(vendaSelecionada.comissao_extra_perc)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-gray-900 text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    Valores da Comissão Integral
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Sinal</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatCurrency(vendaSelecionada.comissao_integral_sinal)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">VGV / Pré-Chaves</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatCurrency(vendaSelecionada.comissao_integral_vgv_pre_chaves)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Extra Comissão</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {formatCurrency(vendaSelecionada.comissao_integral_extra)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-2 bg-gray-50 px-3 rounded border">
                    <span className="font-medium text-gray-900 text-sm">Total</span>
                    <span className="font-semibold text-red-600">{formatCurrency(totalComissaoIntegral)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-gray-900 text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-gray-600" />
                  Adiantamento Comissão
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center border border-gray-200 p-3 rounded">
                    <div className="text-gray-600 text-sm mb-1">VGV / Pré-Chaves</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPercentage(vendaSelecionada.comissao_vgv_pre_chaves_perc)}
                    </div>
                  </div>
                  <div className="text-center border border-red-200 bg-red-50 p-3 rounded">
                    <div className="text-red-700 text-sm mb-1">Sinal + Comissão + Extra</div>
                    <div className="text-lg font-semibold text-red-600">
                      {formatCurrency(vendaSelecionada.sinal_comissao_extra_vendedor)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-gray-900 text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              Base de Vendas Completa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[2000px]">
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="min-w-[60px] font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">Data Contrato</TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-gray-700">Cliente</TableHead>
                    <TableHead className="min-w-[140px] font-semibold text-gray-700">Empreendimento</TableHead>
                    <TableHead className="min-w-[60px] font-semibold text-gray-700">BL</TableHead>
                    <TableHead className="min-w-[60px] font-semibold text-gray-700">UNID</TableHead>
                    <TableHead className="min-w-[100px] font-semibold text-gray-700">Tipo Venda</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">VLR Tabela</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">VLR Venda</TableHead>
                    <TableHead className="min-w-[80px] font-semibold text-gray-700">% Desc</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">VLR Contrato</TableHead>
                    <TableHead className="min-w-[80px] font-semibold text-gray-700">Fluxo</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">Entrada</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">Recebido</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">A Receber</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">Data SICAQ</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">Data Pagto</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">% Comissão Sinal</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">% Comissão VGV</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">% Comissão Extra</TableHead>
                    <TableHead className="min-w-[140px] font-semibold text-gray-700">Comissão Integral Sinal</TableHead>
                    <TableHead className="min-w-[140px] font-semibold text-gray-700">Comissão Integral VGV</TableHead>
                    <TableHead className="min-w-[140px] font-semibold text-gray-700">Comissão Integral Extra</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">% Sinal Recebido</TableHead>
                    <TableHead className="min-w-[160px] font-semibold text-gray-700">
                      Sinal + Comissão + Extra
                    </TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-gray-700">Comissão Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.vendas.map((venda) => {
                    const comissaoTotal =
                      (venda.comissao_integral_sinal || 0) +
                      (venda.comissao_integral_vgv_pre_chaves || 0) +
                      (venda.comissao_integral_extra || 0)

                    return (
                      <TableRow
                        key={venda.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          venda.id === vendaSelecionada?.id ? "bg-red-50 border-l-2 border-l-red-500" : ""
                        }`}
                      >
                        <TableCell className="font-mono text-xs text-gray-600">{venda.id}</TableCell>
                        <TableCell className="whitespace-nowrap text-gray-900">
                          {formatDate(venda.data_do_contrato)}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{venda.cliente}</TableCell>
                        <TableCell className="text-gray-900">{venda.empreendimento}</TableCell>
                        <TableCell className="text-gray-900">{venda.bl || "-"}</TableCell>
                        <TableCell className="text-gray-900">{venda.unid}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="whitespace-nowrap border-gray-300 text-gray-700">
                            {venda.tipo_venda}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-gray-900">
                          {formatCurrency(venda.vlr_tabela)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-gray-900">
                          {formatCurrency(venda.vlr_venda)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {formatPercentage(venda.perc_desconto)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap font-semibold text-gray-900">
                          {formatCurrency(venda.vlr_contrato)}
                        </TableCell>
                        <TableCell className="text-gray-900">{venda.fluxo || "-"}</TableCell>
                        <TableCell className="text-right whitespace-nowrap text-gray-900">
                          {formatCurrency(venda.entrada)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-green-600 font-medium">
                          {formatCurrency(venda.recebido)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-orange-600 font-medium">
                          {formatCurrency(venda.receber)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-900">
                          {formatDate(venda.data_sicaq)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-900">
                          {formatDate(venda.data_pagto)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {formatPercentage(venda.comissao_sinal_perc)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {formatPercentage(venda.comissao_vgv_pre_chaves_perc)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {formatPercentage(venda.comissao_extra_perc)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-gray-900">
                          {formatCurrency(venda.comissao_integral_sinal)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-gray-900">
                          {formatCurrency(venda.comissao_integral_vgv_pre_chaves)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-gray-900">
                          {formatCurrency(venda.comissao_integral_extra)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {formatPercentage(venda.perc_sinal_recebido)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-gray-900">
                          {formatCurrency(venda.sinal_comissao_extra_vendedor)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap font-semibold text-red-600">
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
    </div>
  )
}
