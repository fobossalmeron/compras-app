import { db } from "@/lib/db"
import { NextResponse } from "next/server"

// GET: Obtener una factura específica
export async function GET(
  request: Request,
  { params }: { params: { id: string, facturaId: string } }
) {
  try {
    const factura = db.prepare(`
      SELECT * FROM facturas 
      WHERE id = ? AND orden_id = ?
    `).get(params.facturaId, params.id)

    if (!factura) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json(factura)
  } catch (error) {
    console.error('Error en GET:', error)
    return NextResponse.json({ error: "Error al obtener la factura" }, { status: 500 })
  }
}

// PUT: Actualizar una factura existente
export async function PUT(
  request: Request,
  { params }: { params: { id: string, facturaId: string } }
) {
  try {
    const data = await request.json();

    // Verificar que la factura existe y pertenece a la orden
    const facturaExistente = db.prepare(`
      SELECT 1 FROM facturas 
      WHERE id = ? AND orden_id = ?
    `).get(params.facturaId, params.id);

    if (!facturaExistente) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    const stmt = db.prepare(`
      UPDATE facturas 
      SET 
        numero_factura = ?,
        fecha_factura = ?,
        monto_total = ?,
        anticipo = ?,
        fecha_vencimiento = ?,
        observaciones = ?,
        archivo_nombre = ?
      WHERE id = ? AND orden_id = ?
    `);

    const result = stmt.run(
      data.numeroFactura,
      data.fechaFactura,
      data.monto,
      data.anticipo || null,
      data.fechaVencimiento,
      data.observaciones || null,
      data.archivoNombre || null,
      params.facturaId,
      params.id
    );

    if (result.changes === 0) {
      throw new Error("No se pudo actualizar la factura");
    }

    return NextResponse.json({
      message: "Factura actualizada exitosamente",
      id: params.facturaId,
    });
  } catch (error) {
    console.error("Error al actualizar factura:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar factura",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una factura
export async function DELETE(
  request: Request,
  { params }: { params: { id: string, facturaId: string } }
) {
  try {
    const result = db.prepare(
      "DELETE FROM facturas WHERE id = ? AND orden_id = ?"
    ).run(params.facturaId, params.id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar factura:', error)
    return NextResponse.json({ error: "Error al eliminar la factura" }, { status: 500 })
  }
} 