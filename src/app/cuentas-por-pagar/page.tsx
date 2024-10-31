"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { formatearFecha, formatCurrency } from "@/lib/utils";
import { ResumenProveedor } from "@/lib/types";

export default function Component() {
  const [proveedores, setProveedores] = useState<ResumenProveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/cuentas-por-pagar", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener datos");
        return res.json();
      })
      .then((data) => {
        setProveedores(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Cuentas por pagar</h1>
        </div>
      </div>
      <main className="flex-1 p-6">
        <div className="grid gap-4">
          {proveedores.map((proveedor) => (
            <Link
              key={proveedor.proveedor}
              href={`/cuentas-por-pagar/${proveedor.proveedor}`}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-column items-start gap-2 justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl  ">
                    {proveedor.proveedor}
                  </CardTitle>
                  <div className="flex flex-col items-start gap-0 mb-4">
                    <div className="text-sm font-medium text-gray-500">
                      Saldo pendiente
                    </div>
                    <div className="text-xl font-semibold">
                      {formatCurrency(proveedor.saldo_pendiente || 0)} USD
                    </div>
                  </div>
                  
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Facturas abiertas
                        </div>
                        <div className="text-lg   ">
                          {proveedor.total_facturas || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Próximo pago
                        </div>
                        <div className="text-lg">
                          {formatCurrency(proveedor.monto_proxima_factura || 0)}{" "}
                          USD
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Fecha de vencimiento
                        </div>
                        <div className="text-lg   ">
                          {proveedor.proxima_fecha_vencimiento
                            ? formatearFecha(
                                proveedor.proxima_fecha_vencimiento
                              )
                            : "No disponible"}
                        </div>
                      </div>
                    </div>
                  </div>
      
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
