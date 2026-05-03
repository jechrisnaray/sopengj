import { format } from "date-fns"
import { id } from "date-fns/locale"

/**
 * Memformat angka ke dalam format mata uang Rupiah
 */
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Memformat tanggal ke dalam format panjang Indonesia (contoh: 12 Mei 2024)
 */
export const formatDateFull = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "dd MMMM yyyy", { locale: id })
}

/**
 * Memformat tanggal dan waktu (contoh: 12 Mei 2024, 14:00)
 */
export const formatDateTime = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "dd MMMM yyyy, HH:mm", { locale: id })
}

/**
 * Memformat hari saja (contoh: Senin)
 */
export const formatDay = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "EEEE", { locale: id })
}
