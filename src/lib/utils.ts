import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, toZonedTime } from 'date-fns-tz'
import { es } from 'date-fns/locale'

// Definimos la zona horaria de la Ciudad de México
export const TIMEZONE = 'America/Mexico_City'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatear fecha para mostrar en la UI
export function formatDate(date: string | Date, formatStr: string = 'PPP') {
  if (!date) return ''
  const zonedDate = toZonedTime(new Date(date), TIMEZONE)
  return format(zonedDate, formatStr, { locale: es, timeZone: TIMEZONE })
}

// Convertir fecha local (CDMX) a UTC para guardar en BD
export function toUTC(date: Date | string) {
  return toZonedTime(new Date(date), TIMEZONE)
}

// Obtener fecha actual en CDMX
export function getCurrentDate() {
  return toZonedTime(new Date(), TIMEZONE)
}

// Formatear moneda en MXN
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}
