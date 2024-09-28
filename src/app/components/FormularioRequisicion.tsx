'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormularioRequisicion() {
  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    urgencia: 'normal',
    notas: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requisiciones = JSON.parse(localStorage.getItem('requisiciones') || '[]');
    requisiciones.push(formData);
    localStorage.setItem('requisiciones', JSON.stringify(requisiciones));
    router.push('/confirmacion');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Nueva Requisición</h2>
      <div className="mb-4">
        <label htmlFor="producto" className="block mb-2 font-bold">Producto:</label>
        <input
          type="text"
          id="producto"
          name="producto"
          value={formData.producto}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="cantidad" className="block mb-2 font-bold">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="urgencia" className="block mb-2 font-bold">Urgencia:</label>
        <select
          id="urgencia"
          name="urgencia"
          value={formData.urgencia}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="baja">Baja</option>
          <option value="normal">Normal</option>
          <option value="alta">Alta</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="notas" className="block mb-2 font-bold">Notas:</label>
        <textarea
          id="notas"
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        ></textarea>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Enviar Requisición
      </button>
    </form>
  );
}