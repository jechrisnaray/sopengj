import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { formatRupiah } from "@/lib/utils/format"

interface RecommendationCardProps {
  recommendation: {
    consultant_id: string
    score: number
    reasons: string[]
    best_slots: string[]
  }
  consultant: any
}

export function RecommendationCard({ recommendation, consultant }: RecommendationCardProps) {
  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-md transition-all hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Badge className="bg-blue-600 text-white flex items-center gap-1 py-1">
            <Sparkles className="h-3 w-3 fill-current" />
            <span>{recommendation.score}% Cocok</span>
          </Badge>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
            <Star className="h-4 w-4 fill-current" />
            <span>{consultant?.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-14 w-14 border-2 border-blue-200">
            <AvatarImage src={consultant?.avatar_url} />
            <AvatarFallback>{consultant?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-slate-900">{consultant?.full_name}</h4>
            <p className="text-xs text-blue-600 font-medium">
              {consultant?.specializations?.join(', ')}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {recommendation.reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <div className="mt-1 h-1 w-1 rounded-full bg-blue-400 shrink-0" />
              <p>{reason}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm font-bold text-slate-900">
            {formatRupiah(consultant?.hourly_rate || 0)}
            <span className="text-[10px] font-normal text-slate-400">/jam</span>
          </p>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8" asChild>
            <Link href={`/consultants/${recommendation.consultant_id}`}>
              Pilih <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
