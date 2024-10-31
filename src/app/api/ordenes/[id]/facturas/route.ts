import { FacturaDB, Factura } from "@/app/types/factura"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

// GET: Obtener todas las facturas de una orden
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facturasDB = db.prepare(
      "SELECT * FROM facturas WHERE orden_id = ? ORDER BY fecha_factura DESC"
    ).all(params.id) as FacturaDB[];

    const facturas: Factura[] = facturasDB.map(factura => ({
      id: factura.id,
      ordenId: factura.orden_id,
      orderCode: factura.order_code,
      numeroFactura: factura.numero_factura,
      fechaFactura: factura.fecha_factura,
      monto: factura.monto_total,
      anticipo: factura.anticipo ?? undefined,
      fechaVencimiento: factura.fecha_vencimiento,
      observaciones: factura.observaciones ?? undefined,
      archivoNombre: factura.archivo_nombre ?? undefined,
      proveedor: factura.proveedor
    }));

    return NextResponse.json(facturas)
  } catch (error) {
    console.error('Error al obtener facturas:', error)
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 })
  }
}

// POST: Crear una nueva factura
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Primero obtenemos la orden para obtener el proveedor y order_code
    interface OrdenBasica {
      order_code: string;
      proveedor: string;
    }
 
    const orden = db.prepare(`
      SELECT order_code, proveedor 
      FROM ordenes 
      WHERE id = ?
    `).get(params.id) as OrdenBasica;

    if (!orden) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    const stmt = db.prepare(`
      INSERT INTO facturas (
        orden_id,
        order_code,
        numero_factura,
        fecha_factura,
        monto_total,
        anticipo,
        fecha_vencimiento,
        observaciones,
        archivo_nombre,
        proveedor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      params.id,
      orden.order_code,
      data.numeroFactura,
      data.fechaFactura,
      data.monto,  // Se insertará como monto_total en la BD
      data.anticipo || null,
      data.fechaVencimiento,
      data.observaciones || null,
      data.archivoNombre || null,
      orden.proveedor
    );

    if (result.changes === 0) {
      throw new Error("No se pudo insertar la factura");
    }

    return NextResponse.json({ 
      id: result.lastInsertRowid,
      message: "Factura creada exitosamente" 
    });
  } catch (error) {
    console.error('Error al crear factura:', error);
    return NextResponse.json({ 
      error: "Error al crear factura",
      details: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  }
} 