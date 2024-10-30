import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('=== GET /api/ordenes ===')
    const ordenes = db.prepare(`
      SELECT 
        o.*,
        GROUP_CONCAT(po.descripcion) as productos_descripcion,
        GROUP_CONCAT(po.cantidad) as productos_cantidad,
        GROUP_CONCAT(po.observaciones) as productos_observaciones,
        GROUP_CONCAT(po.proveedor) as productos_proveedor,
        GROUP_CONCAT(po.marca) as productos_marca,
        GROUP_CONCAT(po.modelo) as productos_modelo,
        GROUP_CONCAT(po.entrega_estimada) as productos_entrega_estimada
      FROM ordenes o
      LEFT JOIN productos_orden po ON o.id = po.orden_id
      GROUP BY o.id
      ORDER BY o.id DESC
    `).all();

    console.log('Órdenes obtenidas:', JSON.stringify(ordenes, null, 2))
    return NextResponse.json(ordenes)
  } catch (error) {
    console.error('Error al obtener órdenes:', error)
    return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('=== POST /api/ordenes ===')
    console.log('Datos recibidos:', JSON.stringify(data, null, 2))

    // Inicializar orderId fuera de la transacción
    let orderId: number | bigint = 0;

    // Ejecutar la transacción y capturar el resultado
    const result = db.transaction(() => {
      console.log('Iniciando transacción...')
      
      // Insertar la orden
      const orderResult = db.prepare(`
        INSERT INTO ordenes (
          numero_orden,
          requisicion,
          requisicion_por,
          fecha_requisicion,
          eta,
          status,
          proveedor,
          total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        data.numeroOrden,
        data.numeroOrden,
        data.requisicionPor,
        data.fechaRequisicion,
        data.eta,
        data.status,
        data.productos[0]?.proveedor || 'Por definir',
        0
      )

      console.log('Orden insertada:', orderResult)
      const newOrderId = orderResult.lastInsertRowid
      console.log('ID de la orden:', newOrderId)

      // Insertar los productos de la orden
      console.log('Insertando productos...')
      const insertProductStmt = db.prepare(`
        INSERT INTO productos_orden (
          orden_id,
          descripcion,
          cantidad,
          observaciones,
          proveedor,
          marca,
          modelo,
          entrega_estimada
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      for (const producto of data.productos) {
        console.log('Insertando producto:', producto)
        insertProductStmt.run(
          newOrderId,
          producto.descripcion,
          producto.cantidad,
          producto.observaciones,
          producto.proveedor,
          producto.marca,
          producto.modelo,
          producto.entregaEstimada
        )
      }

      return newOrderId
    })()

    // Asignar el resultado de la transacción a orderId
    orderId = result

    console.log('Transacción completada. ID:', orderId)
    return NextResponse.json({ 
      success: true, 
      id: orderId
    })

  } catch (error) {
    console.error('Error detallado al crear orden:', error)
    return NextResponse.json(
      { error: "Error al crear la orden", details: error }, 
      { status: 500 }
    )
  }
} 