import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-6">Bienvenido al Sistema de Requisiciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/nueva-requisicion" className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-2xl font-semibold mb-2">Nueva Requisición</h2>
          <p className="text-gray-600">Crea una nueva solicitud de requisición para tu departamento.</p>
        </Link>
        <Link href="/tablero" className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <h2 className="text-2xl font-semibold mb-2">Tablero de Requisiciones</h2>
          <p className="text-gray-600">Visualiza y gestiona todas las requisiciones existentes.</p>
        </Link>
      </div>
    </div>
  );
}