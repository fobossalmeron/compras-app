import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { ORDER_STATUS } from '@/lib/constants'
import { headers } from 'next/headers'

interface OrdenDB {
  id: number
  order_code: string
  requisicion: string
  eta: string
  requisicion_por: string
  fecha_requisicion: string
  folio_requisicion_intelisis: string
  folio_cotizacion_intelisis: string
  total: number
  proveedor: string
  numero_pedimento: string
  fecha_pedimento: string
  metodo_envio: string
  costo_flete: number
  unidades_pedidas: number
  unidades_recibir: number
  numero_tracking: string
  entrada_compra: string
  status: string
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orden = db.prepare(`
      SELECT 
        o.*,
        GROUP_CONCAT(po.descripcion) as productos_descripcion,
        GROUP_CONCAT(po.cantidad) as productos_cantidad,
        GROUP_CONCAT(COALESCE(po.observaciones, '')) as productos_observaciones,
        GROUP_CONCAT(COALESCE(po.proveedor, '')) as productos_proveedor,
        GROUP_CONCAT(COALESCE(po.marca_modelo, '')) as productos_marca_modelo,
        GROUP_CONCAT(COALESCE(po.entrega_estimada, '')) as productos_entrega_estimada
      FROM ordenes o
      LEFT JOIN productos_orden po ON o.id = po.orden_id
      WHERE o.id = ?
      GROUP BY o.id
    `).get(params.id) as OrdenDB & {
      productos_descripcion: string | null;
      productos_cantidad: string | null;
      productos_observaciones: string | null;
      productos_proveedor: string | null;
      productos_marca_modelo: string | null;
      productos_entrega_estimada: string | null;
    };

    console.log('Orden raw from DB:', orden)
    if (!orden) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    const productos = orden.productos_descripcion ? {
      descripcion: orden.productos_descripcion.split(','),
      cantidad: orden.productos_cantidad?.split(',').map(Number) || [],
      observaciones: orden.productos_observaciones?.split(',') || [],
      proveedor: orden.productos_proveedor?.split(',') || [],
      marcaModelo: orden.productos_marca_modelo?.split(',') || [],
      entregaEstimada: orden.productos_entrega_estimada?.split(',') || []
    } : null;

    const productosTransformed = productos ? productos.descripcion.map((_, index) => ({
      descripcion: productos.descripcion[index] || '',
      cantidad: productos.cantidad[index] || 0,
      observaciones: productos.observaciones[index] || '',
      proveedor: productos.proveedor[index] || '',
      marcaModelo: productos.marcaModelo[index] || '',
      entregaEstimada: productos.entregaEstimada[index] || ''
    })) : [];

    const ordenTransformed = {
      id: orden.id,
      orderCode: orden.order_code,
      requisicion: orden.requisicion?.includes(',') ? 
        orden.requisicion.split(',').map(r => r.trim()) : 
        orden.requisicion,
      eta: orden.eta,
      requisicionPor: orden.requisicion_por,
      fechaRequisicion: orden.fecha_requisicion,
      folioRequisicionIntelisis: orden.folio_requisicion_intelisis,
      folioCotizacionIntelisis: orden.folio_cotizacion_intelisis,
      total: orden.total,
      proveedor: orden.proveedor,
      numeroPedimento: orden.numero_pedimento,
      fechaPedimento: orden.fecha_pedimento,
      metodoEnvio: orden.metodo_envio,
      costoFlete: orden.costo_flete,
      unidadesPedidas: orden.unidades_pedidas,
      unidadesRecibir: orden.unidades_recibir,
      numeroTracking: orden.numero_tracking,
      entradaCompra: orden.entrada_compra,
      status: orden.status,
      productos: productosTransformed
    }

    console.log('Orden transformed to camelCase:', ordenTransformed)

    const response = NextResponse.json(ordenTransformed)
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ error: "Error al obtener la orden" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const stmt = db.prepare(`
      UPDATE ordenes 
      SET status = ?
      WHERE id = ?
    `)

    const result = stmt.run(data.status, params.id)

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al actualizar orden:', error)
    return NextResponse.json(
      { error: "Error al actualizar la orden" },
      { status: 500 }
    )
  }
} 