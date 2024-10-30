'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { cn } from "@/lib/utils"

interface ModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({
  title,
  isOpen,
  onClose,
  children,
  className
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[600px]", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
} 