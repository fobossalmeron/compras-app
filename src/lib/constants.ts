export const ORDER_STATUS = {
  REQUISICION_SISTEMA: 'requisicion_sistema',
  ORDEN_ENVIADA: 'orden_enviada',
  RECIBO_ALMACEN: 'recibo_almacen',
  REVISION_FISICA: 'revision_fisica',
  ENTRADA_SISTEMA: 'entrada_sistema',
  ENTRADA_CONCLUIDA: 'entrada_concluida',
  RECEPCION_DOCUMENTOS: 'recepcion_documentos',
  ENTREGA_DOCUMENTOS: 'entrega_documentos',
  PAGO_PROVEEDOR: 'pago_proveedor'
} as const

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.REQUISICION_SISTEMA]: 'Requisición en sistema',
  [ORDER_STATUS.ORDEN_ENVIADA]: 'Orden de compra enviada a proveedor',
  [ORDER_STATUS.RECIBO_ALMACEN]: 'Recibo en almacén',
  [ORDER_STATUS.REVISION_FISICA]: 'Revisión física del material',
  [ORDER_STATUS.ENTRADA_SISTEMA]: 'Confirmación de entrada de compra en sistema',
  [ORDER_STATUS.ENTRADA_CONCLUIDA]: 'Confirmación de entrada de compra concluida',
  [ORDER_STATUS.RECEPCION_DOCUMENTOS]: 'Recepción de documentos',
  [ORDER_STATUS.ENTREGA_DOCUMENTOS]: 'Entrega de documentos al área contable',
  [ORDER_STATUS.PAGO_PROVEEDOR]: 'Pago al proveedor'
} as const

export const STATUS_MAP = {
  [ORDER_STATUS.REQUISICION_SISTEMA]: { label: 'Requisición en Sistema', color: 'bg-amber-100 text-amber-800' },
  [ORDER_STATUS.ORDEN_ENVIADA]: { label: 'OC Enviada', color: 'bg-blue-100 text-blue-800' },
  [ORDER_STATUS.RECIBO_ALMACEN]: { label: 'Recibo en Almacén', color: 'bg-indigo-100 text-indigo-800' },
  [ORDER_STATUS.REVISION_FISICA]: { label: 'Revisión Física', color: 'bg-purple-100 text-purple-800' },
  [ORDER_STATUS.ENTRADA_SISTEMA]: { label: 'Entrada en Sistema', color: 'bg-pink-100 text-pink-800' },
  [ORDER_STATUS.ENTRADA_CONCLUIDA]: { label: 'Entrada Concluida', color: 'bg-rose-100 text-rose-800' },
  [ORDER_STATUS.RECEPCION_DOCUMENTOS]: { label: 'Recepción Docs', color: 'bg-orange-100 text-orange-800' },
  [ORDER_STATUS.ENTREGA_DOCUMENTOS]: { label: 'Docs a Contabilidad', color: 'bg-cyan-100 text-cyan-800' },
  [ORDER_STATUS.PAGO_PROVEEDOR]: { label: 'Pago Realizado', color: 'bg-green-100 text-green-800' }
} as const

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS] 