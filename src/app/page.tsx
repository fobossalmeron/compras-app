'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Sistema de Requisiciones</h1>
      <div className="space-y-4">
        <Link href="/nueva-requisicion" className="block w-64 px-4 py-2 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          Hacer una Requisición
        </Link>
        <Link href="/tablero" className="block w-64 px-4 py-2 text-center bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
          Consultar Requisiciones
        </Link>
      </div>
    </div>
  );
}