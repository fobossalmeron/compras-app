import { db } from './db'
import { FacturaDB, Factura } from '../app/types/factura'

// Primero creamos todas las tablas
// Crear tabla de ordenes
db.prepare(`
  CREATE TABLE IF NOT EXISTS ordenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT NOT NULL,
    requisicion TEXT NOT NULL DEFAULT '',
    requisicion_por TEXT NOT NULL,
    fecha_requisicion TEXT NOT NULL,
    eta TEXT NOT NULL,
    status TEXT NOT NULL,
    proveedor TEXT,
    total REAL DEFAULT 0,
    folio_requisicion_intelisis TEXT,
    folio_cotizacion_intelisis TEXT,
    numero_pedimento TEXT,
    fecha_pedimento TEXT,
    metodo_envio TEXT,
    costo_flete REAL,
    unidades_pedidas INTEGER,
    unidades_recibir INTEGER,
    numero_tracking TEXT,
    entrada_compra TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

// Crear tabla de productos_orden
db.prepare(`
  CREATE TABLE IF NOT EXISTS productos_orden (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    observaciones TEXT,
    proveedor TEXT,
    marca_modelo TEXT,
    entrega_estimada TEXT,
    FOREIGN KEY (orden_id) REFERENCES ordenes (id)
  )
`).run()

// Añadir la definición de la tabla facturas ANTES de la función seed
db.prepare(`
  CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id INTEGER NOT NULL,
    order_code TEXT NOT NULL,
    numero_factura TEXT NOT NULL,
    fecha_factura TEXT NOT NULL,
    monto_total REAL NOT NULL,
    anticipo REAL,
    fecha_vencimiento TEXT NOT NULL,
    observaciones TEXT,
    archivo_nombre TEXT,
    proveedor TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes (id)
  )
