'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Filter as FilterIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'Semua', 'Hukum', 'Keuangan', 'Psikologi', 'Karir', 'Bisnis', 'Teknologi', 'Kesehatan'
]

interface ConsultantFilterProps {
  onFilterChange: (specialization: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
  onAvailabilityChange: (available: boolean) => void
  selectedCategory: string
  isAvailableOnly: boolean
}

export function ConsultantFilter({ 
  onFilterChange, 
  onSearchChange, 
  onSortChange,
  onAvailabilityChange,
  selectedCategory,
  isAvailableOnly
}: ConsultantFilterProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 sticky top-24">
      <div className="flex items-center gap-2 font-bold text-slate-900 mb-4">
        <FilterIcon className="h-4 w-4 text-blue-600" />
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
        <Label>Urutkan Berdasarkan</Label>
        <Select onValueChange={onSortChange} defaultValue="rating">
          <SelectTrigger className="w-full border-slate-200">
            <SelectValue placeholder="Pilih urutan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating Tertinggi</SelectItem>
            <SelectItem value="price_asc">Harga Terendah</SelectItem>
            <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
            <SelectItem value="experience">Pengalaman Terlama</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between py-2 border-t border-b border-slate-50">
        <div className="space-y-0.5">
          <Label className="cursor-pointer" htmlFor="available-only">Hanya Tersedia</Label>
          <p className="text-[10px] text-slate-500">Tampilkan yang aktif</p>
        </div>
        <Switch 
          id="available-only"
          checked={isAvailableOnly}
          onCheckedChange={onAvailabilityChange}
        />
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
