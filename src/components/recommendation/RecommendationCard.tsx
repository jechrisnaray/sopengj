'use client'

import Link from 'next/link'
import { Star, Clock, Award, ChevronRight } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import type { AIRecommendation } from '@/types'

interface RecommendationCardProps {
  recommendation: AIRecommendation
  rank: number
}

const RANK_COLORS = {
  1: 'bg-yellow-400 text-yellow-900',
  2: 'bg-slate-300 text-slate-700',
  3: 'bg-orange-300 text-orange-800',
}

export function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const consultant = useQuery(api.consultants.getById, { 
    id: recommendation.consultantId as Id<"consultants"> 
  })

  if (consultant === undefined) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse h-32" />
    )
  }

  if (!consultant) return null

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition p-5">
      <div className="flex items-start gap-4">

        {/* Rank badge */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${RANK_COLORS[rank as keyof typeof RANK_COLORS] ?? 'bg-slate-200 text-slate-600'}`}>
          #{rank}
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
          {consultant.fullName?.charAt(0)?.toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-900 truncate">
                {consultant.fullName}
              </h4>
              <p className="text-sm text-slate-500 mt-0.5">
                {consultant.specializations?.slice(0, 2).join(' · ')}
              </p>
            </div>

            {/* Score badge */}
            <div className="shrink-0 flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
              <Award size={10} />
              {Math.round(recommendation.score)}% cocok
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              {Number(consultant.rating).toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {consultant.experienceYears} thn
            </span>
            <span className="font-bold text-slate-900">
              {formatRupiah(consultant.hourlyRate)}/jam
            </span>
          </div>

          {/* AI reason */}
          <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{recommendation.reason}"
            </p>
          </div>

          {/* CTA */}
          <Link
            href={`/consultants/${recommendation.consultantId}`}
            className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 transition uppercase tracking-widest"
          >
            Lihat Profil
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
