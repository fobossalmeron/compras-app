import { EditarFacturaForm } from "@/app/components/editar-factura-form"
import { db } from "@/lib/db"

interface PageProps {
  params: {
    id: string
    facturaId: string
  }
}

export default function EditarFacturaPage({ params }: PageProps) {
  const factura = db.prepare(`
    SELECT 
      id,
      orden_id,
      numero_factura,
      fecha_factura,
      monto,
      fecha_vencimiento,
      observaciones,
      archivo_nombre
    FROM facturas 
    WHERE id = ? AND orden_id = ?
  `).get(params.facturaId, params.id) as any

  if (!factura) {
    throw new Error("Factura no encontrada")
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Factura {factura.numero_factura}</h1>
      <EditarFacturaForm factura={factura} />
    </div>
  )
} 