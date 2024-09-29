'use client';

import { useState } from 'react';

export default function FormularioRequisicion() {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="producto" className="block text-sm font-medium text-gray-700">Producto</label>
          <input type="text" id="producto" name="producto" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input type="number" id="cantidad" name="cantidad" required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="urgencia" className="block text-sm font-medium text-gray-700">Urgencia</label>
          <select id="urgencia" name="urgencia" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50">
            <option value="">Seleccione una opción</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
          <input type="text" id="categoria" name="categoria" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700">Comentarios</label>
          <textarea id="comentarios" name="comentarios" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"></textarea>
        </div>
        <button type="submit" className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Enviar Requisición
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Confirmación</h2>
            <p className="mb-6">Su requisición ha sido enviada con éxito.</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}