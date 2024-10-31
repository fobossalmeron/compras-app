import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!db) {
      throw new Error('La conexión a la base de datos no está disponible');
    }

    const stmt = db.prepare(`
      WITH ProximaFactura AS (
        SELECT 
          f1.*
        FROM facturas f1
        INNER JOIN (
          SELECT 
            proveedor,
            MIN(fecha_vencimiento) as min_fecha_vencimiento
          FROM facturas
          WHERE strftime('%Y-%m-%d', fecha_vencimiento) >= strftime('%Y-%m-%d', 'now')
          AND (monto_total - COALESCE(anticipo, 0)) > 0
          GROUP BY proveedor
        ) f2 
        ON f1.proveedor = f2.proveedor 
        AND f1.fecha_vencimiento = f2.min_fecha_vencimiento
      )
      SELECT 
        f.proveedor,
        COUNT(DISTINCT f.id) as total_facturas,
        SUM(f.monto_total) as monto_total,
        SUM(COALESCE(f.anticipo, 0)) as anticipos_totales,
        MIN(pf.fecha_vencimiento) as proxima_fecha_vencimiento,
        (pf.monto_total - COALESCE(pf.anticipo, 0)) as monto_proxima_factura,
        SUM(f.monto_total - COALESCE(f.anticipo, 0)) as saldo_pendiente
      FROM facturas f
      LEFT JOIN ProximaFactura pf ON f.proveedor = pf.proveedor
      WHERE (f.monto_total - COALESCE(f.anticipo, 0)) > 0
      GROUP BY f.proveedor
      ORDER BY saldo_pendiente DESC
    `);

    try {
      const proveedores = stmt.all();
      return NextResponse.json(proveedores);
    } catch (dbError) {
      throw dbError;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error interno del servidor', details: errorMessage },
      { status: 500 }
    );
  }
} 