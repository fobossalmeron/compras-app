export interface Requisicion {
  id: number;
  titulo: string;
  estado: 'pendiente' | 'completada';
}