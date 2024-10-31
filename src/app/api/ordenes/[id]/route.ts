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
    console.log('PUT request params:', params)
    const dataFromFrontend = await request.json()
    console.log('Data received from frontend:', dataFromFrontend)
    
    // Validar campos requeridos
    if (!dataFromFrontend.orderCode || !dataFromFrontend.requisicionPor || 
        !dataFromFrontend.requisicion || !dataFromFrontend.eta || 
        !dataFromFrontend.proveedor || !Object.values(ORDER_STATUS).includes(dataFromFrontend.status)) {
      console.log('Validation failed:', {
        hasorderCode: !!dataFromFrontend.orderCode,
        hasRequisicionPor: !!dataFromFrontend.requisicionPor,
        hasRequisicion: !!dataFromFrontend.requisicion,
        hasEta: !!dataFromFrontend.eta,
        hasProveedor: !!dataFromFrontend.proveedor,
        hasValidStatus: Object.values(ORDER_STATUS).includes(dataFromFrontend.status),
        receivedStatus: dataFromFrontend.status,
        validStatuses: Object.values(ORDER_STATUS)
      })
      return NextResponse.json(
        { error: "Faltan campos requeridos o status inválido" }, 
        { status: 400 }
      )
    }

    const dataForDB = {
      order_code: dataFromFrontend.orderCode,
      requisicion: Array.isArray(dataFromFrontend.requisicion) ? 
        dataFromFrontend.requisicion.join(', ') : 
        dataFromFrontend.requisicion,
      eta: dataFromFrontend.eta,
      requisicion_por: dataFromFrontend.requisicionPor,
      fecha_requisicion: dataFromFrontend.fechaRequisicion,
      folio_requisicion_intelisis: dataFromFrontend.folioRequisicionIntelisis,
      folio_cotizacion_intelisis: dataFromFrontend.folioCotizacionIntelisis,
      total: dataFromFrontend.total,
      proveedor: dataFromFrontend.proveedor,
      numero_pedimento: dataFromFrontend.numeroPedimento,
      fecha_pedimento: dataFromFrontend.fechaPedimento,
      metodo_envio: dataFromFrontend.metodoEnvio,
      costo_flete: dataFromFrontend.costoFlete,
      unidades_pedidas: dataFromFrontend.unidadesPedidas,
      unidades_recibir: dataFromFrontend.unidadesRecibir,
      numero_tracking: dataFromFrontend.numeroTracking,
      entrada_compra: dataFromFrontend.entradaCompra,
      status: dataFromFrontend.status
    }
    console.log('Data transformed for DB:', dataForDB)
    
    const stmt = db.prepare(`
      UPDATE ordenes SET 
        order_code = @order_code,
        requisicion = @requisicion,
        eta = @eta,
        requisicion_por = @requisicion_por,
        fecha_requisicion = @fecha_requisicion,
        folio_requisicion_intelisis = @folio_requisicion_intelisis,
        folio_cotizacion_intelisis = @folio_cotizacion_intelisis,
        total = @total,
        proveedor = @proveedor,
        numero_pedimento = @numero_pedimento,
        fecha_pedimento = @fecha_pedimento,
        metodo_envio = @metodo_envio,
        costo_flete = @costo_flete,
        unidades_pedidas = @unidades_pedidas,
        unidades_recibir = @unidades_recibir,
        numero_tracking = @numero_tracking,
        entrada_compra = @entrada_compra,
        status = @status,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `)

    console.log('Executing DB update with:', { ...dataForDB, id: params.id })
    try {
      const result = stmt.run({
        ...dataForDB,
        id: params.id
      })
      console.log('DB update result:', result)
      return NextResponse.json({ success: true })
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: "Error en la base de datos", details: dbError.message }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in PUT:', error)
    return NextResponse.json({ 
      error: "Error al actualizar la orden",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 