"use client"

import { useState } from "react"
import { Modal } from "@/app/components/ui/modal"
import { Pencil } from "lucide-react"
import { DropdownMenuItem } from "@/app/components/ui/dropdown-menu"
import { FacturaForm, type FacturaFormValues } from "./factura-form"
import { FacturaDB } from "../types/factura"
import { useRouter } from "next/navigation"

interface EditarFacturaFormProps {
  factura: FacturaDB,
  onSuccess?: () => void
}

export function EditarFacturaForm({ factura, onSuccess }: EditarFacturaFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const defaultValues: FacturaFormValues = {
    numeroFactura: factura.numero_factura,
    fechaFactura: new Date(factura.fecha_factura).toISOString().split('T')[0],
    monto: factura.monto_total.toString(),
    anticipo: factura.anticipo?.toString() || '',
    fechaVencimiento: new Date(factura.fecha_vencimiento).toISOString().split('T')[0],
    observaciones: factura.observaciones || '',
    archivoNombre: factura.archivo_nombre || ''
  }

  async function onSubmit(values: FacturaFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/ordenes/${factura.orden_id}/facturas/${factura.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroFactura: values.numeroFactura,
          fechaFactura: values.fechaFactura,
          monto: parseFloat(values.monto),
          anticipo: values.anticipo ? parseFloat(values.anticipo) : null,
          fechaVencimiento: values.fechaVencimiento,
          observaciones: values.observaciones || null,
          archivoNombre: values.archivoNombre || null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la factura");
      }

      setIsOpen(false)
      
      // Revalidar los datos
      router.refresh()
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(error)
      throw error;
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