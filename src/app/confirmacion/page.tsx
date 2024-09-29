import Link from "next/link";

export default function Confirmacion() {
  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver
      </Link>
      <h1 className="text-2xl font-bold mb-4">Confirmación</h1>
      <p>Su requisición ha sido enviada con éxito.</p>
    </div>
  );
}