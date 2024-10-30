"use client"

import { useState } from "react"
import { Modal } from "@/app/components/ui/modal"
import { Pencil } from "lucide-react"
import { DropdownMenuItem } from "@/app/components/ui/dropdown-menu"
import { FacturaForm, type FacturaFormValues } from "./factura-form"

interface EditarFacturaFormProps {
  factura: {
    id: number
    orden_id: number
    numero_factura: string
    fecha_factura: string
    monto: number
    fecha_vencimiento: string
    observaciones: string
    archivo_nombre: string
  }
  onSuccess?: () => void
}

export function EditarFacturaForm({ factura, onSuccess }: EditarFacturaFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues: FacturaFormValues = {
    numero_factura: factura.numero_factura,
    fecha_factura: new Date(factura.fecha_factura).toISOString().split('T')[0],
    monto: factura.monto.toString(),
    fecha_vencimiento: new Date(factura.fecha_vencimiento).toISOString().split('T')[0],
    observaciones: factura.observaciones,
  }

  async function onSubmit(values: FacturaFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/ordenes/${factura.orden_id}/facturas/${factura.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Error al actualizar la factura")

      setIsOpen(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
      >
        <Pencil className="w-4 h-4 mr-2" />
        Editar factura
      </DropdownMenuItem>

      <Modal
        title="Editar Factura"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FacturaForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => setIsOpen(false)}
          submitLabel="Guardar cambios"
        />
      </Modal>
    </>
  )
} 