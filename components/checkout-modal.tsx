"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import CheckoutForm from "@/components/checkout-form"

export default function CheckoutModal({ open, onOpenChange, title = "結帳", description = "請確認結帳信息" }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <CheckoutForm onClose={() => onOpenChange(false)} title={title} description={description} />
      </DialogContent>
    </Dialog>
  )
}

