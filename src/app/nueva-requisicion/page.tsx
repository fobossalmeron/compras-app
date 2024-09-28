import React from 'react';
import FormularioRequisicion from '../components/FormularioRequisicion';

export default function NuevaRequisicion() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Nueva Requisición</h1>
      <FormularioRequisicion />
    </div>
  );
}