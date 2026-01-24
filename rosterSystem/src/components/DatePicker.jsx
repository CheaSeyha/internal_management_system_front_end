// DatePicker.jsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

export default function DatePicker({ value, onChange }) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button" // ✅ IMPORTANT: prevents form submit (popover won't close)
                    variant="outline"
                    data-empty={!value}
                    className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
                >
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(d) => {
                        onChange(d)
                        setOpen(false) // ✅ Close popover on selection
                    }}
                    defaultMonth={value || new Date()}
                />
            </PopoverContent>
        </Popover>
    )
}
