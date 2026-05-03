'use client'

import { Button } from "@/components/ui/button"
import { useAvailability } from "@/hooks/useAvailability"
import { Clock, Sun, Sunset, Moon } from "lucide-react"

interface TimeSlotPickerProps {
  consultantId: string
  selectedDate: Date
  selectedSlot: string | undefined
  onSlotSelect: (slot: string) => void
}

export function TimeSlotPicker({
  consultantId,
  selectedDate,
  selectedSlot,
  onSlotSelect
}: TimeSlotPickerProps) {
  const { availableSlots, isLoading } = useAvailability(consultantId, selectedDate)

  if (isLoading) return <div className="p-4 text-center text-sm text-slate-500">Memuat jam tersedia...</div>

  if (availableSlots.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg bg-slate-50">
        <p className="text-sm text-slate-500">Tidak ada slot tersedia untuk tanggal ini.</p>
      </div>
    )
  }

  const groups = {
    Pagi: availableSlots.filter(s => s < '12:00'),
    Siang: availableSlots.filter(s => s >= '12:00' && s < '15:00'),
    Sore: availableSlots.filter(s => s >= '15:00' && s < '18:00'),
    Malam: availableSlots.filter(s => s >= '18:00'),
  }

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([label, slots]) => (
        slots.length > 0 && (
          <div key={label} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              {label === 'Pagi' && <Sun className="h-4 w-4 text-amber-500" />}
              {label === 'Siang' && <Sun className="h-4 w-4 text-orange-500" />}
              {label === 'Sore' && <Sunset className="h-4 w-4 text-blue-500" />}
              {label === 'Malam' && <Moon className="h-4 w-4 text-indigo-500" />}
              {label}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  className={`h-10 text-sm font-medium ${
                    selectedSlot === slot ? "bg-blue-600 hover:bg-blue-700" : "hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  onClick={() => onSlotSelect(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}
