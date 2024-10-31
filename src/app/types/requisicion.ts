export interface Requisicion {
  id: number;
  titulo: string;
  estado: 'pendiente' | 'completada';
}

export interface ProductoOrden {
  descripcion: string;
  cantidad: number;
  observaciones: string;
  proveedor: string;
  marcaModelo: string;
  entregaEstimada: string;
}

export interface Orden {
  id: number;
  orderCode: string;
  requisicion: string;
  eta: string;
  requisicionPor: string;
  fechaRequisicion: string;
  folioRequisicionIntelisis: string;
  folioCotizacionIntelisis: string;
  total: number;
  proveedor: string;
  numeroPedimento: string;
  fechaPedimento: string;
  metodoEnvio: string;
  costoFlete: number;
  unidadesPedidas: number;
  unidadesRecibir: number;
  numeroTracking: string;
  entradaCompra: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  productos: ProductoOrden[];
}

// También podemos definir el tipo para el input del formulario
export interface OrdenInput {
  orderCode: string;
  requisicion: string;
  eta: string;
  requisicionPor: string;
  fechaRequisicion: string;
  folioRequisicionIntelisis: string;
  folioCotizacionIntelisis: string;
  total: number;
  proveedor: string;
  numeroPedimento: string;
  fechaPedimento: string;
  metodoEnvio: string;
  costoFlete: number;
  unidadesPedidas: number;
  unidadesRecibir: number;
  numeroTracking: string;
  entradaCompra: string;
  status: string;
}