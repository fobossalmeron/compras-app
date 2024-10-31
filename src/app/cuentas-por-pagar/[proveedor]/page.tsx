import { Card, CardContent } from "@/app/components/ui/card";
import { FacturaCard } from "@/app/components/factura-card";
import { formatCurrency } from "@/lib/utils";
import { headers } from "next/headers";
import { Factura } from "@/app/types/factura";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProveedorPageProps {
  params: {
    proveedor: string;
  };
}

interface ProveedorData {
  nombre: string;
  totalAPagar: number;
  facturas: Factura[];
}

export default async function ProveedorPage({ params }: ProveedorPageProps) {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const response = await fetch(
    `${protocol}://${host}/api/proveedores/${encodeURIComponent(params.proveedor)}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al cargar los datos del proveedor");
  }

  const proveedor: ProveedorData = await response.json();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link href="/cuentas-por-pagar">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {proveedor.nombre}
          </h1>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total a pagar</p>
            <p className="text-2xl font-bold">
              {formatCurrency(proveedor.totalAPagar)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Facturas abiertas</h2>
            <div className="grid gap-4">
              {proveedor.facturas.map((factura) => (
                <FacturaCard
                  key={factura.id}
                  factura={{
                    ...factura,
                    fechaFactura: new Date(factura.fechaFactura).toISOString(),
                    fechaVencimiento: new Date(
                      factura.fechaVencimiento
                    ).toISOString(),
                  }}
                  showActions={true}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
