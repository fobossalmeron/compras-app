"use client";

import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { Download, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { EditarFacturaForm } from "./editar-factura-form";
import { FacturaDB, Factura } from "@/app/types/factura";

interface FacturaCardProps {
  factura: Factura;
  showActions?: boolean;
  showOC?: boolean;
  onUpdate?: () => Promise<void>;
}

export function FacturaCard({
  factura,
  showActions = false,
  showOC = true,
  onUpdate,
}: FacturaCardProps) {
  // Convertir la factura al formato que espera EditarFacturaForm
  const facturaForEdit: FacturaDB = {
    id: factura.id,
    orden_id: factura.ordenId,
    order_code: factura.orderCode,
    numero_factura: factura.numeroFactura,
    fecha_factura: factura.fechaFactura,
    monto_total: factura.monto,
    anticipo: factura.anticipo ?? undefined,
    fecha_vencimiento: factura.fechaVencimiento,
    observaciones: factura.observaciones ?? undefined,
    archivo_nombre: factura.archivoNombre ?? undefined,
    proveedor: factura.proveedor,
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow mb-4">
      <div className="w-full text-indigo-600 text-center hidden">
        (Proveedor: {factura.proveedor}) OC: {factura.orderCode}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-row gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{factura.numeroFactura}</h3>
                {showOC && (
                  <span className="text-sm text-muted-foreground">
                    OC: {factura.orderCode}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(factura.fechaFactura), "PPP", { locale: es })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="text-right">
              <p className="font-medium">{formatCurrency(factura.monto)}</p>
              <p className="text-sm text-muted-foreground">
                Vence:{" "}
                {format(new Date(factura.fechaVencimiento), "PPP", {
                  locale: es,
                })}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <EditarFacturaForm
                  factura={facturaForEdit}
                  onSuccess={() => {
                    if (onUpdate) {
                      onUpdate();
                    }
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Anticipo</p>
            <p className="font-medium">
              {formatCurrency(factura.anticipo ?? 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Restante</p>
            <p className="font-medium">
              {formatCurrency(factura.monto - (factura.anticipo ?? 0))}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t flex justify-between items-start">
          {factura.observaciones && (
            <div>
              <p className="text-sm font-medium">Observaciones:</p>
              <p className="text-sm text-muted-foreground">
                {factura.observaciones}
              </p>
            </div>
          )}

          {factura.archivoNombre && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                console.log("Descargando:", factura.archivoNombre);
              }}
            >
              <Download className="h-4 w-4" />
              {factura.archivoNombre}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
