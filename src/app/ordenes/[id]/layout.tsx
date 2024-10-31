import { obtenerOrden } from "@/app/actions/ordenes"
import { notFound } from "next/navigation"
import Component from "./page"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Layout({
  params,
}: {
  params: { id: string }
}) {
  const orden = await obtenerOrden(parseInt(params.id))

  if (!orden) {
    notFound()
  }

  return <Component orden={orden} />
} 