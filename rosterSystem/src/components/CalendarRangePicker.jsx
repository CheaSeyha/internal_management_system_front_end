import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const CalendarRangePicker = React.forwardRef(({ onChange }, ref) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  });

  const [fromMonth, setFromMonth] = React.useState(firstDayOfMonth);
  const [toMonth, setToMonth] = React.useState(lastDayOfMonth);

  const value =
    dateRange.from && dateRange.to
      ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
      : dateRange.from
      ? formatDate(dateRange.from)
      : "";

  const setRange = (range) => {
    setDateRange(range);
    if (onChange && range?.from && range?.to) onChange(range);
  };

  // 🔹 Expose reset function to parent
  React.useImperativeHandle(ref, () => ({
    reset: () => {
      const defaultRange = { from: firstDayOfMonth, to: lastDayOfMonth };
      setRange(defaultRange);
      setFromMonth(defaultRange.from);
      setToMonth(defaultRange.to);
    },
  }));

  return (
    <div className="flex flex-col gap-2">
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
              <div className="lg:grid hidden justify-end gap-2 p-2 bg-muted/40">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRange({ from: today, to: today })}
                >
                  Today
                </Button>
                {/* Other buttons same as before */}
              </div>

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
});
