// DatePicker.jsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

export default function DatePicker({
  value,
  onChange,

  // optional controls (good defaults)
  fromYear = 1950,
  toYear = new Date().getFullYear() + 5,
  placeholder = "Pick a date",
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
        >
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            if (!d) return;
            onChange(d);
            setOpen(false);
          }}
          defaultMonth={value || new Date()}
          // ✅ THIS is the key: dropdowns for month + year
          captionLayout="dropdown"
          // ✅ limit dropdown years (for DOB set like 1950..current year)
          fromYear={fromYear}
          toYear={toYear}
          // optional: show outside days
          showOutsideDays
        />
      </PopoverContent>
    </Popover>
  );
}
