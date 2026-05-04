"use client";
import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { CalendarSync, PencilLine, Save, ChartBarStacked, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// UI Components
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StaffInfor from "./StaffInfor";
import MonthYearPicker from "../../../components/MonthYearPicker";
import DropUploadButton from "../../../components/DropUploadButton";

// --- Constants & Helpers ---

const DEFAULT_SHIFT = "7";

const TIME_SHIFT_OPTIONS = [
  { label: "07:00 - 15:00 (8h)", value: "7", color: "#0000FF" },
  { label: "09:00 - 17:00 (8h)", value: "9", color: "#d76dcc" },
  { label: "11:00 - 19:00 (8h)", value: "11", color: "#FAE2D5" },
  { label: "15:00 - 23:00 (8h)", value: "15", color: "#00FFCC" },
  { label: "23:00 - 07:00 (8h)", value: "23", color: "#3F3F3F" },
  { label: "OFF", value: "OFF", color: "#de0101" },
  { label: "UPL", value: "UPL", color: "#414141" },
  { label: "AL", value: "AL", color: "#7c9fd9" },
];

const getDayNames = (year, month, day) => {
  const date = new Date(year, month, day);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayNames[date.getDay()];
};

// --- Sub-components (extracted for performance & readability) ---

const RosterSkeleton = memo(({ daysCount }) => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={`skeleton-row-${i}`} className="animate-pulse">
        <td className="border p-2 sticky left-0 bg-card z-20">
          <div className="flex items-center gap-3 w-[250px]">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </td>
        {[...Array(daysCount || 31)].map((_, j) => (
          <td key={`skeleton-day-${i}-${j}`} className="border p-1">
            <Skeleton className="h-8 w-8 mx-auto" />
          </td>
        ))}
        {[...Array(4)].map((_, j) => (
          <td key={`skeleton-balance-${i}-${j}`} className="border p-1">
            <Skeleton className="h-6 w-10 mx-auto" />
          </td>
        ))}
      </tr>
    ))}
  </>
));
RosterSkeleton.displayName = "RosterSkeleton";

const RosterHeader = memo(({ daysOfMonth, currentDay, width, onResizeMouseDown }) => (
  <thead>
    <tr className="bg-card">
      <th 
        className="border sticky left-0 top-0 bg-card z-30 shadow-[1px_0_0_0_#e2e8f0] group/header"
        style={{ width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }}
      >
        <div className="flex items-center justify-between px-2">
          <span>Staff Info</span>
          {/* Resize Handle */}
          <div
            onMouseDown={onResizeMouseDown}
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-40"
          />
        </div>
      </th>
      {daysOfMonth.map((day, index) => (
        <th
          key={`header-day-${index}`}
          className={`border sticky top-0 bg-card z-10 w-[50px] p-2 text-center text-xs font-semibold ${day.day === "Sun" ? "text-red-600" : ""
            } ${day.date === currentDay ? "bg-accent" : ""}`}
        >
          <div>{day.date}</div>
          <div className="text-[10px] opacity-60 uppercase">{day.day}</div>
        </th>
      ))}
      {["Off", "Balance", "UPL", "AL"].map((h) => (
        <th key={`header-meta-${h}`} className="border sticky top-0 bg-card z-10 px-2 text-[10px] uppercase font-bold text-muted-foreground">
          {h}
        </th>
      ))}
    </tr>
  </thead>
));
RosterHeader.displayName = "RosterHeader";

const ShiftCell = memo(({ staffId, dayIndex, shiftTime, onMouseDown, onMouseEnter, onMouseUp, onContextMenu }) => {
  const option = TIME_SHIFT_OPTIONS.find((opt) => opt.value === shiftTime);
  const isDark = ["7", "23", "UPL"].includes(shiftTime);

  return (
    <td
      onMouseDown={(e) => onMouseDown(staffId, dayIndex, e)}
      onMouseEnter={() => onMouseEnter(staffId, dayIndex)}
      onMouseUp={onMouseUp}
      onContextMenu={onContextMenu}
      className={`border text-center transition-all duration-150 text-[11px] font-medium ${isDark ? "text-white" : "text-black"
        } select-none cursor-pointer h-10 w-10 hover:brightness-90 active:scale-95`}
      style={{ backgroundColor: option?.color || "#ffbb01" }}
    >
      {shiftTime}
    </td>
  );
});
ShiftCell.displayName = "ShiftCell";

