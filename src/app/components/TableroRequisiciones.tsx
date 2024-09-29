'use client';

import { useEffect, useState } from 'react';

interface Requisicion {
  producto: string;
  cantidad: string;
  urgencia: string;
  notas: string;
  estado: 'pendiente' | 'completada';
}

function TableroRequisiciones() {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);

  useEffect(() => {
    const storedRequisiciones = JSON.parse(localStorage.getItem('requisiciones') || '[]');
    // Asegurarse de que cada requisición tenga un estado
    const requisicionesConEstado = storedRequisiciones.map((req: Requisicion) => ({
      ...req,
      estado: req.estado || 'pendiente'
    }));
    setRequisiciones(requisicionesConEstado);
  }, []);

  const marcarComoCompletada = (index: number) => {
    const nuevasRequisiciones = [...requisiciones];
    nuevasRequisiciones[index].estado = 'completada';
    setRequisiciones(nuevasRequisiciones);
    localStorage.setItem('requisiciones', JSON.stringify(nuevasRequisiciones));
  };

  return (
    <div className=" w-full bg-white rounded-lg shadow-md animate-fade-in">
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
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {requisiciones.map((req, index) => (
              <tr key={index} className={req.estado === 'completada' ? 'bg-green-100' : ''}>
                <td className="border p-2">{req.producto}</td>
                <td className="border p-2">{req.cantidad}</td>
                <td className="border p-2">{req.urgencia}</td>
                <td className="border p-2">{req.notas}</td>
                <td className="border p-2">{req.estado}</td>
                <td className="border p-2">
                  {req.estado === 'pendiente' && (
                    <button
                      onClick={() => marcarComoCompletada(index)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Completar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableroRequisiciones;
