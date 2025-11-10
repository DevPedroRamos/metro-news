import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Distrato } from "@/hooks/useDistratos";
interface DistratoStatsProps {
  distratos: Distrato[];
  userRole?: string;
}
export const DistratoStats = ({
  distratos,
  userRole
}: DistratoStatsProps) => {
  const totalDistratos = distratos.length;
  const valorTotalGeral = distratos.reduce((sum, d) => sum + (d.valor_total || 0), 0);

  // Calcular valor específico baseado no role
  let valorEspecifico = 0;
  let labelEspecifico = "";
  if (userRole === "vendedor") {
    valorEspecifico = distratos.reduce((sum, d) => sum + (d.valor_vendedor || 0), 0);
    labelEspecifico = "Valor Vendedor";
  } else if (userRole === "gerente") {
    valorEspecifico = distratos.reduce((sum, d) => sum + (d.valor_gerente || 0), 0);
    labelEspecifico = "Valor Gerente";
  } else if (userRole === "superintendente") {
    valorEspecifico = distratos.reduce((sum, d) => sum + (d.valor_superintendente || 0), 0);
    labelEspecifico = "Valor Superintendente";
  }
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  return <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Distratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDistratos}</div>
        </CardContent>
      </Card>
      
      
      
      {userRole && valorEspecifico > 0}
    </div>;
};