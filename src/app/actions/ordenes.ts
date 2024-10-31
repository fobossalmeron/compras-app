"use server"

import { revalidatePath } from "next/cache"
import { OrderStatus } from '@/lib/constants'

export interface OrdenInput {
  orderCode?: string
  requisicion: string[] | string
  eta: string
  requisicionPor: string
  fechaRequisicion?: string
  folioRequisicionIntelisis?: string
  folioCotizacionIntelisis?: string
  total?: number
  proveedor: string
  numeroPedimento?: string
  fechaPedimento?: string
  metodoEnvio?: string
  costoFlete?: number
  unidadesPedidas?: number
  unidadesRecibir?: number
  numeroTracking?: string
  entradaCompra?: string
  status: OrderStatus
  productos?: {
    descripcion: string;
    cantidad: number;
    marcaModelo: string;
    observaciones: string;
  }[];
}

export async function actualizarOrden(id: number, data: OrdenInput) {
  try {
    console.log('actualizarOrden called with:', { id, data })
    const { id: _, ...dataWithoutId } = data as any
    
    const res = await fetch(`http://localhost:3000/api/ordenes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithoutId),
    })

    console.log('API response status:', res.status)
    const responseData = await res.json()
    console.log('API response data:', responseData)

    if (!res.ok) throw new Error('Error al actualizar')

    revalidatePath(`/ordenes/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error en actualizarOrden:', error)
    return { success: false, error: "Error al actualizar la orden" }
  }
}

export async function obtenerOrden(id: number) {
  const res = await fetch(`http://localhost:3000/api/ordenes/${id}`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  })
  
  if (!res.ok) return null
  
  return res.json()
} 