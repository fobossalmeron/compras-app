// Interfaz para datos que vienen de la base de datos (snake_case)
export interface FacturaDB {
    id: number;
    orden_id: number;
    order_code: string;
    numero_factura: string;
    fecha_factura: string;
    monto_total: number;
    anticipo?: number;
    fecha_vencimiento: string;
    observaciones?: string | null;
    archivo_nombre?: string | null;
    proveedor: string;
}

// Interfaz para uso en el frontend (camelCase)
export interface Factura {
    id: number;
    ordenId: number;
    orderCode: string;
    numeroFactura: string;
    fechaFactura: string;
    monto: number;
    anticipo?: number;
    fechaVencimiento: string;
    observaciones?: string;
    archivoNombre?: string;
    proveedor: string;
}
