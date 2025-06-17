"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	const isHorizontal = orientation === "horizontal"

	return (
		<SeparatorPrimitive.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"shrink-0 border-dashed border-border",
				isHorizontal
					? "border-t w-full h-0"
					: "border-l h-full w-0",
				className
			)}
			{...props}
		/>
	)
}

export { Separator }
