import { Package2, ClipboardList, CreditCard, BadgeDollarSign } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Compras</h1>
        </div>
        <nav className="px-4 py-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2 mb-1">
              <Package2 className="w-4 h-4" />
              Nueva requisición
            </Button>
          </Link>
          <Link href="/ordenes">
            <Button variant="ghost" className="w-full justify-start gap-2 mb-1">
              <ClipboardList className="w-4 h-4" />
              Órdenes
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 mb-1">
            <CreditCard className="w-4 h-4" />
            Cuentas por cobrar
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 mb-1">
            <BadgeDollarSign className="w-4 h-4" />
            Precios
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
} 