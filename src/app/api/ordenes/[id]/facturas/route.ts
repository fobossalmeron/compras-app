import { db } from "@/lib/db"
import { NextResponse } from "next/server"

// GET: Obtener todas las facturas de una orden
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
    const data = await request.json()
    console.log('Datos recibidos:', data)

    // Validar que la orden existe
    const orden = db.prepare('SELECT id FROM ordenes WHERE id = ?').get(params.id)
    if (!orden) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    // Validar datos requeridos
    if (!data.numero_factura || !data.fecha_factura || !data.monto || !data.fecha_vencimiento) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const stmt = db.prepare(`
      INSERT INTO facturas (
        orden_id,
        numero_factura,
        fecha_factura,
        monto,
        fecha_vencimiento,
        observaciones
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      params.id,
      data.numero_factura,
      data.fecha_factura,
      data.monto,
      data.fecha_vencimiento,
      data.observaciones || null
    )

    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid 
    })

  } catch (error) {
    console.error('Error al crear factura:', error)
    return NextResponse.json({ 
      error: "Error al crear la factura" 
    }, { status: 500 })
  }
} 