`).run()

async function seed() {
  try {
    const transaction = db.transaction(() => {
      console.log('Iniciando seed...');
      
      // Iniciar transacción
      const transaction = db.transaction(() => {
        console.log('Limpiando tablas...')
        // Primero limpiamos las facturas (por la llave foránea)
        db.prepare('DELETE FROM facturas').run()
        // Después limpiamos los productos (por la llave foránea)
        db.prepare('DELETE FROM productos_orden').run()
        // Finalmente limpiamos las órdenes
        db.prepare('DELETE FROM ordenes').run()
        
        // Eliminar las tablas existentes
        db.prepare('DROP TABLE IF EXISTS facturas').run()
        db.prepare('DROP TABLE IF EXISTS productos_orden').run()
        db.prepare('DROP TABLE IF EXISTS ordenes').run()

        // Recrear las tablas
        db.prepare(`
          CREATE TABLE IF NOT EXISTS ordenes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_code TEXT NOT NULL,
            requisicion TEXT NOT NULL DEFAULT '',
            requisicion_por TEXT NOT NULL,
            fecha_requisicion TEXT NOT NULL,
            eta TEXT NOT NULL,
            status TEXT NOT NULL,
            proveedor TEXT,
            total REAL DEFAULT 0,
            folio_requisicion_intelisis TEXT,
            folio_cotizacion_intelisis TEXT,
            numero_pedimento TEXT,
            fecha_pedimento TEXT,
            metodo_envio TEXT,
            costo_flete REAL,
            unidades_pedidas INTEGER,
            unidades_recibir INTEGER,
            numero_tracking TEXT,
            entrada_compra TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run()

        db.prepare(`
          CREATE TABLE IF NOT EXISTS productos_orden (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orden_id INTEGER NOT NULL,
            descripcion TEXT NOT NULL,
            cantidad INTEGER NOT NULL,
            observaciones TEXT,
            proveedor TEXT,
            marca_modelo TEXT,
            entrega_estimada TEXT,
            FOREIGN KEY (orden_id) REFERENCES ordenes (id)
          )
        `).run()

        db.prepare(`
          CREATE TABLE IF NOT EXISTS facturas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orden_id INTEGER NOT NULL,
            order_code TEXT NOT NULL,
            numero_factura TEXT NOT NULL,
            fecha_factura TEXT NOT NULL,
            monto_total REAL NOT NULL,
            anticipo REAL,
            fecha_vencimiento TEXT NOT NULL,
            observaciones TEXT,
            archivo_nombre TEXT,
            proveedor TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (orden_id) REFERENCES ordenes (id)
          )
        `).run()

        console.log('Preparando inserción de órdenes...')
        const insertOrden = db.prepare(`
          INSERT INTO ordenes (
            order_code,
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
            orderCode: "OC-2024-001",
            requisicion: ['REQ-2024-001', 'REQ-2024-002'],
            eta: '2024-03-15',
            requisicionPor: 'María Esteban',
            fechaRequisicion: '2024-02-01',
            folioRequisicionIntelisis: 'FREQ-001',
            folioCotizacionIntelisis: 'FCOT-001',
            total: 15000.00,
            proveedor: 'DXSoluciones',
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
            orderCode: "OC-2024-002",
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
            order_code: orden.orderCode,
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
            ordenDB.order_code,
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
          return Number(result.lastInsertRowid)
        })

        console.log('Insertando facturas...')
        const insertFactura = db.prepare(`
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
        `)

        // Facturas para cada orden
        const facturas: Omit<Factura, 'id'>[] = [
          {
            ordenId: 1,
            numeroFactura: "FAC-2024-001",
            orderCode: "OC-2024-001",
            fechaFactura: "2024-02-15",
            monto: 10000.00,
            anticipo: 5000.00,
            fechaVencimiento: "2024-12-31",
            observaciones: "50% de anticipo",
            archivoNombre: "FAC-2024-001.pdf",
            proveedor: "DXSoluciones"
          },
          {
            ordenId: 2,
            numeroFactura: "FAC-2024-002",
            orderCode: "OC-2024-002",
            fechaFactura: "2024-02-16",
            monto: 5000.00,
            anticipo: 1000.00,
            fechaVencimiento: "2024-12-15",
            observaciones: "30% de anticipo",
            archivoNombre: "FAC-2024-002.pdf",
            proveedor: "Proveedor B"
          },
          {
            ordenId: 2,
            numeroFactura: "FAC-2024-003",
            orderCode: "OC-2024-002",
            fechaFactura: "2024-02-28",
            monto: 6000.00,
            fechaVencimiento: "2024-12-01",
            observaciones: "40% avance de producción",
            archivoNombre: "FAC-2024-003.pdf",
            proveedor: "Proveedor B"
          },
        ]

        facturas.forEach(factura => {
          console.log('Insertando factura:', factura)
          const orden = ordenes.find(o => o.id === factura.ordenId)
          const facturaDB: Omit<FacturaDB, 'id'> = {
            orden_id: ordenIds[factura.ordenId - 1],
            order_code: factura.orderCode,
            numero_factura: factura.numeroFactura,
            fecha_factura: factura.fechaFactura,
            monto_total: factura.monto,
            anticipo: factura.anticipo,
            fecha_vencimiento: factura.fechaVencimiento,
            observaciones: factura.observaciones,
            archivo_nombre: factura.archivoNombre,
            proveedor: factura.proveedor ?? null
          }
          
          insertFactura.run(
            facturaDB.orden_id,
            facturaDB.order_code,
            facturaDB.numero_factura,
            facturaDB.fecha_factura,
            facturaDB.monto_total,
            facturaDB.anticipo,
            facturaDB.fecha_vencimiento,
            facturaDB.observaciones,
            facturaDB.archivo_nombre,
            facturaDB.proveedor
          )
        })

        console.log('Preparando inserción de productos...')
        const insertProducto = db.prepare(`
          INSERT INTO productos_orden (
            orden_id,
            descripcion,
            cantidad,
            observaciones,
            proveedor,
            marca_modelo,
            entrega_estimada
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `)

        // Después de insertar las facturas, agregar:
        const productos = [
          {
            ordenId: 1,
            descripcion: 'Resina dental Z350',
            cantidad: 50,
            marca_modelo: '3M Z350 XT',
            observaciones: 'Resina universal, color A2',
            proveedor: 'Dental Depot',
            entrega_estimada: '1 semana'
          },
          {
            ordenId: 2,
            descripcion: 'Kit de fresas diamante',
            cantidad: 25,
            marca_modelo: 'Brasseler KIT-2024',
            observaciones: 'Set quirúrgico completo',
            proveedor: 'Medical Supplies',
            entrega_estimada: '3 días'
          }
        ]

        productos.forEach(producto => {
          console.log('Insertando producto:', producto)
          insertProducto.run(
            ordenIds[producto.ordenId - 1],
            producto.descripcion,
            producto.cantidad,
            producto.observaciones,
            producto.proveedor,
            producto.marca_modelo,
            producto.entrega_estimada
          )
        })
      })

      console.log('Seed completado exitosamente');
    });

    transaction();
  } catch (error) {
    console.error('Error durante el seed:', error);
    throw error;
  }
}

seed().catch(console.error)