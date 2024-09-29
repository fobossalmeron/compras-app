import TableroRequisiciones from "../components/TableroRequisiciones";

export default function Tablero() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tablero de Requisiciones</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <TableroRequisiciones />
      </div>
    </div>
  );
}