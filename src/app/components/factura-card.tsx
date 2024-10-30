import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Download, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { EditarFacturaForm } from "./editar-factura-form"

interface Factura {
  id: number
  orden_id: number
  numero_factura: string
  fecha_factura: string
  monto: number
  fecha_vencimiento: string
  observaciones: string
  archivo_nombre: string
}

interface FacturaCardProps {
  factura: Factura
  numeroOrden: string
  onUpdate?: () => void
}

export function FacturaCard({ factura, numeroOrden, onUpdate }: FacturaCardProps) {
  return (
    <Card className="border p-4 mb-4">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-lg">{factura.numero_factura}</p>
            <p className="text-sm text-muted-foreground">Orden de compra: {numeroOrden}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditarFacturaForm 
                factura={factura}
                onSuccess={onUpdate}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Fecha de Factura
            </h3>
            <p className="font-medium">
              {new Date(factura.fecha_factura).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Monto</h3>
            <p className="font-medium">${factura.monto.toFixed(2)} MXN</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Fecha de vencimiento
            </h3>
            <p className="font-medium">
              {new Date(factura.fecha_vencimiento).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        {factura.observaciones && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Observaciones
            </h3>
            <p className="text-sm">{factura.observaciones}</p>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            {factura.archivo_nombre}
          </Button>
        </div>
      </div>
    </Card>
  )
} 