"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Calendar22({
  value,
  onChange,
  fromYear = 2024,
  toYear = new Date().getFullYear(),
  placeholder = "Select month & year",
}) {
  const [open, setOpen] = useState(false);

  // fallback: if no value is passed, use current date
  const selectedDate = value || new Date();

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
            : placeholder}

          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
        
          mode="single"
          selected={value}
          defaultMonth={selectedDate}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onChange && onChange(selectedDate);
            }
            setOpen(false);
          }}
          classNames={{
            table: "hidden",
            head: "hidden",
            tbody: "hidden",
            day: "hidden",
            weekdays: "hidden",
            weekday: "hidden",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
