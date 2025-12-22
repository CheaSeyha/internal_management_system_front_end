import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * @param {Array<{ label: string, value: string | number, count?: number }>} options
 * @param {Array} value
 * @param {Function} onChange
 * @param {String} placeholder
 * @param {Boolean} showCount
 */
export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options",
  showCount = false,
}) {
  const toggle = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
          <span className="truncate">
            {selectedLabels.length
              ? selectedLabels.join(", ")
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          {/* 🔒 Sticky search bar */}
          <div className="sticky top-0 z-10 bg-background border-b">
            <CommandInput placeholder="Search..." />
          </div>

          <CommandEmpty>No results found.</CommandEmpty>

          {/* 🔽 Scrollable list */}
          <CommandGroup className="max-h-[240px] overflow-y-auto">
            {options.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={() => toggle(item.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(item.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />

                <span className="flex-1 truncate">
                  {item.label}
                </span>

                {/* 🔢 Optional count */}
                {showCount && typeof item.count === "number" && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {item.count}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
