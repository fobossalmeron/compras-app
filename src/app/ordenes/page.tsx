"use client"

import { Card } from "@/app/components/ui/card"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Button } from "@/app/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ORDER_STATUS, STATUS_MAP } from '@/lib/constants'
import { OrderStatus } from '@/lib/constants'

interface Orden {
  id: number
  numero_orden: string
  requisicion: string
  eta: string
  proveedor: string
  total: number
  status: OrderStatus
}

const columns = [
  { id: 'requisicion_sistema', title: 'Requisición en Sistema' },
  { id: 'orden_enviada', title: 'OC Enviada' },
  { id: 'recibo_almacen', title: 'Recibo en Almacén' },
  { id: 'revision_fisica', title: 'Revisión Física' },
  { id: 'entrada_sistema', title: 'Entrada en Sistema' },
  { id: 'entrada_concluida', title: 'Entrada Concluida' },
  { id: 'recepcion_documentos', title: 'Recepción Docs' },
  { id: 'entrega_documentos', title: 'Docs a Contabilidad' },
  { id: 'pago_proveedor', title: 'Pago Realizado' }
]

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  useEffect(() => {
    setLoading(true)
    fetch('/api/ordenes')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar las órdenes')
        return res.json()
      })
      .then(data => {
        console.log('Órdenes recibidas:', data)
        setOrdenes(data)
      })
      .catch(err => {
        console.error('Error:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Cargando órdenes...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (!ordenes.length) return <div className="p-8">No hay órdenes disponibles</div>

  function getStatusInfo(status: string | undefined) {
    // Aseguramos que el status esté en minúsculas
    const normalizedStatus = (status?.toLowerCase() ?? '') as keyof typeof STATUS_MAP
    return STATUS_MAP[normalizedStatus] || { 
      label: 'Pendiente', 
      color: 'bg-gray-100 text-gray-800' 
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header con toggle de vistas */}
      <div className="p-4 bg-white border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Órdenes de Compra</h1>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {viewMode === 'list' ? (
            // Vista de Lista
            <div className="grid gap-4">
              {ordenes.map((orden) => (
                <Link key={orden.id} href={`/ordenes/${orden.id}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">OC: {orden.numero_orden}</span>
                          <span className="text-gray-500 text-sm">Req: {orden.requisicion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">ETA:</span>
                          <span className="text-sm font-medium">{orden.eta}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(orden.status).color}`}>
                          {getStatusInfo(orden.status).label}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            // Vista Kanban
            <div className="grid grid-cols-4 gap-4">
              {columns.map(column => (
                <div key={column.id} className="flex flex-col h-full">
                  <h3 className="font-medium mb-3 px-2">{column.title}</h3>
                  <Card className="flex-1 p-4 bg-gray-50/50">
                    <div className="space-y-3">
                      {ordenes
                        .filter(orden => orden.status === column.id)
                        .map(orden => (
                          <Link key={orden.id} href={`/ordenes/${orden.id}`}>
                            <Card className="p-4 bg-white hover:shadow-md transition-shadow">
                              <h4 className="font-medium">OC: {orden.numero_orden}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Req: {orden.requisicion}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ETA: {orden.eta}
                              </p>
                            </Card>
                          </Link>
                        ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}