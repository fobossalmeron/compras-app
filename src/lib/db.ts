import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Definimos la ruta al directorio data
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'database.sqlite');

// Creamos el directorio si no existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Creamos una única instancia de la conexión
const db = new Database(dbPath);

// Aseguramos que las tablas existan
db.exec(`
  CREATE TABLE IF NOT EXISTS facturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id INTEGER,
    order_code TEXT,
    numero_factura TEXT NOT NULL,
    fecha_factura DATE NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    anticipo DECIMAL(10,2) DEFAULT NULL,
    fecha_vencimiento DATE NOT NULL,
    observaciones TEXT,
    archivo_nombre TEXT,
    proveedor TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'PENDIENTE'
  );

  CREATE TABLE IF NOT EXISTS anticipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    factura_id INTEGER NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (factura_id) REFERENCES facturas(id)
  );
`);

export { db }; 