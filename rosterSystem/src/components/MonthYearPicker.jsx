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
  fromYear = 2025,
  toYear = new Date().getFullYear(),
}) {
  const [open, setOpen] = React.useState(false);

  const currentMonth = value ? value.getMonth() : new Date().getMonth();
  const currentYear = value ? value.getFullYear() : new Date().getFullYear();

  const [month, setMonth] = React.useState(currentMonth);
  const [year, setYear] = React.useState(currentYear);

  const handleSelect = (m, y) => {
    const selectedDate = new Date(y, m, 1);
    onChange?.(selectedDate);
    setOpen(false);
  };

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
            value={month.toString()}
            onValueChange={(val) => {
              const newMonth = parseInt(val);
              setMonth(newMonth);
              handleSelect(newMonth, year);
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
            value={year.toString()}
            onValueChange={(val) => {
              const newYear = parseInt(val);
              setYear(newYear);
              handleSelect(month, newYear);
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
