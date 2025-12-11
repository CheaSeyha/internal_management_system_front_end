import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DropUploadButton({ onRoster }) {
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [rosterByMonth, setRosterByMonth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (pickedFiles) => {
    if (!pickedFiles) return;

    // 1. Store selected files
    const arr = Array.from(pickedFiles).map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      file: f,
      url: URL.createObjectURL(f),
    }));
    setFiles(arr);

    // -----------------------------
    // Parse Roster From Excel Sheet
    // -----------------------------
    const parseRoster = (rawSheetData) => {
      const roster = [];

      // 1. FIND HEADER ROW DYNAMICALLY
      const headerRowIndex = rawSheetData.findIndex((row) => {
        if (!Array.isArray(row)) return false;

        const cells = row.map((c) => (c ? c.toString().trim() : ""));

        const hasName = cells.some(
          (c) =>
            c && (c.includes("ឈ្មោះ") || c.toLowerCase().includes("staff name"))
        );
        const hasCard = cells.some(
          (c) =>
            c && (c.includes("លេខកាត") || c.toLowerCase().includes("staff id"))
        );

        return hasName && hasCard;
      });

      if (headerRowIndex === -1) return roster;

      const header = rawSheetData[headerRowIndex].map((c) =>
        c ? c.toString().trim().toLowerCase() : ""
      );

      // 2. MAP COLUMN INDEXES
      const nameCol = header.findIndex(
        (c) => c && (c.includes("ឈ្មោះ") || c.includes("staff name"))
      );
      const idCol = header.findIndex(
        (c) => c && (c.includes("លេខកាត") || c.includes("staff id"))
      );
      const genderCol = header.findIndex(
        (c) => c && (c.includes("ភេទ") || c.includes("gender"))
      );

      // Find index of first day name (Mon/Tue/etc.)
      const shiftStart = header.findIndex(
        (c) => c && /mon|tue|wed|thu|fri|sat|sun/i.test(c)
      );

      if (shiftStart === -1) return roster;

      // -----------------------------
      // FIND START & END OF MONTH DAYS
      // -----------------------------
      const dateRow = rawSheetData[headerRowIndex + 1]; // row with 1,2,3,...30

      // Start from the first "1"
      let dayStartIndex = dateRow.findIndex((c) => Number(c) === 1);

      // Find last numeric day
      let dayEndIndex = dayStartIndex;
      for (let i = dayStartIndex; i < dateRow.length; i++) {
        const d = Number(dateRow[i]);
        if (!isNaN(d) && d >= 1 && d <= 31) {
          dayEndIndex = i + 1; // slice end = exclusive
        } else {
          break; // stop at OFF or blank
        }
      }

      // -----------------------------
      // 3. LOOP THROUGH STAFF ROWS
      // -----------------------------
      for (let i = headerRowIndex + 2; i < rawSheetData.length; i++) {
        const row = rawSheetData[i];
        if (!row) continue;

        const staffName = row[nameCol] || "";
        const staffId = row[idCol] || "";
        const staffGender = row[genderCol] || "";

        if (!staffName.toString().trim()) continue;

        roster.push({
          staff_name: staffName,
          staff_id: staffId,
          staff_gender: staffGender,

          // ONLY read real month days
          shift_data: row.slice(dayStartIndex, dayEndIndex),
        });
      }

      return roster;
    };

    // -----------------------------
    // 4. READ EACH FILE
    // -----------------------------
    Array.from(pickedFiles).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const tempRoster = {};

        // Parse all sheets inside workbook
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          tempRoster[sheetName] = parseRoster(rawData);
        });

        setRosterByMonth(tempRoster);

        // Select last sheet (latest month)
        setSelectedMonth(workbook.SheetNames[workbook.SheetNames.length - 1]);

        console.log("Parsed Roster Data:", tempRoster);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    if (e.currentTarget === e.target) setDragActive(false);
  };

  const openFilePicker = () => inputRef.current?.click();
  const removeFile = (id) => setFiles((s) => s.filter((x) => x.id !== id));

  const handleConfirm = () => {
    if (onRoster && selectedMonth && rosterByMonth[selectedMonth]) {
      onRoster({ [selectedMonth]: rosterByMonth[selectedMonth] });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full lg:w-fit"
          variant="default"
          onClick={() => setOpen(true)}
        >
          <UploadCloud className="mr-2 h-4 w-4" /> Upload Excel
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Upload Excel Roster</DialogTitle>
          <DialogDescription>
            Drag & drop Excel files (xlsx) to load roster data.
          </DialogDescription>
        </DialogHeader>

        {/* Drag & Drop Area */}
        <div
          className={`mt-4 p-6 rounded-lg border-2 border-dashed transition-colors duration-150 cursor-pointer select-none 
            ${
              dragActive
                ? "border-blue-400 bg-blue-50 dark:bg-blue-900 dark:border-blue-500"
                : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={openFilePicker}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center gap-2 text-gray-800 dark:text-gray-100">
            <UploadCloud className="h-8 w-8" />
            <p className="font-medium">Drop Excel files here</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              or click to browse
            </p>

            {files.length > 0 && (
              <div className="mt-4 w-full grid grid-cols-1 gap-2">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  >
                    <span>{f.file.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(f.id);
                      }}
                      className="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Month Selector */}
        {Object.keys(rosterByMonth).length > 0 && (
          <div className="mt-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(rosterByMonth).map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              files.forEach((f) => URL.revokeObjectURL(f.url));
              setFiles([]);
              setRosterByMonth({});
            }}
          >
            Clear
          </Button>
          <Button onClick={handleConfirm}>Insert Month</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
