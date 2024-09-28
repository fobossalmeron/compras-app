import Link from 'next/link';

export default function Confirmacion() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">¡Requisición enviada con éxito!</h1>
        <p className="mb-6">Tu requisición ha sido guardada y será procesada por el departamento de ventas.</p>
        <Link href="/tablero" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Ver Tablero de Requisiciones
        </Link>
      </div>
    </div>
  );
}