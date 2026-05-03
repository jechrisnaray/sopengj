import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageSquare, MoreVertical } from "lucide-react"
import { formatDateTime, formatRupiah } from "@/lib/utils/format"
import { cn } from "@/lib/utils/cn"

interface BookingCardProps {
  booking: any
  role: 'user' | 'consultant'
  onStatusUpdate?: (id: string, status: string) => void
}

export function BookingCard({ booking, role, onStatusUpdate }: BookingCardProps) {
  const isConsultant = role === 'consultant'
  const targetUser = isConsultant ? booking.user_profiles : booking.consultants?.profiles

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User/Consultant Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={targetUser?.avatar_url} />
              <AvatarFallback>{targetUser?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isConsultant ? 'Klien' : 'Konsultan'}
              </p>
              <h4 className="font-bold text-slate-900">{targetUser?.full_name}</h4>
              <Badge className={cn("mt-1 text-[10px]", statusColors[booking.status as keyof typeof statusColors])}>
                {booking.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Jadwal</p>
                <p className="text-sm font-medium text-slate-700">{formatDateTime(booking.scheduled_at)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Durasi</p>
                <p className="text-sm font-medium text-slate-700">{booking.duration_minutes} Menit</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
            {booking.status === 'pending' && isConsultant && (
              <>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => onStatusUpdate?.(booking.id, 'confirmed')}
                >
                  Terima
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onStatusUpdate?.(booking.id, 'cancelled')}
                >
                  Tolak
                </Button>
              </>
            )}
            
            {booking.status === 'confirmed' && (
              <Button size="sm" variant="outline" className="w-full md:w-auto">
                <MessageSquare className="mr-2 h-4 w-4" /> Masuk Sesi
              </Button>
            )}

            {booking.status === 'completed' && !isConsultant && !booking.has_review && (
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                Beri Review
              </Button>
            )}

            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
        </div>

        {booking.topic && (
          <div className="mt-6 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500 mb-1">TOPIK PEMBAHASAN:</p>
            <p className="text-sm text-slate-700 italic">"{booking.topic}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
