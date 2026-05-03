import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ConsultantCardProps {
  consultant: {
    id: string
    fullName: string
    specializations: string[]
    hourlyRate: number
    rating: number
    avatarUrl?: string
    isAvailable: boolean
  }
}

import { formatRupiah } from '@/lib/utils/format'

export function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <Card className="group overflow-hidden border-slate-200 transition-all hover:border-blue-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage src={consultant.avatarUrl} alt={consultant.fullName} />
              <AvatarFallback className="bg-blue-50 text-blue-600">
                {consultant.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {consultant.isAvailable && (
              <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 border-2 border-white" title="Tersedia Sekarang" />
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm font-bold text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span>{consultant.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
            {consultant.fullName}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {consultant.specializations.map((spec) => (
              <Badge key={spec} variant="secondary" className="bg-blue-50 text-blue-700 text-[10px] font-medium">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mulai dari</p>
            <p>
                <span className="text-lg font-bold text-slate-900">{formatRupiah(consultant.hourlyRate)}</span>
                <span className="text-sm font-normal text-slate-400">/jam</span>
            </p>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <Clock className="mr-1 h-3 w-3" />
            {consultant.isAvailable ? 'Siap Konsultasi' : 'Sibuk'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 p-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/consultants/${consultant.id}`}>Lihat Profil</Link>
        </Button>
        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
          <Link href={`/consultants/${consultant.id}?book=true`}>Booking</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
