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
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-3 rounded-xl shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
                <p className="text-gray-600 mt-1">Gestão completa de vendas e comissões</p>
              </div>
            </div>
            {data?.vendas && (
              <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <span className="text-red-600 font-semibold">{data.vendas.length} vendas registradas</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              Filtrar por Venda
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Select
              value={selectedVendaId?.toString() || vendaMaisRecente?.id.toString() || ""}
              onValueChange={(value) => setSelectedVendaId(Number(value))}
            >
              <SelectTrigger className="w-full h-12 border-gray-200 focus:border-red-500 focus:ring-red-500">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
                <CardHeader className="bg-blue-50 border-b border-blue-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-blue-900">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    Informações do Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Data do Contrato</span>
                    <span className="font-semibold text-gray-900">{formatDate(vendaSelecionada.data_do_contrato)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Tipo Venda</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      {vendaSelecionada.tipo_venda}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Data SICAQ</span>
                    <span className="font-semibold text-gray-900">{formatDate(vendaSelecionada.data_sicaq)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Data Pagto</span>
                    <span className="font-semibold text-gray-900">{formatDate(vendaSelecionada.data_pagto)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
                <CardHeader className="bg-green-50 border-b border-green-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-green-900">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    Detalhes do Imóvel
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Cliente</span>
                    <span className="font-semibold text-gray-900">{vendaSelecionada.cliente}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Empreendimento</span>
                    <span className="font-semibold text-gray-900">{vendaSelecionada.empreendimento}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">BL</span>
                    <span className="font-semibold text-gray-900">{vendaSelecionada.bl || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">UNID</span>
                    <span className="font-semibold text-gray-900">{vendaSelecionada.unid}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
                <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-red-900">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-red-600" />
                    </div>
                    Valores Financeiros
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">VLR Tabela</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(vendaSelecionada.vlr_tabela)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">VLR Venda</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(vendaSelecionada.vlr_venda)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">% Desc</span>
                    <span className="font-semibold text-gray-900">
                      {formatPercentage(vendaSelecionada.perc_desconto)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-gray-600 font-medium">VLR Contrato</span>
                    <span className="font-bold text-red-600 text-lg">
                      {formatCurrency(vendaSelecionada.vlr_contrato)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="bg-purple-50 border-b border-purple-100">
                <CardTitle className="flex items-center gap-3 text-purple-900">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                  Informações de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-600 font-medium mb-2">Fluxo</div>
                    <div className="text-xl font-bold text-gray-900">{vendaSelecionada.fluxo || "-"}</div>
                  </div>
                  <div className="text-center bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium mb-2">Entrada</div>
                    <div className="text-xl font-bold text-blue-900">{formatCurrency(vendaSelecionada.entrada)}</div>
                  </div>
                  <div className="text-center bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 font-medium mb-2">Recebido</div>
                    <div className="text-xl font-bold text-green-700">{formatCurrency(vendaSelecionada.recebido)}</div>
                  </div>
                  <div className="text-center bg-orange-50 p-4 rounded-lg">
                    <div className="text-orange-600 font-medium mb-2">A Receber</div>
                    <div className="text-xl font-bold text-orange-700">{formatCurrency(vendaSelecionada.receber)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                  <CardTitle className="text-indigo-900">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help flex items-center gap-2">
                            <div className="bg-indigo-100 p-1 rounded">
                              <TrendingUp className="h-4 w-4 text-indigo-600" />
                            </div>
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
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-600 font-medium cursor-help">Sinal</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comissão sobre o valor do sinal</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-bold text-gray-900">
                      {formatPercentage(vendaSelecionada.comissao_sinal_perc)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-600 font-medium cursor-help">VGV / Pré-Chaves</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comissão sobre o Valor Geral de Vendas até a entrega das chaves</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-bold text-gray-900">
                      {formatPercentage(vendaSelecionada.comissao_vgv_pre_chaves_perc)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-gray-600 font-medium cursor-help">Extra Comissão</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comissão extra por performance ou metas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="font-bold text-gray-900">
                      {formatPercentage(vendaSelecionada.comissao_extra_perc)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    Valores da Comissão Integral
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Sinal</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(vendaSelecionada.comissao_integral_sinal)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">VGV / Pré-Chaves</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(vendaSelecionada.comissao_integral_vgv_pre_chaves)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Extra Comissão</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(vendaSelecionada.comissao_integral_extra)}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between items-center py-3 bg-red-50 px-4 rounded-lg border border-red-200">
                    <span className="font-bold text-red-900">Total</span>
                    <span className="font-bold text-red-600 text-xl">{formatCurrency(totalComissaoIntegral)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                <CardTitle className="text-yellow-900 flex items-center gap-2">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Calculator className="h-5 w-5 text-yellow-600" />
                  </div>
                  Adiantamento Comissão
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-600 font-medium mb-2">Cota (%)</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatPercentage(vendaSelecionada.perc_sinal_recebido)}
                    </div>
                  </div>
                  <div className="text-center bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium mb-2">VGV / Pré-Chaves</div>
                    <div className="text-xl font-bold text-blue-900">
                      {formatPercentage(vendaSelecionada.comissao_vgv_pre_chaves_perc)}
                    </div>
                  </div>
                  <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="text-red-600 font-medium mb-2">Sinal + Comissão + Extra</div>
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(vendaSelecionada.sinal_comissao_extra_vendedor)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-gray-600" />
              </div>
              Base de Vendas Completa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[2000px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
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
                          venda.id === vendaSelecionada?.id ? "bg-red-50 border-l-4 border-l-red-500" : ""
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
