import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfileData } from "@/hooks/useProfileData"
import ProfileLoadingSpinner from "@/components/profile/ProfileLoadingSpinner"
import ImageUpload from "@/components/profile/ImageUpload"
import { DollarSign, ArrowUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import defaultCover from "@/assets/default-cover.jpg"

const Perfil = () => {
  const { data, loading, error, updateProfileImages } = useProfileData()

  if (loading) {
    return <ProfileLoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-destructive">Erro ao carregar perfil: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-muted-foreground">Nenhum dado encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getRankingBadge = (position: number) => {
    if (position === 1)
      return {
        emoji: "🥇",
        color: "bg-yellow-500",
      }
    if (position === 2)
      return {
        emoji: "🥈",
        color: "bg-gray-400",
      }
    if (position === 3)
      return {
        emoji: "🥉",
        color: "bg-amber-600",
      }
    return {
      emoji: "🏅",
      color: "bg-primary",
    }
  }

  const rankingBadge = getRankingBadge(data.ranking.position)

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  // Dados simulados para os gráficos (você pode substituir pelos dados reais)
  const weeklyVisits = [2000, 2500, 3200, 2800, 2000, 3000, 3500]
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Cover Image */}
          <div
            className="h-48 relative"
            style={{
              backgroundImage: data.user.cover_url ? `url(${data.user.cover_url})` : `url(${defaultCover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <ImageUpload
              currentImage={data.user.cover_url}
              onImageUpdate={(url) => updateProfileImages("cover_url", url)}
              type="cover"
              className="top-4 right-4"
            />
          </div>
          {/* Avatar and Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={data.user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-muted text-2xl font-semibold">
                    {getUserInitials(data.user.name)}
                  </AvatarFallback>
                </Avatar>
                <ImageUpload
                  currentImage={data.user.avatar_url}
                  onImageUpdate={(url) => updateProfileImages("avatar_url", url)}
                  type="avatar"
                  className="bottom-2 right-2"
                />
              </div>
              <div className="mt-4 sm:mt-0 flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground truncate">
                      {data.user.apelido || data.user.name}
                    </h1>
                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Superintendência:</strong> {data.user.superintendente}
                      </p>
                      <p>
                        <strong>Gerência:</strong> {data.user.gerente}
                      </p>
                      <p>
                        <strong>Cargo:</strong> {data.user.role}
                      </p>
                    </div>
                  </div>

                  <Badge className={`${rankingBadge.color} text-white text-sm font-semibold mt-3 sm:mt-0`}>
                    {rankingBadge.emoji} {data.ranking.position}º Lugar
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contratos Validados */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Contratos validados</span>
          </div>
          <div className="text-3xl font-bold">{data.metrics.vendas} vendas</div>
        </Card>

        {/* Total Visitors com Gráfico */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Total Visitors</span>
            </div>
            <select className="text-xs border rounded px-2 py-1">
              <option>Este Mês</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold">{data.metrics.visitas}</div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>13%</span>
            </div>
            <span className="text-xs text-muted-foreground">+10 Comparado ao último mês</span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-24 gap-1">
            {weeklyVisits.map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="bg-green-400 rounded-t w-full transition-all hover:bg-green-500"
                  style={{
                    height: `${(value / Math.max(...weeklyVisits)) * 100}%`,
                    minHeight: "8px",
                  }}
                ></div>
                <span className="text-xs text-muted-foreground">{weekDays[index]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recebimento - Card Grande */}
        <Card className="lg:col-span-2 bg-gradient-to-r from-green-500 to-teal-600 text-white p-8">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm opacity-90">Recebimento</span>
          </div>
          <div className="text-4xl font-bold">{formatCurrency(data.metrics.recebimento)}</div>
        </Card>

        {/* Funil de Vendas */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Funil de Vendas</span>
            </div>
            <select className="text-xs border rounded px-2 py-1">
              <option>Este Mês</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Visitas</div>
              <div className="text-2xl font-bold">{data.metrics.visitas}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Pré Vendas</div>
              <div className="text-2xl font-bold">{data.metrics.contratos}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Vendas</div>
              <div className="text-2xl font-bold">{data.metrics.vendas}</div>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="relative h-16 bg-gradient-to-r from-red-500 via-purple-500 via-blue-500 to-green-500 rounded">
            <div className="absolute top-0 left-0 h-full bg-red-500 rounded-l" style={{ width: "100%" }}></div>
            <div
              className="absolute top-0 left-0 h-full bg-purple-500"
              style={{ width: "60%", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
            ></div>
            <div
              className="absolute top-0 left-0 h-full bg-blue-500"
              style={{ width: "35%", clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
            ></div>
            <div className="absolute top-0 left-0 h-full bg-green-500 rounded-l" style={{ width: "20%" }}></div>

            {/* Percentage Labels */}
            <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">100%</div>
            <div className="absolute -bottom-6 right-1/3 text-xs text-muted-foreground">30%</div>
            <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground">60%</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Perfil
