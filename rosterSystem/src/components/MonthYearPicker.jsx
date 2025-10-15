"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthYearPicker({
  value,
  onChange,
  fromYear = 2024,
  toYear = new Date().getFullYear(),
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-fit justify-between font-normal">
          <CalendarDays />

          {value
            ? value.toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })
            : new Date().toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })}
          <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4">
        <div className="flex gap-4">
          {/* Month Select */}
          <Select
            value={(value?.getMonth() ?? new Date().getMonth()).toString()}
            onValueChange={(val) => {
              const newMonth = parseInt(val);
              onChange(new Date(value.getFullYear(), newMonth, 1));
              setOpen(false); // 👈 close Popover
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year Select */}
          <Select
            value={(
              value?.getFullYear() ?? new Date().getFullYear()
            ).toString()}
            onValueChange={(val) => {
              const newYear = parseInt(val);
              onChange(new Date(newYear, value.getMonth(), 1));
              setOpen(false); // 👈 close Popover
            }}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: toYear - fromYear + 1 },
                (_, i) => fromYear + i
              ).map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
