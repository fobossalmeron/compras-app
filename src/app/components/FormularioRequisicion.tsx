"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { CalendarIcon, Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Textarea } from "@/app/components/ui/textarea";
import { SearchCombobox } from "./SearchCombobox";
import { useRouter } from "next/navigation";
import { ORDER_STATUS } from "@/lib/constants";
import { formatDate, getCurrentDate, toUTC } from "@/lib/utils"

// Mock data for products
const products = [
  {
    id: 1,
    description: "Resina compuesta Z350",
    marcaModelo: "3M Z350 XT",
    supplier: "Dental Depot",
    estimatedDelivery: "1 semana",
  },
  {
    id: 2,
    description: "Guantes de nitrilo",
    marcaModelo: "SafeTouch Medium",
    supplier: "Medical Supplies",
    estimatedDelivery: "3 días",
  },
  {
    id: 3,
    description: "Anestesia dental lidocaína",
    marcaModelo: "Septodont Articaine 4%",
    supplier: "Dental Express",
    estimatedDelivery: "1 semana",
  },
  {
    id: 4,
    description: "Fresas de diamante",
    marcaModelo: "Brasseler FG 330",
    supplier: "Dental Depot",
    estimatedDelivery: "5 días",
  },
];

export function FormularioRequisicion() {
  const router = useRouter();
  const [requiredDate, setRequiredDate] = React.useState<Date>();
  const [requestedBy, setRequestedBy] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState<
    Array<{
      product: (typeof products)[0];
      quantity: number;
      observations: string;
    }>
  >([]);
  const [openProduct, setOpenProduct] = React.useState(false);
  const [openRequiredDate, setOpenRequiredDate] = React.useState(false);

  // Usar getCurrentDate para obtener la fecha actual en CDMX
  const currentDate = getCurrentDate()

  React.useEffect(() => {
    console.log("Estado actual de selectedProducts:", selectedProducts);
  }, [selectedProducts]);

  React.useEffect(() => {
    console.log("Estado de openProduct:", openProduct);
  }, [openProduct]);

  const handleAddProduct = React.useCallback(
    (product: (typeof products)[0]) => {
      setSelectedProducts((prevProducts) => {
        if (prevProducts.some((p) => p.product.id === product.id)) {
          return prevProducts;
        }
        return [
          { product, quantity: 1, observations: "" },
          ...prevProducts,
        ];
      });

      setOpenProduct(false);
    },
    []
  );

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const newProducts = [...selectedProducts];
    newProducts[index].quantity = parseInt(quantity) || 0;
    setSelectedProducts(newProducts);
  };

  const handleObservationsChange = (index: number, observations: string) => {
    const newProducts = [...selectedProducts];
    newProducts[index].observations = observations;
    setSelectedProducts(newProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestedBy || !requiredDate || selectedProducts.length === 0) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      // Generar nuevo código de requisición
      const requisitionCode = `REQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

      // Usar toUTC para convertir las fechas a UTC antes de enviarlas
      const orderData = {
        orderCode: requisitionCode,
        requisicionPor: requestedBy,
        fechaRequisicion: toUTC(getCurrentDate()).toISOString(),
        eta: toUTC(requiredDate).toISOString(),
        status: ORDER_STATUS.REQUISICION_SISTEMA,
        productos: selectedProducts.map((item) => ({
          descripcion: item.product.description,
          cantidad: item.quantity,
          observaciones: item.observations,
          proveedor: item.product.supplier,
          marcaModelo: item.product.marcaModelo,
          entregaEstimada: item.product.estimatedDelivery,
        })),
      };

      console.log("Enviando datos:", orderData); // Para debugging

      const response = await fetch("/api/ordenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la requisición");
      }

      router.push("/ordenes");
    } catch (error) {
      console.error("Error al crear la requisición:", error);
      alert("Error al crear la requisición");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Nueva Requisición</h1>
        </div>
      </div>

      <div className="p-4">
        <Card className="max-w-3xl mx-auto bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Requested By */}
              <div className="space-y-2 w-64">
                <Label>Requisición por</Label>
                <Input
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  placeholder="Nombre del solicitante"
                />
              </div>

              {/* Required Date Picker */}
              <div className="space-y-2 w-64">
                <Label>Fecha requerida</Label>
                <Popover open={openRequiredDate} onOpenChange={setOpenRequiredDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !requiredDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {requiredDate
                        ? format(requiredDate, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={requiredDate}
                      onSelect={(date: Date | undefined) => {
                        setRequiredDate(date);
                        setOpenRequiredDate(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Campo de fecha actual */}
              <div className="space-y-2">
                <Label>Fecha de requisición</Label>
                <div className="mt-1.5 p-2 bg-gray-200 rounded-md text-sm text-muted-foreground">
                  {formatDate(currentDate, 'dd/MM/yyyy')}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-start gap-4">
                <h2 className="text-lg font-semibold">Productos</h2>
                <SearchCombobox products={products} onSelect={handleAddProduct} />
              </div>

              {/* Selected Products */}
              <div className="space-y-4">
                {selectedProducts.map((item, index) => (
                  <Card key={index} className="p-4 max-w-3xl">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">
                            {item.product.description}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.marcaModelo}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                      <div>
                          <Label>Cantidad</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label>Proveedor</Label>
                          <div className="mt-1.5 p-2 bg-gray-100 rounded-md text-sm text-muted-foreground">
                            {item.product.supplier}
                          </div>
                        </div>
                        <div>
                          <Label>Entrega estimada</Label>
                          <div className="mt-1.5 p-2 bg-gray-100 rounded-md text-sm text-muted-foreground">
                            {item.product.estimatedDelivery}
                          </div>
                        </div>
                        <div className="col-span-3">
                          <Label>Observaciones</Label>
                          <Textarea
                            value={item.observations}
                            onChange={(e) =>
                              handleObservationsChange(index, e.target.value)
                            }
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={
                  !requestedBy || !requiredDate || selectedProducts.length === 0
                }
              >
                Crear requisición
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
