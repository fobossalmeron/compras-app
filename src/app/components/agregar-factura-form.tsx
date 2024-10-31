'use client'

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Modal } from "@/app/components/ui/modal"
import { Plus } from "lucide-react"
import { FacturaForm, type FacturaFormValues } from "./factura-form"

interface AgregarFacturaFormProps {
  ordenId: number
  onSuccess?: () => void
}

export function AgregarFacturaForm({ ordenId, onSuccess }: AgregarFacturaFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues: FacturaFormValues = {
    numeroFactura: "",
    fechaFactura: new Date().toISOString().split('T')[0],
    monto: "",
    fechaVencimiento: "",
    observaciones: "",
  }

  async function onSubmit(values: FacturaFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/ordenes/${ordenId}/facturas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroFactura: values.numeroFactura,
          fechaFactura: values.fechaFactura,
          monto: parseFloat(values.monto),
          anticipo: values.anticipo ? parseFloat(values.anticipo) : undefined,
          fechaVencimiento: values.fechaVencimiento,
          observaciones: values.observaciones,
          archivoNombre: values.archivoNombre
        }),
      })

      if (!response.ok) throw new Error("Error al crear la factura")

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
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Agregar Factura
      </Button>

      <Modal
        title="Agregar Nueva Factura"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FacturaForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => setIsOpen(false)}
          submitLabel="Crear Factura"
        />
      </Modal>
    </>
  )
} 