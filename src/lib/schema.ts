import { db } from "./db"

export function initSchema() {
  db.exec(`
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
  `)
} 