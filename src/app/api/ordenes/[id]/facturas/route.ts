import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facturas = db.prepare(
      "SELECT * FROM facturas WHERE orden_id = ? ORDER BY fecha_factura DESC"
    ).all(params.id)

    return NextResponse.json(facturas)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const stmt = db.prepare(`
      INSERT INTO facturas (
        orden_id,
        numero_factura,
        fecha_factura,
        monto,
        fecha_vencimiento,
        observaciones,
        archivo_nombre
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      params.id,
      data.numeroFactura,
      data.fechaFactura,
      data.monto,
      data.fechaVencimiento,
      data.observaciones,
      data.archivoNombre
    )

    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear factura" }, { status: 500 })
  }
} 