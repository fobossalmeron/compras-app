"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Download, UploadCloud } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { actualizarOrden, type OrdenInput } from "@/app/actions/ordenes";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { FacturaCard } from "@/app/components/factura-card";
import { AgregarFacturaForm } from "@/app/components/agregar-factura-form";
import { Factura } from "@/app/types/factura";

interface OrdenProps {
  orden: OrdenInput & { id: number };
}

export default function Component({ orden }: OrdenProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [facturas, setFacturas] = useState<Factura[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrdenInput>({
    defaultValues: orden,
  });

  // Función para cargar las facturas
  const cargarFacturas = async () => {
    try {
      const res = await fetch(`/api/ordenes/${orden.id}/facturas`);
      if (res.ok) {
        const data = await res.json();
        setFacturas(data);
      }
    } catch (err) {
      console.error("Error al cargar facturas:", err);
    }
  };

  // Cargar facturas al montar el componente
  useEffect(() => {
    cargarFacturas();
  }, [orden.id]);

  async function onSubmit(data: OrdenInput) {
    const unidadesPedidas =
      Number(data.unidadesPedidas) || orden.unidadesPedidas || 0;
    const unidadesRecibir =
      Number(data.unidadesRecibir) || orden.unidadesRecibir || 0;

    const formData = {
      orderCode: data.orderCode || orden.orderCode,
      requisicion: data.requisicion || orden.requisicion,
      eta: data.eta || orden.eta,
      requisicionPor: data.requisicionPor || orden.requisicionPor,
      fechaRequisicion: data.fechaRequisicion || orden.fechaRequisicion,
      folioRequisicionIntelisis:
        data.folioRequisicionIntelisis || orden.folioRequisicionIntelisis,
      folioCotizacionIntelisis:
        data.folioCotizacionIntelisis || orden.folioCotizacionIntelisis,
      total: Number(data.total) || orden.total || 0,
      proveedor: data.proveedor || orden.proveedor,
      numeroPedimento: data.numeroPedimento || orden.numeroPedimento,
      fechaPedimento: data.fechaPedimento || orden.fechaPedimento,
      metodoEnvio: data.metodoEnvio || orden.metodoEnvio,
      costoFlete: Number(data.costoFlete) || orden.costoFlete || 0,
      unidadesPedidas,
      unidadesRecibir,
      numeroTracking: data.numeroTracking || orden.numeroTracking,
      entradaCompra: data.entradaCompra || orden.entradaCompra,
      status: data.status || orden.status,
    } satisfies OrdenInput;

    console.log("Form data being submitted:", formData);
    const result = await actualizarOrden(orden.id, formData);
    console.log("Result from actualizarOrden:", result);
    if (result.success) {
      setIsEditing(false);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar cambios</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Actualizar
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              {/* Order Header */}
              <div>
                <div className="flex flex-col items-baseline gap-3">
                  <div className="w-full">
                    {/* Order Code */}
                    <div className="mb-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <h1 className="text-3xl font-bold tracking-tight">
                            OC:
                          </h1>
                          <input
                            {...register("orderCode")}
                            className="text-2xl font-bold tracking-tight border rounded px-2"
                          />
                        </div>
                      ) : (
                        <h1 className="text-3xl font-bold tracking-tight">
                          OC: {orden.orderCode}
                        </h1>
                      )}
                    </div>

                    <div className="flex justify-between w-full">
                      {/* Requisicion */}
                      <div className="max-w-1/2 w-full flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">
                          Requisición{" "}
                        </span>
                        {isEditing ? (
                          <input
                            {...register("requisicion")}
                            placeholder="Requisiciones (separadas por comas)"
                            className="text-sm border rounded px-2 py-1 w-full mt-1"
                            defaultValue={
                              Array.isArray(orden.requisicion)
                                ? orden.requisicion.join(", ")
                                : orden.requisicion
                            }
                          />
                        ) : (
                          <span className="text-2xl font-bold">
                            {Array.isArray(orden.requisicion)
                              ? orden.requisicion.join(", ")
                              : orden.requisicion}
                          </span>
                        )}
                      </div>

                      {/* ETA */}
                      <div className="max-w-1/2 w-full flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">
                          ETA{" "}
                        </span>
                        {isEditing ? (
                          <input
                            type="date"
                            {...register("eta")}
                            className="text-sm border rounded px-2 py-1 w-full mt-1"
                          />
                        ) : (
                          <span className="text-2xl font-bold">
                            {orden.eta
                              ? new Date(orden.eta).toLocaleDateString(
                                  "es-MX",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : "No especificado"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Status
                </h3>
                {isEditing ? (
                  <select
                    {...register("status")}
                    className="w-full px-2 py-1 font-medium border rounded"
                  >
                    {Object.entries(ORDER_STATUS_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <p className="font-medium">
                    {orden.status
                      ? ORDER_STATUS_LABELS[
                          orden.status as keyof typeof ORDER_STATUS_LABELS
                        ]
                      : "Estado no disponible"}
                  </p>
                )}
              </div>

              {/* Requisition Details */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Requisición por
                      </h3>
                      <p className="font-medium">{orden.requisicionPor}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Fecha de requisición
                      </h3>
                      <p className="font-medium">
                        {orden.fechaRequisicion || "No especificada"}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Folio Requisión Intelisis
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          {...register("folioRequisicionIntelisis")}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">
                          {orden.folioRequisicionIntelisis || "Por definir"}
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Folio Cotización Intelisis
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          {...register("folioCotizacionIntelisis")}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">
                          {orden.folioCotizacionIntelisis || "Por definir"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Total
                      </h3>
                      {isEditing ? (
                        <input
                          type="number"
                          {...register("total", { valueAsNumber: true })}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">
                          ${orden.total?.toFixed(2) || "0.00"} MXN
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Proveedor
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          {...register("proveedor")}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">{orden.proveedor}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Productos */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Productos</h2>
                <div className="space-y-4">
                  {orden.productos?.map((producto, index) => (
                    <Card
                      key={index}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Collapsible>
                        <CollapsibleTrigger className="w-full text-left flex items-center justify-between">
                          <div className="grid gap-4 md:grid-cols-2 flex-1">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 text-left">
                                Descripción
                              </h3>
                              <p className="font-medium text-left">
                                {producto.descripcion}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 text-left">
                                Cantidad
                              </h3>
                              <p className="font-medium text-left">
                                {producto.cantidad}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground ml-2 hover:underline">
                            Ver más
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="grid gap-4 md:grid-cols-2 mt-4 pt-4 border-t">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 text-left">
                                Marca/Modelo
                              </h3>
                              <p className="font-medium text-left">
                                {producto.marcaModelo}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 text-left">
                                Observaciones
                              </h3>
                              <p className="font-medium text-left">
                                {producto.observaciones}
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Shipping Details */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Envío</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Número de pedimento
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          {...register("numeroPedimento")}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">
                          {orden.numeroPedimento || "Por definir"}
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Fecha de pedimento
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          {...register("fechaPedimento")}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">
                          {orden.fechaPedimento || "Por definir"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Método de envío
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          {...register("metodoEnvio")}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">
                          {orden.metodoEnvio || "Por definir"}
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Costo del flete
                      </h3>
                      {isEditing ? (
                        <input
                          type="number"
                          {...register("costoFlete", { valueAsNumber: true })}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">
                          {orden.costoFlete && orden.costoFlete > 0
                            ? `$${orden.costoFlete.toFixed(2)}`
                            : "Por definir"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Delivery Details */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Entrega</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Unidades pedidas
                      </h3>
                      {isEditing ? (
                        <input
                          type="number"
                          {...register("unidadesPedidas", {
                            valueAsNumber: true,
                          })}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">{orden.unidadesPedidas}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Unidades a recibir
                      </h3>
                      {isEditing ? (
                        <input
                          type="number"
                          {...register("unidadesRecibir", {
                            valueAsNumber: true,
                          })}
                          className="w-full px-2 py-1 font-medium border rounded"
                        />
                      ) : (
                        <p className="font-medium">{orden.unidadesRecibir}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Material completo
                      </h3>
                      <p className="font-medium">
                        {(orden.unidadesPedidas ?? 0) ===
                          (orden.unidadesRecibir ?? 0) &&
                        (orden.unidadesPedidas ?? 0) > 0
                          ? "Sí"
                          : "No"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Número de tracking
                    </h3>
                    {isEditing ? (
                      <input
                        type="text"
                        {...register("numeroTracking")}
                        className="w-full px-2 py-1 font-medium border rounded"
                      />
                    ) : (
                      <p className="font-medium">
                        {orden.numeroTracking || "No especificado"}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Purchase Entry */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Entrada de compra
                </h2>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      {...register("entradaCompra")}
                      className="px-2 py-1 font-medium border rounded"
                    />
                  ) : (
                    <span className="font-medium">{orden.entradaCompra}</span>
                  )}
                  {orden.entradaCompra ? (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      {orden.entradaCompra}.pdf
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2">
                      <UploadCloud className="w-4 h-4" />
                      Subir entrada de compra
                    </Button>
                  )}
                </div>
              </Card>

              {/* Billing */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Facturación</h2>
                {facturas.map((factura) => (
                  <FacturaCard
                    key={factura.id}
                    factura={factura}
                    showOC={false}
                    onUpdate={cargarFacturas}
                  />
                ))}
                <AgregarFacturaForm
                  ordenId={orden.id}
                  onSuccess={cargarFacturas}
                />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </form>
  );
}
