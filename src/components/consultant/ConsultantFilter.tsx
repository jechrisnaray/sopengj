'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Filter as FilterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'Semua', 'Hukum', 'Keuangan', 'Psikologi', 'Karir', 'Bisnis', 'Teknologi', 'Kesehatan',
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
  isAvailableOnly,
}: ConsultantFilterProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6 sticky top-24">
      <div className="flex items-center gap-2 font-bold text-slate-900">
        <FilterIcon className="h-4 w-4 text-blue-600" />
        <h3>Filter Konsultan</h3>
      </div>

      {/* Pencarian */}
      <div className="space-y-2">
        <Label htmlFor="search-consultant">Cari Nama</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="search-consultant"
            placeholder="Cari ahli..."
            className="pl-10 border-slate-200"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Urutan */}
      <div className="space-y-2">
        <Label htmlFor="sort-consultant">Urutkan Berdasarkan</Label>
        <select
          id="sort-consultant"
          defaultValue="rating"
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="rating">Rating Tertinggi</option>
          <option value="price_asc">Harga Terendah</option>
          <option value="price_desc">Harga Tertinggi</option>
          <option value="experience">Pengalaman Terlama</option>
        </select>
      </div>

      {/* Toggle Tersedia */}
      <div className="flex items-center justify-between py-2 border-t border-b border-slate-100">
        <div>
          <Label htmlFor="available-only" className="cursor-pointer">
            Hanya Tersedia
          </Label>
          <p className="text-[10px] text-slate-500">Tampilkan yang aktif hari ini</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id="available-only"
            type="checkbox"
            checked={isAvailableOnly}
            onChange={(e) => onAvailabilityChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
        </label>
      </div>

      {/* Kategori */}
      <div className="space-y-3">
        <Label>Kategori Spesialisasi</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className={cn(
                'cursor-pointer px-3 py-1 text-xs transition-all',
                selectedCategory === category
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
