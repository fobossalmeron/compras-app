import TableroRequisiciones from '../components/TableroRequisiciones';

export default function Tablero() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Tablero de Requisiciones</h1>
      <TableroRequisiciones />
    </div>
  );
}