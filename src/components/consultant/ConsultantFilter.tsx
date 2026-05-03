'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Filter as FilterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'Semua', 'Hukum', 'Keuangan', 'Psikologi', 'Karir', 'Bisnis', 'Kesehatan'
]

interface ConsultantFilterProps {
  onFilterChange: (specialization: string) => void
  onSearchChange: (search: string) => void
  selectedCategory: string
}

export function ConsultantFilter({ 
  onFilterChange, 
  onSearchChange, 
  selectedCategory 
}: ConsultantFilterProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 font-bold text-slate-900 mb-4">
        <FilterIcon className="h-4 w-4" />
        <h3>Filter Konsultan</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Cari Nama</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            id="search"
            placeholder="Cari ahli..." 
            className="pl-10 border-slate-200 focus:ring-blue-500"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Kategori Spesialisasi</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className={cn(
                "cursor-pointer px-3 py-1 text-xs transition-all",
                selectedCategory === category 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              onClick={() => onFilterChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
