'use client';

import { useEffect, useState } from 'react';

interface Requisicion {
  producto: string;
  cantidad: string;
  urgencia: string;
  notas: string;
}

function TableroRequisiciones() {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);

  useEffect(() => {
    const storedRequisiciones = JSON.parse(localStorage.getItem('requisiciones') || '[]');
    setRequisiciones(storedRequisiciones);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Tablero de Requisiciones</h2>
      {requisiciones.length === 0 ? (
        <p className="text-center text-gray-500">No hay requisiciones pendientes.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Producto</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Urgencia</th>
              <th className="border p-2">Notas</th>
            </tr>
          </thead>
          <tbody>
            {requisiciones.map((req, index) => (
              <tr key={index}>
                <td className="border p-2">{req.producto}</td>
                <td className="border p-2">{req.cantidad}</td>
                <td className="border p-2">{req.urgencia}</td>
                <td className="border p-2">{req.notas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableroRequisiciones;