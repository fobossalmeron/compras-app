import { db } from './db'

async function seed() {
  console.log('Iniciando seed...')
  
  try {
    // Iniciar transacción
    const transaction = db.transaction(() => {
      console.log('Limpiando tablas...')
      // Primero limpiamos las facturas (por la llave foránea)
      db.prepare('DELETE FROM facturas').run()
      // Después limpiamos las órdenes
      db.prepare('DELETE FROM ordenes').run()
      
      console.log('Preparando inserción de órdenes...')
      const insertOrden = db.prepare(`
        INSERT INTO ordenes (
          numero_orden,
          requisicion,
          eta,
          requisicion_por,
          fecha_requisicion,
          folio_requisicion_intelisis,
          folio_cotizacion_intelisis,
          total,
          proveedor,
          numero_pedimento,
          fecha_pedimento,
          metodo_envio,
          costo_flete,
          unidades_pedidas,
          unidades_recibir,
          numero_tracking,
          entrada_compra,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      // Let's check the seed data structure
      const ordenes = [
        {
          id: 1,
          numeroOrden: "OC-2024-001",
          requisicion: ['REQ-2024-001', 'REQ-2024-002'],
          eta: '2024-03-15',
          requisicionPor: 'María Esteban',
          fechaRequisicion: '2024-02-01',
          folioRequisicionIntelisis: 'FREQ-001',
          folioCotizacionIntelisis: 'FCOT-001',
          total: 15000.00,
          proveedor: 'DX SOLUCIONES',
          numeroPedimento: 'PED-001',
          fechaPedimento: '2024-02-15',
          metodoEnvio: 'Marítimo',
          costoFlete: 1500.00,
          unidadesPedidas: 100,
          unidadesRecibir: 100,
          numeroTracking: 'TRACK-001',
          entradaCompra: 'EC-001',
          status: 'orden_enviada'
        },
        {
          id: 2,
          numeroOrden: "OC-2024-002",
          requisicion: 'REQ-2024-003',
          eta: '2024-03-16',
          requisicionPor: 'Fernando Álvarez',
          fechaRequisicion: '2024-02-02',
          folioRequisicionIntelisis: 'FREQ-002',
          folioCotizacionIntelisis: 'FCOT-002',
          total: 16000.00,
          proveedor: 'Proveedor B',
          numeroPedimento: 'PED-002',
          fechaPedimento: '2024-02-16',
          metodoEnvio: 'Aéreo',
          costoFlete: 1600.00,
          unidadesPedidas: 110,
          unidadesRecibir: 110,
          numeroTracking: 'TRACK-002',
          entradaCompra: 'EC-002',
          status: 'recibo_almacen'
        }
      ]

      // Insertar órdenes y guardar los IDs
      const ordenIds = ordenes.map(orden => {
        console.log('Insertando orden:', orden)
        const ordenDB = {
          numero_orden: orden.numeroOrden,
          requisicion: Array.isArray(orden.requisicion) ? orden.requisicion.join(', ') : orden.requisicion,
          eta: orden.eta,
          requisicion_por: orden.requisicionPor,
          fecha_requisicion: orden.fechaRequisicion,
          folio_requisicion_intelisis: orden.folioRequisicionIntelisis,
          folio_cotizacion_intelisis: orden.folioCotizacionIntelisis,
          total: orden.total,
          proveedor: orden.proveedor,
          numero_pedimento: orden.numeroPedimento,
          fecha_pedimento: orden.fechaPedimento,
          metodo_envio: orden.metodoEnvio,
          costo_flete: orden.costoFlete,
          unidades_pedidas: orden.unidadesPedidas,
          unidades_recibir: orden.unidadesRecibir,
          numero_tracking: orden.numeroTracking,
          entrada_compra: orden.entradaCompra,
          status: orden.status
        }

        const result = insertOrden.run(
          ordenDB.numero_orden,
          ordenDB.requisicion,
          ordenDB.eta,
          ordenDB.requisicion_por,
          ordenDB.fecha_requisicion,
          ordenDB.folio_requisicion_intelisis,
          ordenDB.folio_cotizacion_intelisis,
          ordenDB.total,
          ordenDB.proveedor,
          ordenDB.numero_pedimento,
          ordenDB.fecha_pedimento,
          ordenDB.metodo_envio,
          ordenDB.costo_flete,
          ordenDB.unidades_pedidas,
          ordenDB.unidades_recibir,
          ordenDB.numero_tracking,
          ordenDB.entrada_compra,
          ordenDB.status
        )
        return result.lastInsertRowid
      })

      console.log('Insertando facturas...')
      const insertFactura = db.prepare(`
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

      // Insertar facturas usando los IDs reales de las órdenes
      const facturas = [
        {
          ordenId: 1,
          numeroFactura: "FAC-2024-001",
          fechaFactura: "2024-02-15",
          monto: 7500.00,
          fechaVencimiento: "2024-03-15",
          observaciones: "50% de anticipo",
          archivoNombre: "FAC-2024-001.pdf"
        },
        {
          ordenId: 1,
          numeroFactura: "FAC-2024-002",
          fechaFactura: "2024-03-01",
          monto: 7500.00,
          fechaVencimiento: "2024-03-30",
          observaciones: "50% restante contra entrega",
          archivoNombre: "FAC-2024-002.pdf"
        }
      ]

      facturas.forEach(factura => {
        console.log('Insertando factura:', factura)
        insertFactura.run(
          ordenIds[factura.ordenId - 1], // Usar el ID real de la orden
          factura.numeroFactura,
          factura.fechaFactura,
          factura.monto,
          factura.fechaVencimiento,
          factura.observaciones,
          factura.archivoNombre
        )
      })
    })

    // Ejecutar la transacción
    transaction()
    console.log('Seed completado exitosamente')
  } catch (error) {
    console.error('Error durante el seed:', error)
    throw error
  }
}

seed().catch(console.error)