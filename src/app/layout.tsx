import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/app/components/layout/SidebarLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Requisiciones",
  description: "Sistema para gestionar requisiciones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SidebarLayout>
          <main className="w-full">{children}</main>
        </SidebarLayout>
      </body>
    </html>
  );
}
