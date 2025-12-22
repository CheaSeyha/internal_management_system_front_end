import * as React from "react"
import { Check, ChevronsUpDown, IdCard, Building } from "lucide-react"
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
  icon: Icon = IdCard
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
          <div className="flex items-center truncate">
            <Icon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {selectedLabels.length
                ? selectedLabels.join(", ")
                : placeholder}
            </span>
          </div>
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

          {/* 🔽 Scrollable list (hidden scrollbar) */}
          <CommandGroup
            className="max-h-[240px] overflow-y-auto"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            {options.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={() => {
                  if (item.count !== 0) toggle(item.value);
                }}
                disabled={item.count === 0}
                className={item.count === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
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

                {/* 🔢 Optional count with blue circle */}
                {showCount && typeof item.count === "number" && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs text-white">
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
