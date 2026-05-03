'use client'

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { useAvailability } from "@/hooks/useAvailability"

interface AvailabilityCalendarProps {
  consultantId: string
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
}

export function AvailabilityCalendar({ 
  consultantId, 
  selectedDate, 
  onDateSelect 
}: AvailabilityCalendarProps) {
  const { isAvailableDay } = useAvailability(consultantId, selectedDate)

  return (
    <div className="flex justify-center border rounded-lg p-4 bg-white shadow-sm">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className="rounded-md"
        disabled={(date) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          // In Demo Mode, only disable past dates. Allow all future dates.
          return date < today
        }}
        initialFocus
        // Highlight available days with a dot or background (via modifiers)
        modifiers={{
          available: (date) => isAvailableDay(date)
        }}
        modifiersStyles={{
          available: { 
            backgroundColor: "#F0FDF4", // Emerald-50
            color: "#166534", // Emerald-800
            fontWeight: "600"
          }
        }}
      />
    </div>
  )
}
