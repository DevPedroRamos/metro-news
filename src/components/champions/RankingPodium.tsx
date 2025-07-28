"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"
import { Trophy, Medal, Award, Users, FileText, Crown, Star, Sparkles } from "lucide-react"

interface RankingData {
  id: string
  name: string
  apelido: string
  vendas: number
  recebimento: number
  visitas: number
  contratos: number
  avatar_url?: string
}

interface RankingPodiumProps {
  topThree: RankingData[]
}

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />
    default:
      return null
  }
}

const getCardSize = (position: number) => {
  switch (position) {
    case 1:
      return "lg:scale-110 lg:order-2 lg:-mt-4"
    case 2:
      return "lg:order-1"
    case 3:
      return "lg:order-3"
    default:
      return ""
  }
}

const getPodiumColors = (position: number) => {
  switch (position) {
    case 1:
      return {
        gradient: "bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-amber-50",
        border: "border-yellow-300 shadow-yellow-200/50",
        badge: "bg-gradient-to-r from-yellow-400 to-yellow-500",
        glow: "shadow-2xl shadow-yellow-500/25",
      }
    case 2:
      return {
        gradient: "bg-gradient-to-br from-gray-50 via-slate-100/50 to-gray-50",
        border: "border-gray-300 shadow-gray-200/50",
        badge: "bg-gradient-to-r from-gray-400 to-gray-500",
        glow: "shadow-xl shadow-gray-400/20",
      }
    case 3:
      return {
        gradient: "bg-gradient-to-br from-amber-50 via-orange-100/50 to-amber-50",
        border: "border-amber-300 shadow-amber-200/50",
        badge: "bg-gradient-to-r from-amber-500 to-orange-500",
        glow: "shadow-xl shadow-amber-400/20",
      }
    default:
      return {
        gradient: "bg-white",
        border: "border-gray-200",
        badge: "bg-gray-500",
        glow: "",
      }
  }
}

export const RankingPodium: React.FC<RankingPodiumProps> = ({ topThree }) => {
  if (topThree.length === 0) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pódio em Breve</h3>
            <p className="text-gray-500">Os primeiros colocados aparecerão aqui</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      {/* Header do Pódio */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-16 mt-[60px] mb-[60px]">
        {topThree.map((person, index) => {
          const position = index + 1
          const colors = getPodiumColors(position)

          const formatRecebimento = (value: number) => {
            if (value >= 1000000) {
              return `R$ ${(value / 1000000).toFixed(1)}M`
            } else if (value >= 1000) {
              return `R$ ${(value / 1000).toFixed(0)}k`
            }
            return formatCurrency(value)
          }

          return (
            <Card
              key={person.id}
              className={`relative overflow-hidden ${getCardSize(position)} ${
                colors.gradient
              } ${colors.border} ${colors.glow} border-2`}
            >
              {/* Decorative elements */}
              {position === 1 && (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
               
                </>
              )}

              <CardContent className="p-4 relative">
                {/* Position Badge - Top Center */}
                <div className="absolute">
                  <div
                    className={`w-16 h-16 rounded-full ${colors.badge} text-white flex items-center justify-center shadow-lg border-4 border-white`}
                  >
                    <span className="text-lg font-bold">{position}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-6">
                  {/* Avatar and Info */}
                  <div className="flex flex-col items-center mb-2">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={person.avatar_url || "/placeholder.svg"}
                          alt={person.apelido}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xl font-bold">
                          {person.apelido.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Rank Icon */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                        {getRankIcon(position)}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-xl mb-1 text-gray-900">{person.apelido}</h3>
                      <p className="text-sm text-gray-600 font-medium mb-4">{person.name}</p>

                      {/* Main Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                          <div className="text-2xl font-bold text-gray-900">{person.vendas}</div>
                          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Vendas</div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                          <div className="text-lg font-bold text-green-600">
                            {formatRecebimento(person.recebimento)}
                          </div>
                          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Recebimento</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Badges */}
                  <div className="flex justify-center gap-3">
                    <Badge
                      className={`${
                        position === 1
                          ? "bg-yellow-200 text-yellow-800 border-yellow-300"
                          : position === 2
                            ? "bg-gray-200 text-gray-700 border-gray-300"
                            : "bg-amber-200 text-amber-800 border-amber-300"
                      } font-medium px-3 py-1.5 text-xs`}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {person.visitas} visitas
                    </Badge>
                    <Badge
                      className={`${
                        position === 1
                          ? "bg-yellow-200 text-yellow-800 border-yellow-300"
                          : position === 2
                            ? "bg-gray-200 text-gray-700 border-gray-300"
                            : "bg-amber-200 text-amber-800 border-amber-300"
                      } font-medium px-3 py-1.5 text-xs`}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {person.contratos} contratos
                    </Badge>
                  </div>
                </div>

                {/* Winner Ribbon for 1st place */}
                {position === 1 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                      🏆 CAMPEÃO
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

    </div>
  )
}
