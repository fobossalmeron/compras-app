import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { Factura } from '@/app/types/factura';

export async function GET(
  request: Request,
  { params }: { params: { proveedor: string } }
) {
  try {
    const proveedor = decodeURIComponent(params.proveedor);

    // Verificar si el proveedor existe
    const proveedorExists = db.prepare(`
      SELECT 1 FROM facturas WHERE proveedor = ? LIMIT 1
    `).get(proveedor);

    if (!proveedorExists) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      );
    }

    // Obtener las facturas del proveedor
    const facturas = db.prepare(`
      SELECT 
        f.id,
        f.orden_id as ordenId,
        f.order_code as orderCode,
        f.numero_factura as numeroFactura,
        f.fecha_factura as fechaFactura,
        f.monto_total as monto,
        COALESCE(f.anticipo, 0) as anticipo,
        f.fecha_vencimiento as fechaVencimiento,
        f.observaciones,
        f.archivo_nombre as archivoNombre,
        f.proveedor
      FROM facturas f
      WHERE f.proveedor = ?
      AND (f.monto_total - COALESCE(f.anticipo, 0)) > 0
      ORDER BY f.fecha_vencimiento ASC
    `).all(proveedor) as Factura[];

    // Calcular el total a pagar
    const totalAPagar = facturas.reduce(
      (total: number, factura: Factura) => 
        total + (factura.monto - (factura.anticipo || 0)),
      0
    );

    return NextResponse.json({
      nombre: proveedor,
      totalAPagar,
      facturas,
    });
  } catch (error) {
    console.error('Error al obtener datos del proveedor:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del proveedor' },
      { status: 500 }
    );
  }
} 