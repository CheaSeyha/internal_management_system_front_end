import * as React from "react";
import { Check, ChevronDown, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MultiSelectDynamic({
  options = [],
  loading = false,
  placeholder = "Select",
  value = [], // 👈 changed from 'selected'
  onValueChange, // 👈 changed from 'onChange'
}) {
  const toggleValue = (val) => {
    if (!onValueChange) return;

    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];

    onValueChange(newValue);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full max-w-48 justify-between">
          {value.length > 0 ? value.join(", ") : placeholder}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2">
        <div className="space-y-2">
          {loading && (
            <div className="flex justify-center py-2">
              <Loader2Icon className="animate-spin h-4 w-4" />
            </div>
          )}

          {!loading &&
            options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={value.includes(opt.value)}
                  onCheckedChange={() => toggleValue(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
