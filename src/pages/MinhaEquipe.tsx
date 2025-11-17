import React from 'react';
import { useMinhaEquipe } from '@/hooks/useMinhaEquipe';
import { useProfileUsers } from '@/hooks/useProfileUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Users, TrendingUp, Eye, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function MinhaEquipe() {
  const { userData } = useProfileUsers();
  const isAdmin = userData?.role === 'adm';
  
  const {
    teamData,
    teamStats,
    loading,
    error,
    isManager,
    isSuperintendente
  } = useMinhaEquipe(isAdmin);

  if (!isManager && !isSuperintendente && !isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta página é restrita para usuários com perfil de gerente ou superintendente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados da equipe: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minha Equipe</h1>
        <p className="text-gray-600 mt-2">
          {isAdmin
            ? "Visão geral de TODOS os membros da organização (corretores, gerentes e superintendentes)"
            : isSuperintendente 
              ? "Visão geral da performance da sua superintendência" 
              : "Visão geral da performance da sua equipe"
          }
        </p>
      </div>

      {/* Cards de estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin 
                ? "Total de Membros (Todos)"
                : isSuperintendente 
                  ? "Total de Membros" 
                  : "Total de consultores"
              }
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalMembros}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalVendas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalVisitas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela detalhada da equipe */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Equipe</CardTitle>
          <CardDescription>
            Performance individual de cada membro da sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamData.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum membro encontrado na sua equipe.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Membro</TableHead>
                     {isSuperintendente && <TableHead className="text-center">Função</TableHead>}
                     <TableHead className="text-center">Vendas</TableHead>
                     <TableHead className="text-center">Visitas</TableHead>
                     <TableHead className="text-center">Valor a Receber</TableHead>
                     <TableHead className="text-center">Comissão</TableHead>
                     <TableHead className="text-center">Saldo CEF</TableHead>
                     <TableHead className="text-center">Distrato</TableHead>
                     <TableHead className="text-center font-medium">Valor da Nota</TableHead>
                   </TableRow>
                 </TableHeader>
                <TableBody>
                  {teamData.map(member => (
                    <TableRow key={member.id}>
                       <TableCell>
                         <div className="flex items-center space-x-3">
                           <Avatar className="h-10 w-10">
                             <AvatarImage src={member.avatar_url} alt={member.name} />
                             <AvatarFallback>
                               {getUserInitials(member.name)}
                             </AvatarFallback>
                           </Avatar>
                           <div>
                             <div className="font-medium">{member.apelido}</div>
                             <div className="text-sm text-gray-500">{member.name}</div>
                           </div>
                         </div>
                       </TableCell>

                       {isSuperintendente && (
                         <TableCell className="text-center">
                           <Badge variant={member.role === 'gerente' ? 'default' : 'secondary'}>
                             {member.role === 'gerente' ? 'Gerente' : 'Corretor'}
                           </Badge>
                         </TableCell>
                       )}

                       <TableCell className="text-center">
                         <div className="font-medium">{member.vendas}</div>
                       </TableCell>

                      <TableCell className="text-center">
                        <div className="font-medium">{member.visitas}</div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="font-medium">
                          {formatCurrency(member.valorAReceber)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="font-medium">
                          {formatCurrency(member.comissao)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="font-medium">
                          {formatCurrency(member.saldoCef)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="font-medium">
                          {formatCurrency(member.distrato)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-medium bg-gray-50">
                        <div className="font-semibold">
                          {formatCurrency(member.valorNota)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}