const RosterSummary = memo(({ staffData, daysCount, width }) => {
  const summaryCounts = useMemo(() => {
    const counts = TIME_SHIFT_OPTIONS.map(opt => ({
      ...opt,
      dayCounts: new Array(daysCount).fill(0)
    }));

    staffData.forEach(staff => {
      staff.shift_data.forEach((shift, dayIdx) => {
        if (dayIdx < daysCount) {
          const row = counts.find(c => c.value === shift);
          if (row) row.dayCounts[dayIdx]++;
        }
      });
    });
    return counts;
  }, [staffData, daysCount]);

  return (
    <>
      {summaryCounts.map((shift, idx) => (
        <tr key={`summary-${shift.value || idx}`} className="hover:bg-muted/50 group">
          <td
            className={`border sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-center p-1 text-[10px] font-bold ${["7", "23", "UPL"].includes(shift.value) ? "text-white" : "text-black"
              }`}
            style={{ 
              backgroundColor: shift.color,
              width: `${width}px`, 
              minWidth: `${width}px`, 
              maxWidth: `${width}px` 
            }}
          >
            {shift.label}
          </td>
          {shift.dayCounts.map((count, dayIdx) => (
            <td
              key={`sum-${idx}-${dayIdx}`}
              className={`border text-center text-[11px] p-1 ${count === 0 ? "text-muted-foreground opacity-20" : "font-bold bg-muted/20"
                }`}
            >
              {count > 0 ? count : "-"}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
});
RosterSummary.displayName = "RosterSummary";

// --- Main Component ---

export default function RosterTable({ roster, rosterLoading, fetchRoster, createRoster }) {
  // -------------------- State --------------------
  const [staff_shift_data, setStaff_shift_data] = useState([]);
  const [staffRoster, setStaffRoster] = useState([]);
  const [date, setDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const [updateTimeShift, setUpdateTimeShift] = useState("7");
  const [hoveredCell, setHoveredCell] = useState(null);
  const [staffInfoWidth, setStaffInfoWidth] = useState(300); // Updated default width
  const [isResizing, setIsResizing] = useState(false);

  // Drag & Paint state
  const [isPainting, setIsPainting] = useState(false);
  const [isRightPainting, setIsRightPainting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollRef = useRef(null);

  // -------------------- Derived State --------------------
  const displayYear = roster?.data?.year ? parseInt(roster.data.year) : date.getFullYear();
  const displayMonth = roster?.data?.month ? parseInt(roster.data.month) - 1 : date.getMonth();

  const daysOfMonth = useMemo(() => {
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      day: getDayNames(displayYear, displayMonth, i + 1)
    }));
  }, [displayYear, displayMonth]);

  const selectedShiftOption = TIME_SHIFT_OPTIONS.find(o => o.value === updateTimeShift);

  // -------------------- Data Flattening --------------------
  useEffect(() => {
    if (roster?.data?.departments) {
      const flattened = roster.data.departments.flatMap((dept) =>
        dept.staffs.map((staff) => ({
          staff_id: staff.staff_id,
          staff_profile: staff.profile_picture,
          staff_name: staff.name,
          staff_position: staff.position,
          staff_role: staff.role,
          staff_gender: staff.gender,
          shift_data: staff.shift_data,
          day_off: {
            this_month_off: staff.leave_balance?.off_day?.total || 0,
            balance_off: staff.leave_balance?.off_day?.remaining || 0,
            upl: staff.leave_balance?.unpaid_leave?.total || 0,
            AL: staff.leave_balance?.annual_leave?.total || 0,
          },
        }))
      );
      setStaff_shift_data(flattened);
    }
  }, [roster]);

  // -------------------- Logic Handlers --------------------

  const getDateFromIndex = useCallback((dayIndex) => {
    const d = new Date(displayYear, displayMonth, dayIndex + 1);
    return d.toISOString().split("T")[0];
  }, [displayYear, displayMonth]);

  const handleEditRoster = useCallback((staff_id, dayIndex, isRightClick = false) => {
    if (!editMode) return;

    const formattedDate = getDateFromIndex(dayIndex);
    const selectedShift = isRightClick ? DEFAULT_SHIFT : updateTimeShift;

    // 1. API state update
    setStaffRoster(prev => {
      const newData = [...prev];
      let staff = newData.find(s => s.staff_id === staff_id);
      if (!staff) {
        staff = { staff_id, roster: [] };
        newData.push(staff);
      }
      const existingDay = staff.roster.find(r => r.date === formattedDate);
      if (existingDay) existingDay.shift_name = selectedShift;
      else staff.roster.push({ date: formattedDate, shift_name: selectedShift });
      return newData;
    });

    // 2. UI state update
    setStaff_shift_data(prev => prev.map(s => {
      if (s.staff_id === staff_id) {
        const updated = [...s.shift_data];
        updated[dayIndex] = selectedShift;
        return { ...s, shift_data: updated };
      }
      return s;
    }));
  }, [editMode, updateTimeShift, getDateFromIndex]);

  // Table Scrolling
  const handleScrollMouseDown = (e) => {
    if (isPainting || isRightPainting) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleScrollMouseMove = (e) => {
    if (isResizing) {
      const newWidth = Math.max(150, Math.min(500, e.pageX - scrollRef.current.offsetLeft));
      setStaffInfoWidth(newWidth);
      return;
    }
    if (!isDragging || isPainting || isRightPainting) return;
    e.preventDefault();
    const walk = (e.pageX - scrollRef.current.offsetLeft) - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPainting(false);
    setIsRightPainting(false);
    setIsResizing(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  };

  // Cell Painting
  const handleCellMouseDown = useCallback((staff_id, dayIndex, e) => {
    if (!editMode) return;
    e.preventDefault();
    if (e.button === 2) {
      setIsRightPainting(true);
      handleEditRoster(staff_id, dayIndex, true);
    } else {
      setIsPainting(true);
      handleEditRoster(staff_id, dayIndex, false);
    }
  }, [editMode, handleEditRoster]);

  const handleCellMouseEnter = useCallback((staff_id, dayIndex) => {
    if (!editMode) return;
    setHoveredCell({ staff_id, dayIndex });
    if (isPainting) handleEditRoster(staff_id, dayIndex, false);
    if (isRightPainting) handleEditRoster(staff_id, dayIndex, true);
  }, [editMode, isPainting, isRightPainting, handleEditRoster]);

  // Actions
  const handleSaveRoster = async () => {
    if (!editMode) return setEditMode(true);
    if (staffRoster.length === 0) {
      toast.info("No changes to save");
      return setEditMode(false);
    }
    try {
      await createRoster(date.getMonth() + 1, date.getFullYear(), staffRoster);
      toast.success("Roster saved successfully");
      setEditMode(false);
      setStaffRoster([]);
    } catch (e) {
      toast.error("Failed to save roster");
    }
  };

  const importRosterData = (monthRoster) => {
    const flattened = Object.values(monthRoster).flatMap(m => m || []).map(s => ({
      staff_id: s.staff_id,
      staff_name: s.staff_name,
      staff_gender: s.staff_gender,
      staff_position: "STAFF",
      staff_role: "STAFF",
      staff_profile: "",
      shift_data: s.shift_data.map(v => v.toString()),
      day_off: { this_month_off: 0, balance_off: 0, upl: 0, AL: 0 }
    }));
    setStaff_shift_data(flattened);
  };

  // Keyboard Support
  useEffect(() => {
    const handleKeys = (e) => {
      if (!editMode) return;
      const keyMap = { '7': '7', 'o': 'OFF', 'u': 'UPL', '9': '9', '3': '15', '1': '11' };
      const newShift = keyMap[e.key.toLowerCase()];
      if (newShift) {
        setUpdateTimeShift(newShift);
        if (hoveredCell) handleEditRoster(hoveredCell.staff_id, hoveredCell.dayIndex);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [editMode, hoveredCell, handleEditRoster]);

  // -------------------- Render --------------------
  return (
    <div className="space-y-4">
      {/* Controls Area */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        <AnimatePresence mode="wait">
          {!editMode ? (
            <motion.div key="view-mode" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-3">
              <Select defaultValue="all-department">
                <SelectTrigger className="min-w-[180px]">
                  <ChartBarStacked className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {["All Department", "IT", "HR", "Gaming", "F & B", "Security"].map(d => (
                    <SelectItem key={d} value={d.toLowerCase().replace(/ /g, '-')}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <MonthYearPicker value={date} onChange={setDate} />
            </motion.div>
          ) : (
            <motion.div key="edit-mode" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-3">
              <Select value={updateTimeShift} onValueChange={setUpdateTimeShift}>
                <SelectTrigger className="min-w-[180px] text-white" style={{ backgroundColor: selectedShiftOption?.color }}>
                  <CalendarSync className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Shift</SelectLabel>
                    {TIME_SHIFT_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DropUploadButton onRoster={importRosterData} />
            </motion.div>
          )}
        </AnimatePresence>

        <Button variant={editMode ? "default" : "outline"} disabled={rosterLoading} onClick={handleSaveRoster} className="min-w-[140px]">
          {rosterLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : editMode ? <Save className="w-4 h-4 mr-2" /> : <PencilLine className="w-4 h-4 mr-2" />}
          {editMode ? (rosterLoading ? "Saving..." : "Save Changes") : "Edit Roster"}
        </Button>
      </div>

      {/* Grid Area */}
      <div
        ref={scrollRef}
        onMouseDown={handleScrollMouseDown}
        onMouseMove={handleScrollMouseMove}
        onMouseUp={handleGlobalMouseUp}
        onMouseLeave={handleGlobalMouseUp}
        className="overflow-x-auto rounded-xl border bg-card shadow-sm cursor-grab active:cursor-grabbing h-fit"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <table className="min-w-max border-separate border-spacing-0 w-full">
          <RosterHeader 
            daysOfMonth={daysOfMonth} 
            currentDay={new Date().getDate()} 
            width={staffInfoWidth}
            onResizeMouseDown={handleResizeMouseDown}
          />
          <tbody>
            {rosterLoading ? (
              <RosterSkeleton daysCount={daysOfMonth.length} />
            ) : (
              staff_shift_data.map((staff, i) => (
                <tr key={staff.staff_id || i} className="group hover:bg-muted/30">
                  <td 
                    className="border sticky left-0 bg-card z-20 p-2 shadow-[1px_0_0_0_#e2e8f0] overflow-hidden whitespace-nowrap"
                    style={{ width: `${staffInfoWidth}px`, minWidth: `${staffInfoWidth}px`, maxWidth: `${staffInfoWidth}px` }}
                  >
                    <StaffInfor {...staff} />
                  </td>
                  {staff.shift_data.map((shift, idx) => (
                    <ShiftCell
                      key={`${staff.staff_id}-${idx}`}
                      staffId={staff.staff_id}
                      dayIndex={idx}
                      shiftTime={shift}
                      onMouseDown={handleCellMouseDown}
                      onMouseEnter={handleCellMouseEnter}
                      onMouseUp={handleGlobalMouseUp}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ))}
                  <td className="border text-center text-xs font-bold text-red-500 bg-muted/10">{staff.day_off.this_month_off}</td>
                  <td className="border text-center text-xs font-bold bg-muted/10">{staff.day_off.balance_off}</td>
                  <td className="border text-center text-xs font-bold bg-muted/10">{staff.day_off.upl}</td>
                  <td className="border text-center text-xs font-bold bg-muted/10">{staff.day_off.AL}</td>
                </tr>
              ))
            )}
            <RosterSummary 
              staffData={staff_shift_data} 
              daysCount={daysOfMonth.length} 
              width={staffInfoWidth}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
