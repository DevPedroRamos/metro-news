import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, FileText, Users, CheckCircle, X, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileUsers } from "@/hooks/useProfileUsers";
import { useCurrentPeriod } from "@/hooks/useCurrentPeriod";
import { useToast } from "@/hooks/use-toast";

interface TeamInvoice {
  id: string;
  user_id: string;
  periodo_id: number | null;
  file_name: string;
  file_url: string;
  created_at: string;
  user_name: string;
  user_apelido: string;
  period_start?: string;
  period_end?: string;
}

interface TeamMember {
  id: string;
  name: string;
  apelido: string;
  cpf: string;
}

export default function ComprovantesEquipe() {
  const { userData } = useProfileUsers();
  const { period } = useCurrentPeriod();
  const { toast } = useToast();
  
  const [teamInvoices, setTeamInvoices] = useState<TeamInvoice[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current");
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const isManagerOrSuperintendent = userData?.role === 'gerente' || userData?.role === 'superintendente';

  useEffect(() => {
    if (!isManagerOrSuperintendent) return;
    fetchTeamData();
  }, [userData, isManagerOrSuperintendent, selectedPeriod]);

  const fetchTeamData = async () => {
    if (!userData?.apelido) return;

    try {
      setLoading(true);

      // Buscar membros da equipe
      let teamQuery = supabase.from('users').select('id, name, apelido, cpf');
      
      if (userData.role === 'gerente') {
        teamQuery = teamQuery.eq('gerente', userData.apelido);
      } else if (userData.role === 'superintendente') {
        teamQuery = teamQuery.eq('superintendente', userData.apelido);
      }

      const { data: teamData, error: teamError } = await teamQuery;
      if (teamError) throw teamError;

      setTeamMembers(teamData || []);

      if (!teamData || teamData.length === 0) {
        setTeamInvoices([]);
        return;
      }

      // Buscar os profiles correspondentes usando CPF
      const teamCpfs = teamData.map(member => member.cpf);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, cpf, name')
        .in('cpf', teamCpfs);

      if (profilesError) throw profilesError;

      // Criar mapeamento CPF -> Profile ID
      const cpfToProfileId = new Map();
      profilesData?.forEach(profile => {
        cpfToProfileId.set(profile.cpf, profile.id);
      });

      // Buscar comprovantes usando os profile IDs
      const profileIds = profilesData?.map(profile => profile.id) || [];
      if (profileIds.length === 0) {
        setTeamInvoices([]);
        return;
      }

      let invoiceQuery = supabase
        .from('invoice_uploads')
        .select(`
          id,
          user_id,
          periodo_id,
          file_name,
          file_url,
          created_at
        `)
        .in('user_id', profileIds);

      if (selectedPeriod === "current" && period?.id) {
        invoiceQuery = invoiceQuery.eq('periodo_id', period.id);
      }

      const { data: invoiceData, error: invoiceError } = await invoiceQuery.order('created_at', { ascending: false });
      if (invoiceError) throw invoiceError;

      // Combinar dados dos comprovantes com dados dos usuários
      const enrichedInvoices: TeamInvoice[] = (invoiceData || []).map(invoice => {
        // Encontrar o profile correspondente
        const profile = profilesData?.find(p => p.id === invoice.user_id);
        // Encontrar o user correspondente usando o CPF
        const user = teamData?.find(member => member.cpf === profile?.cpf);
        
        return {
          ...invoice,
          user_name: user?.name || profile?.name || 'Usuário não encontrado',
          user_apelido: user?.apelido || 'N/A',
        };
      });

      setTeamInvoices(enrichedInvoices);
    } catch (error) {
      console.error('Erro ao buscar dados da equipe:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da equipe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice: TeamInvoice) => {
    try {
      // Extrair o path do arquivo da URL para usar com storage.download
      const url = new URL(invoice.file_url);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'invoices');
      
      if (bucketIndex === -1) {
        throw new Error('Caminho do arquivo inválido');
      }
      
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      // Usar API do Supabase Storage para download seguro
      const { data, error } = await supabase.storage
        .from('invoices')
        .download(filePath);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Arquivo não encontrado');
      }

      // Criar URL para download e forçar download
      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${invoice.user_apelido}_${invoice.file_name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download concluído",
        description: `Arquivo ${invoice.file_name} baixado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo. Verifique suas permissões.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDownload = async () => {
    const filteredInvoices = getFilteredInvoices();
    
    if (filteredInvoices.length === 0) {
      toast({
        title: "Nenhum comprovante",
        description: "Não há comprovantes para download.",
      });
      return;
    }

    toast({
      title: "Download iniciado",
      description: `Baixando ${filteredInvoices.length} comprovante(s)...`,
    });

    // Download individual de cada arquivo
    for (const invoice of filteredInvoices) {
      await handleDownload(invoice);
      // Pequena pausa entre downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getFilteredInvoices = () => {
    return teamInvoices.filter(invoice => {
      // Para filtrar por membro, precisamos encontrar o CPF correspondente ao profile ID do invoice
      let matchesMember = selectedMember === "all";
      if (!matchesMember && selectedMember !== "all") {
        // Encontrar o profile correspondente ao invoice.user_id e seu CPF
        const teamMember = teamMembers.find(member => member.cpf === selectedMember);
        if (teamMember) {
          // Verificar se este invoice pertence a este membro comparando dados do usuário
          matchesMember = invoice.user_apelido === teamMember.apelido;
        }
      }
      
      const matchesSearch = searchTerm === "" || 
        invoice.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.user_apelido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.file_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesMember && matchesSearch;
    });
  };

  const getComplianceStats = () => {
    const totalMembers = teamMembers.length;
    const membersWithInvoice = new Set(teamInvoices.map(inv => inv.user_id)).size;
    const complianceRate = totalMembers > 0 ? (membersWithInvoice / totalMembers) * 100 : 0;
    
    return {
      totalMembers,
      membersWithInvoice,
      membersWithoutInvoice: totalMembers - membersWithInvoice,
      complianceRate: Math.round(complianceRate)
    };
  };

  if (!isManagerOrSuperintendent) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground">
              Esta página é apenas para gerentes e superintendentes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredInvoices = getFilteredInvoices();
  const stats = getComplianceStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comprovantes da Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os comprovantes de pagamento da sua equipe
          </p>
        </div>
        <Button onClick={handleBulkDownload} disabled={filteredInvoices.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Download em Lote ({filteredInvoices.length})
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total da Equipe</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Com Comprovante</p>
                <p className="text-2xl font-bold">{stats.membersWithInvoice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Sem Comprovante</p>
                <p className="text-2xl font-bold">{stats.membersWithoutInvoice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Compliance</p>
                <p className="text-2xl font-bold">{stats.complianceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou arquivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecionar membro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os membros</SelectItem>
                {teamMembers.map(member => (
                  <SelectItem key={member.cpf} value={member.cpf}>
                    {member.apelido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Período Atual</SelectItem>
                <SelectItem value="all">Todos os Períodos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Comprovantes */}
      <Card>
        <CardHeader>
          <CardTitle>Comprovantes ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-8">Carregando...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center p-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhum comprovante encontrado</p>
              <p className="text-muted-foreground">
                Não há comprovantes para os filtros selecionados.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Data de Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.user_name}</p>
                        <p className="text-sm text-muted-foreground">{invoice.user_apelido}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-sm">{invoice.file_name}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Enviado
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(invoice)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}