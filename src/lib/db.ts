import Database from 'better-sqlite3';
import path from 'path';
import { initSchema } from './schema';

const db = new Database(path.join(process.cwd(), 'ordenes.db'));
initSchema();

db.exec(`
  CREATE TABLE IF NOT EXISTS ordenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_orden TEXT NOT NULL,
    requisicion TEXT NOT NULL,
    eta TEXT NOT NULL,
    requisicion_por TEXT NOT NULL,
    fecha_requisicion TEXT,
    folio_requisicion_intelisis TEXT,
    folio_cotizacion_intelisis TEXT,
    total REAL,
    proveedor TEXT NOT NULL,
    numero_pedimento TEXT,
    fecha_pedimento TEXT,
    metodo_envio TEXT,
    costo_flete REAL,
    unidades_pedidas INTEGER,
    unidades_recibir INTEGER,
    numero_tracking TEXT,
    entrada_compra TEXT,
    status TEXT NOT NULL DEFAULT 'requisicion_sistema',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id INTEGER NOT NULL,
    numero_factura TEXT NOT NULL,
    fecha_factura TEXT NOT NULL,
    monto REAL NOT NULL,
    fecha_vencimiento TEXT NOT NULL,
    observaciones TEXT,
    archivo_nombre TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id)
  );
`);

export { db }; 