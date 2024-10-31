import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatCurrency } from "@/lib/utils"

interface Factura {
  numero: string
  fecha: string 
  monto: number
  estado: string
}

interface FacturasTableProps {
  facturas: Factura[]
}

export function FacturasTable({ facturas }: FacturasTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Factura</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facturas.map((factura) => (
          <TableRow key={factura.numero}>
            <TableCell className="font-medium">{factura.numero}</TableCell>
            <TableCell>
              {format(new Date(factura.fecha), "PPP", { locale: es })}
            </TableCell>
            <TableCell>{formatCurrency(factura.monto)}</TableCell>
            <TableCell>{factura.estado}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}