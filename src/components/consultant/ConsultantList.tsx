'use client'

import { useState } from 'react'
import { useConsultants } from '@/hooks/useConsultants'
import { ConsultantCard } from './ConsultantCard'
import { ConsultantFilter } from './ConsultantFilter'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export function ConsultantList() {
  const [specialization, setSpecialization] = useState('Semua')
  const [search, setSearch] = useState('')

  const { data: consultants, isLoading, error } = useConsultants({
    specialization: specialization === 'Semua' ? undefined : specialization,
    search: search || undefined
  })

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <ConsultantFilter 
          selectedCategory={specialization}
          onFilterChange={setSpecialization}
          onSearchChange={setSearch}
        />
      </div>

      <div className="lg:col-span-2">
        <ErrorBoundary>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner size="lg" />
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
