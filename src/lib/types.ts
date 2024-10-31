export interface ResumenProveedor {
  proveedor: string;
  monto_total: number;
  total_facturas: number;
  monto_proxima_factura: number;
  proxima_fecha_vencimiento: string;
  anticipos_totales: number;
  saldo_pendiente: number;
} 