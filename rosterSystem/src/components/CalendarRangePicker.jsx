"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CalendarRangePicker({ onChange }) {
  // ===== Default to current month =====
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  });

  // separate month states for each calendar
  const [fromMonth, setFromMonth] = React.useState(firstDayOfMonth);
  const [toMonth, setToMonth] = React.useState(lastDayOfMonth);

  const value =
    dateRange.from && dateRange.to
      ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
      : dateRange.from
      ? formatDate(dateRange.from)
      : "";

  // Notify parent of default value on mount
  React.useEffect(() => {
    if (onChange) onChange(dateRange);
  }, []);

  // ===== Helper function to update range and notify parent =====
  const setRange = (range) => {
    setDateRange(range);
    if (onChange) onChange(range);
  };

  // ===== Helper buttons =====
  const handleToday = () => {
    const today = new Date();
    const range = { from: today, to: today };
    setRange(range);
    setFromMonth(today);
    setToMonth(today);
    setOpen(false);
  };

  const handleThisWeek = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay();
    const start = new Date(today.getFullYear(), today.getMonth(), first);
    const end = new Date(today.getFullYear(), today.getMonth(), first + 6);
    const range = { from: start, to: end };
    setRange(range);
    setFromMonth(start);
    setToMonth(end);
    setOpen(false);
  };

  const handleThisMonth = () => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const range = { from: start, to: end };
    setRange(range);
    setFromMonth(start);
    setToMonth(end);
    setOpen(false);
  };

  const handleThisYear = () => {
    const year = today.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const range = { from: start, to: end };
    setRange(range);
    setFromMonth(start);
    setToMonth(end);
    setOpen(false);
  };

  const handleClear = () => {
    const range = { from: undefined, to: undefined };
    setRange(range);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* <Label htmlFor="date-range">Select Date Range</Label> */}
      <div className="relative flex items-center">
        <Input
          id="date-range"
          value={value}
          placeholder="Select date range"
          readOnly
          className="pr-10 cursor-pointer bg-background"
          onClick={() => setOpen(!open)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">Select date range</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="center"
            side="bottom"
            sideOffset={6}
            className="w-fit p-0"
          >
            <div className="flex">
              {/* Helper buttons (right side) */}
              <div className="lg:grid hidden justify-end gap-2 p-2 bg-muted/40">
                <Button size="sm" variant="outline" onClick={handleToday}>
                  Today
                </Button>
                <Button size="sm" variant="outline" onClick={handleThisWeek}>
                  Week
                </Button>
                <Button size="sm" variant="outline" onClick={handleThisMonth}>
                  Month
                </Button>
                <Button size="sm" variant="outline" onClick={handleThisYear}>
                  Year
                </Button>
                <Button size="sm" variant="ghost" onClick={handleClear}>
                  Clear
                </Button>
              </div>

              {/* Two independent calendars */}
              <div className="grid grid-cols-1 lg:grid-cols-2 border-l">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setRange(range);
                    if (range?.from && range?.to) setOpen(false);
                  }}
                  month={fromMonth}
                  onMonthChange={setFromMonth}
                  captionLayout="dropdown"
                  className="border-r"
                />
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setRange(range);
                    if (range?.from && range?.to) setOpen(false);
                  }}
                  month={toMonth}
                  onMonthChange={setToMonth}
                  captionLayout="dropdown"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
