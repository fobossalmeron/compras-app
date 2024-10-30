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
    return NextResponse.json({ error: "Error al obtener la factura" }, { status: 500 })
  }
}

// PUT: Actualizar una factura
export async function PUT(
  request: Request,
  { params }: { params: { id: string, facturaId: string } }
) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.numero_factura || !data.fecha_factura || !data.monto || !data.fecha_vencimiento) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const stmt = db.prepare(`
      UPDATE facturas 
      SET 
        numero_factura = ?,
        fecha_factura = ?,
        monto = ?,
        fecha_vencimiento = ?,
        observaciones = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND orden_id = ?
    `)

    const result = stmt.run(
      data.numero_factura,
      data.fecha_factura,
      data.monto,
      data.fecha_vencimiento,
      data.observaciones || null,
      params.facturaId,
      params.id
    )

    if (result.changes === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar la factura" }, { status: 500 })
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
    return NextResponse.json({ error: "Error al eliminar la factura" }, { status: 500 })
  }
} 