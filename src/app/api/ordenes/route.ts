import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = db.prepare('SELECT * FROM ordenes').all()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener órdenes:', error)
    return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 })
  }
} 