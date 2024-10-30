"use server"

import { revalidatePath } from "next/cache"
import { OrderStatus } from '@/lib/constants'

export interface OrdenInput {
  numeroOrden?: string
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
  try {
    const res = await fetch(`http://localhost:3000/api/ordenes/${id}`)
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error al obtener orden:', error)
    return null
  }
} 