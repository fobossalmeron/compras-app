import Link from "next/link";
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Card } from "@/app/components/ui/card"
import { SidebarLayout } from "@/app/components/layout/SidebarLayout"

export default function HomePage() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <h1>Bienvenido al sistema de requisiciones</h1>
      </div>
    </SidebarLayout>
  );
}