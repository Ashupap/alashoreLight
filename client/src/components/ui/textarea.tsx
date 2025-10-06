import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-ocean-blue focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
