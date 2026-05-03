'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ConsultantCard } from './ConsultantCard'
import { ConsultantFilter } from './ConsultantFilter'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export function ConsultantList() {
  const [specialization, setSpecialization] = useState('Semua')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [isAvailableOnly, setIsAvailableOnly] = useState(false)

  const consultants = useQuery(api.consultants.list, {
    specialization: specialization === 'Semua' ? undefined : specialization,
    search: search || undefined,
  })

  const isLoading = consultants === undefined
  const error = null // Convex handle error via UI or error boundary usually

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <ConsultantFilter 
          selectedCategory={specialization}
          onFilterChange={setSpecialization}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onAvailabilityChange={setIsAvailableOnly}
          isAvailableOnly={isAvailableOnly}
        />
      </div>

      <div className="lg:col-span-2">
        <ErrorBoundary>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i: number) => (
                <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-3/4 bg-slate-100 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-slate-50 rounded" />
                    <div className="h-3 w-4/5 bg-slate-50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
              Terjadi kesalahan saat memuat data.
            </div>
          ) : consultants?.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed bg-slate-50 p-20 text-center text-slate-500">
              Tidak ada konsultan yang ditemukan untuk kriteria ini.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {consultants?.map((c: any) => (
                <ConsultantCard 
                  key={c.id} 
                  consultant={c} 
                />
              ))}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}
