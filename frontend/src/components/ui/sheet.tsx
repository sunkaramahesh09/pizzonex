"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Sheet = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root {...props} />
)

const SheetTrigger = DrawerPrimitive.Trigger

const SheetClose = DrawerPrimitive.Close

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right"
  }
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 z-50 h-full w-3/4 gap-4 border bg-background p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerPrimitive.Portal>
))
SheetContent.displayName = "SheetContent"

export { Sheet, SheetTrigger, SheetClose, SheetContent }
