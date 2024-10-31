import { Package2, ClipboardList, CreditCard, BadgeDollarSign } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/app/components/ui/scroll-area"

interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarLayout({ className, children }: SidebarLayoutProps) {
  return (
    <div className={cn(
      "flex-1 flex min-h-screen relative",
      className
    )}>
      <div className="hidden lg:block fixed left-0 bottom-0 w-64 border-r bg-white top-0">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-blue-500">Compras Borgatta</h1>
          </div>
          <nav className="space-y-1 px-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Package2 className="w-4 h-4" />
                Nueva requisición
              </Button>
            </Link>
            <Link href="/ordenes">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <ClipboardList className="w-4 h-4" />
                Órdenes
              </Button>
            </Link>
            <Link href="/cuentas-por-pagar">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CreditCard className="w-4 h-4" />
              Cuentas por pagar
            </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2 opacity-50 cursor-not-allowed" disabled>
              <BadgeDollarSign className="w-4 h-4" />
              Precios
            </Button>
          </nav>
        </ScrollArea>
      </div>
      <div className="lg:pl-64 w-full">
        <ScrollArea className="h-[calc(100vh)] bg-gray-100">
          {children}
        </ScrollArea>
      </div>
    </div>
  )
} 