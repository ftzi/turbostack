"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Menu, X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import type * as React from "react"

function MobileNav({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="mobile-nav" {...props} />
}

function MobileNavTrigger({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return (
		<DialogPrimitive.Trigger
			data-slot="mobile-nav-trigger"
			className={cn(
				"inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden",
				className,
			)}
			{...props}
		>
			<Menu className="size-6" />
			<span className="sr-only">Open menu</span>
		</DialogPrimitive.Trigger>
	)
}

function MobileNavContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay
				data-slot="mobile-nav-overlay"
				className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in md:hidden"
			/>
			<DialogPrimitive.Content
				data-slot="mobile-nav-content"
				className={cn(
					"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xs flex-col bg-background shadow-lg duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in md:hidden",
					className,
				)}
				{...props}
			>
				<div className="flex items-center justify-end p-4">
					<DialogPrimitive.Close className="rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
						<X className="size-6" />
						<span className="sr-only">Close menu</span>
					</DialogPrimitive.Close>
				</div>
				<nav className="flex flex-col gap-1 px-4 pb-4">{children}</nav>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	)
}

function MobileNavLink({
	className,
	...props
}: React.ComponentProps<"a"> & {
	href: string
}) {
	return (
		<DialogPrimitive.Close asChild>
			<a
				data-slot="mobile-nav-link"
				className={cn(
					"flex items-center rounded-md px-3 py-2 font-medium text-base text-foreground hover:bg-accent hover:text-accent-foreground",
					className,
				)}
				{...props}
			/>
		</DialogPrimitive.Close>
	)
}

export { MobileNav, MobileNavTrigger, MobileNavContent, MobileNavLink }
