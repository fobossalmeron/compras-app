'use client';

import * as React from "react"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { Calendar } from "@/app/components/ui/calendar"
import { CalendarIcon, Check, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Textarea } from "@/app/components/ui/textarea"
import { SearchCombobox } from "./SearchCombobox"

// Mock data for products
const products = [
  {
    id: 1,
    description: "Laptop Dell XPS 13",
    brand: "Dell",
    model: "XPS 13",
    supplier: "Dell México",
    estimatedDelivery: "2 semanas",
  },
  {
    id: 2,
    description: "Monitor LG 27'",
    brand: "LG",
    model: "27GL850-B",
    supplier: "LG Electronics",
    estimatedDelivery: "1 semana",
  },
]

export function FormularioRequisicion() {
  const [requiredDate, setRequiredDate] = React.useState<Date>()
  const [requestedBy, setRequestedBy] = React.useState("")
  const [selectedProducts, setSelectedProducts] = React.useState<Array<{
    product: typeof products[0]
    quantity: number
    observations: string
  }>>([])
  const [openProduct, setOpenProduct] = React.useState(false)
  const [openRequiredDate, setOpenRequiredDate] = React.useState(false)

  // Formatear la fecha actual
  const currentDate = format(new Date(), "PPP", { locale: es })

  React.useEffect(() => {
    console.log('Estado actual de selectedProducts:', selectedProducts);
  }, [selectedProducts]);

  React.useEffect(() => {
    console.log('Estado de openProduct:', openProduct);
  }, [openProduct]);

  const handleAddProduct = React.useCallback((product: typeof products[0]) => {
    console.log('=== handleAddProduct ===');
    console.log('Producto a agregar:', product);
    
    setSelectedProducts(prevProducts => {
      console.log('Estado previo:', prevProducts);
      if (prevProducts.some(p => p.product.id === product.id)) {
        console.log('Producto ya existe en la lista');
        return prevProducts;
      }
      const newProducts = [...prevProducts, { product, quantity: 1, observations: "" }];
      console.log('Nuevos productos:', newProducts);
      return newProducts;
    });
    
    setOpenProduct(false);
  }, []);

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index))
  }

  const handleQuantityChange = (index: number, quantity: string) => {
    const newProducts = [...selectedProducts]
    newProducts[index].quantity = parseInt(quantity) || 0
    setSelectedProducts(newProducts)
  }

  const handleObservationsChange = (index: number, observations: string) => {
    const newProducts = [...selectedProducts]
    newProducts[index].observations = observations
    setSelectedProducts(newProducts)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Nueva Requisición</h1>
      <form className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Campo de fecha actual */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {currentDate}
            </div>
          </div>

          {/* Required Date Picker */}
          <div className="space-y-2">
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
                  {requiredDate ? format(requiredDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={requiredDate}
                  onSelect={(date: Date | undefined) => {
                    setRequiredDate(date)
                    setOpenRequiredDate(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Requested By */}
          <div className="space-y-2">
            <Label>Requisición por</Label>
            <Input
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder="Nombre del solicitante"
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Productos</h2>
            <SearchCombobox 
              products={products}
              onSelect={handleAddProduct}
            />
          </div>

          {/* Selected Products */}
          <div className="space-y-4">
            {selectedProducts.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.product.brand} / {item.product.model}
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Proveedor</Label>
                      <Input
                        value={item.product.supplier}
                        readOnly
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Entrega estimada</Label>
                      <Input
                        value={item.product.estimatedDelivery}
                        readOnly
                        className="mt-1.5"
                      />
                    </div>
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
        <Button type="submit" className="w-full md:w-auto">
          Crear requisición
        </Button>
      </form>
    </div>
  )
}