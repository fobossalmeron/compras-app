"use client"

import * as React from "react"
import { Check, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
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

interface Product {
  id: number
  description: string
  brand: string
  model: string
  supplier: string
  estimatedDelivery: string
}

interface SearchComboboxProps {
  products: Product[]
  onSelect: (product: Product) => void
}

export function SearchCombobox({ products, onSelect }: SearchComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (product: Product) => {
    console.log('Seleccionando producto existente:', product);
    onSelect(product);
    setOpen(false);
    setInputValue("");
  };

  const handleCreateNew = () => {
    console.log('Creando nuevo producto con descripción:', inputValue);
    const newProduct: Product = {
      id: Math.random(), // Temporal ID
      description: inputValue,
      brand: "Personalizado",
      model: "N/A",
      supplier: "Por definir",
      estimatedDelivery: "Por definir"
    };
    onSelect(newProduct);
    setOpen(false);
    setInputValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar producto
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar o crear producto..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              <button
                className="flex items-center gap-2 p-2 w-full hover:bg-accent hover:text-accent-foreground"
                onClick={handleCreateNew}
              >
                <Plus className="h-4 w-4" />
                <span>Crear "{inputValue}"</span>
              </button>
            </CommandEmpty>
            <CommandGroup heading="Productos existentes">
              {products
                .filter(product => 
                  product.description.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((product) => (
                  <div
                    key={product.id}
                    className="px-2 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(product)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{product.description}</span>
                      <span className="text-sm text-muted-foreground">
                        {product.brand} - {product.model}
                      </span>
                    </div>
                  </div>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 