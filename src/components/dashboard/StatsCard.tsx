import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden border-slate-200 shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            
            {trend && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-xs font-bold",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? '+' : '-'}{trend.value}%
                </span>
                <span className="text-xs text-slate-400 ml-1">vs bulan lalu</span>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-3 rounded-xl">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        {description && (
          <p className="text-xs text-slate-400 mt-4">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
