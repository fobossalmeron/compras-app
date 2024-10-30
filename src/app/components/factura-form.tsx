'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"

export const facturaFormSchema = z.object({
  numero_factura: z.string().min(1, "El número de factura es requerido"),
  fecha_factura: z.string().min(1, "La fecha de factura es requerida"),
  monto: z.string().min(1, "El monto es requerido"),
  fecha_vencimiento: z.string().min(1, "La fecha de vencimiento es requerida"),
  observaciones: z.string().optional(),
})

export type FacturaFormValues = z.infer<typeof facturaFormSchema>

interface FacturaFormProps {
  defaultValues: FacturaFormValues
  onSubmit: (values: FacturaFormValues) => Promise<void>
  isLoading: boolean
  onCancel: () => void
  submitLabel: string
}

export function FacturaForm({ 
  defaultValues, 
  onSubmit, 
  isLoading, 
  onCancel,
  submitLabel 
}: FacturaFormProps) {
  const form = useForm<FacturaFormValues>({
    resolver: zodResolver(facturaFormSchema),
    defaultValues
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numero_factura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Factura</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: FAC-2024-001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field} 
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha_factura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Factura</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fecha_vencimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Vencimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Ej: 50% de anticipo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}