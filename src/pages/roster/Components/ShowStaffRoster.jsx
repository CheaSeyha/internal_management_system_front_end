"use client";
import { CalendarSync, PencilLine, Save, ChartBarStacked } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StaffInfor from "./StaffInfor";
import { motion, AnimatePresence, time } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import MonthYearPicker from "../../../components/MonthYearPicker";
import DropUploadButton from "../../../components/DropUploadButton";
import { Skeleton } from "@/components/ui/skeleton";

const RosterSkeleton = ({ daysCount }) => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="border p-2 sticky left-0 bg-card z-20">
            <div className="flex items-center gap-3 w-[250px]">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </td>
          {[...Array(daysCount)].map((_, j) => (
            <td key={j} className="border p-1">
              <Skeleton className="h-8 w-8 mx-auto" />
            </td>
          ))}
          {[...Array(5)].map((_, j) => (
            <td key={j} className="border p-1">
              <Skeleton className="h-6 w-10 mx-auto" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default function RosterTable({ roster, rosterLoading, fetchRoster }) {
  // -------------------- State --------------------


  const [staff_shift_data, setStaff_shift_data] = useState([]);

  useEffect(() => {
    if (roster?.data?.departments) {
      const flattened = roster.data.departments.flatMap((dept) =>
        dept.staffs.map((staff) => ({
          staff_profile: staff.profile_picture,
          staff_name: staff.name,
          staff_position: staff.position,
          staff_role: staff.role,
          staff_id: staff.staff_id,
          staff_gender: staff.gender,
          shift_data: staff.shift_data,
          day_off: {
            this_month_off: staff.leave_balance?.monthly_off?.used || 0,
            balance_off: staff.leave_balance?.monthly_off?.remaining || 0,
            upl: staff.leave_balance?.unpaid_leave?.used || 0,
            AL: staff.leave_balance?.annual_leave?.used || 0,
          },
        }))
      );
      setStaff_shift_data(flattened);
    }
  }, [roster]);

  const now = new Date();
  const displayYear = roster?.data?.year ? parseInt(roster.data.year) : now.getFullYear();
  const displayMonth = roster?.data?.month ? parseInt(roster.data.month) - 1 : now.getMonth();

  const daysOfMonth = Array.from(
    { length: new Date(displayYear, displayMonth + 1, 0).getDate() },
    (_, i) => {
      const date = new Date(displayYear, displayMonth, i + 1);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return { date: date.getDate(), day: dayNames[date.getDay()] };
    }
  );
  const currentDay = now.getDate();

  const timeShiftOptions = [
    { label: "07:00 - 15:00 (8h)", value: "7", color: "#0000FF" },
    { label: "09:00 - 17:00 (8h)", value: "9", color: "#d76dcc" },
    { label: "11:00 - 19:00 (8h)", value: "11", color: "#FAE2D5" },
    { label: "15:00 - 23:00 (8h)", value: "15", color: "#00FFCC" },
    { label: "23:00 - 07:00 (8h)", value: "23", color: "#3F3F3F" },
    { label: "OFF", value: "OFF", color: "#de0101" },
    { label: "UPL", value: "UPL", color: "#414141" },
    { label: "AL", value: "AL", color: "#7c9fd9" },
  ];

  const defaultShift = "7";

  // -------------------- Scroll & Paint --------------------
  const [date, setDate] = useState(new Date()); //get curretn date for date select component
  const scrollRef = useRef(null);
  // Add this state at the top
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [updateTimeShift, setUpdateTimeShift] = useState("7");
  const [isPainting, setIsPainting] = useState(false);
  const [isRightPainting, setIsRightPainting] = useState(false);

  const handleSelectDate = (date) => {
    setDate(date);
  };

  // Table scroll logic
  const handleMouseDown = (e) => {
    if (isPainting || isRightPainting) return; // Disable scroll while painting
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging || isPainting || isRightPainting) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX; // exact pixel movement (no multiplier)

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPainting(false);
    setIsRightPainting(false);
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPainting(false);
    setIsRightPainting(false);
    setHoveredCell(null);
  };

  // -------------------- Paint Logic --------------------
  const selectedOption = timeShiftOptions.find(
    (opt) => opt.value === updateTimeShift
  );

  const handleEditRoster = (staff_id, dayIndex, isRightClick = false) => {
    if (!editMode) return;
    setStaff_shift_data((prevData) =>
      prevData.map((staff) => {
        if (staff.staff_id === staff_id) {
          const updated = [...staff.shift_data];
          updated[dayIndex] = isRightClick ? defaultShift : updateTimeShift;
          return { ...staff, shift_data: updated };
        }
        return staff;
      })
    );
  };

  const handleCellMouseDown = (staff_id, dayIndex, e) => {
    e.preventDefault();
    if (!editMode) return;
    if (e.button === 2) {
      setIsRightPainting(true);
      handleEditRoster(staff_id, dayIndex, true);
    } else if (e.button === 0) {
      setIsPainting(true);
      handleEditRoster(staff_id, dayIndex, false);
    }
  };
  const handleCellMouseEnter = (staff_id, dayIndex) => {
    if (!editMode) return;

    setHoveredCell({ staff_id, dayIndex });

    if (isPainting) handleEditRoster(staff_id, dayIndex, false);
    if (isRightPainting) handleEditRoster(staff_id, dayIndex, true);
  };

  const handleCellMouseUp = () => {
    setIsPainting(false);
    setIsRightPainting(false);
  };
  const disableContextMenu = (e) => e.preventDefault();

  // -------------------- Keyboard Shortcuts --------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!editMode) return;
      let newShift = null;
      const key = e.key.toLowerCase();

      switch (key) {
        case "7":
          newShift = "7";
          break;
        case "o":
          newShift = "OFF";
          break;
        case "u":
          newShift = "UPL";
          break;
        case "9":
          newShift = "9";
          break;
        case "3":
          newShift = "15";
          break;
        case "11":
          3;
          newShift = "11";
          break;
        default:
          break;
      }

      if (newShift) {
        setUpdateTimeShift(newShift);

        // Apply immediately if hovering over a cell
        if (hoveredCell) {
          handleEditRoster(hoveredCell.staff_id, hoveredCell.dayIndex, false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editMode, hoveredCell]);

  // Function to update staff_shift_data state
  // Function to insert new roster data into staff_shift_data
  // Insert new roster data into staff_shift_data (ignores month keys)
  const insertNewStaffShiftData = (monthRoster) => {
    const allStaff = [];

    // Flatten all months into a single array
    Object.values(monthRoster).forEach((monthData) => {
      if (!monthData) return;

      const transformed = monthData.map((s) => ({
        staff_profile: "", // default empty or random profile
        staff_name: s.staff_name,
        staff_position: "STAFF", // default
        staff_role: "STAFF", // default
        staff_id: s.staff_id,
        staff_gender: s.staff_gender,
        shift_data: s.shift_data.map((v) => v.toString()), // ensure string
        day_off: {
          last_month_off: 0,
          this_month_off: 0,
          balance_off: 0,
          upl: 0,
          AL: 0,
        },
      }));

      allStaff.push(...transformed);
    });

    // Replace the state with the new staff list
    setStaff_shift_data(allStaff);
  };

  return (
    <>
      {/* BUTTON + SELECT */}
      <div className="button-controller flex flex-col lg:flex-row items-center gap-3 relative mb-4">
        <AnimatePresence>
          {!editMode && (
            <>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="z-10 flex gap-3"
              >
                <Select defaultValue="all-department">
                  <SelectTrigger className="w-full lg:w-fit">
                    <span>
                      <ChartBarStacked />
                    </span>
                    <SelectValue placeholder="Select a Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all-department">
                        All Department
                      </SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="f-and-B">F & B</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="external-security">
                        External Security
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <MonthYearPicker value={date} onChange={handleSelectDate} />
              </motion.div>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => setEditMode(!editMode)}
            className="relative z-20 w-full lg:w-fit"
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <PencilLine className="w-4 h-4 mr-2" />
                Edit Roster
              </>
            )}
          </Button>
          {editMode && (
            <>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="z-10"
              >
                <Select
                  value={updateTimeShift}
                  onValueChange={setUpdateTimeShift}
                >
                  <SelectTrigger
                    className="w-full lg:w-fit text-white"
                    style={{ backgroundColor: selectedOption?.color || "#000" }}
                  >
                    <CalendarSync className="mr-2" />
                    <SelectValue placeholder="Select Time Shift" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Time Shift</SelectLabel>
                      {timeShiftOptions.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          style={{ backgroundColor: opt.color, color: "#fff" }}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="z-10"
              >
                <DropUploadButton
                  onRoster={(monthData) => insertNewStaffShiftData(monthData)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* File Upload  */}
      </div>

      {/* TABLE */}
      <div
        ref={scrollRef}
        className="overflow-x-auto max-w-full rounded-lg cursor-grab h-[750px]"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <table className="min-w-max select-none border-separate border-spacing-0 w-full">
          <thead>
            <tr className="bg-card">
              <th className="border sticky left-0 top-0 bg-card z-30 ">
                Staff Info
              </th>
              {daysOfMonth.map((day, index) => (
                <td
                  key={index}
                  className={`border sticky top-0 bg-card z-10 w-[50px] p-2 text-center text-sm ${day.day === "Sun" ? "text-red-600" : ""
                    } ${day.date === currentDay
                      ? "bg-gray-300 dark:bg-gray-700"
                      : ""
                    }`}
                >
                  <div>{day.date}</div>
                  <div>{day.day}</div>
                </td>
              ))}
              <th className="border sticky left-0 top-0 bg-card z-30 px-2 text-red-500">
                Off
              </th>
              <th className="border sticky left-0 top-0 bg-card z-30 px-2">
                Balance
              </th>
              <th className="border sticky left-0 top-0 bg-card z-30 px-2">
                UPL
              </th>
              <th className="border sticky left-0 top-0 bg-card z-30 px-2">
                AL
              </th>
            </tr>
          </thead>
          <tbody>
            {rosterLoading ? (
              <RosterSkeleton daysCount={daysOfMonth.length} />
            ) : (
              staff_shift_data.map((data, i) => (
                <tr key={i}>
                  <td className="border sticky left-0 bg-card z-20 p-2">
                    <StaffInfor {...data} />
                  </td>
                  {/* show work time of staff */}
                  {data.shift_data.map((shift_time, index) => {
                    const option = timeShiftOptions.find(
                      (opt) => opt.value === shift_time
                    );
                    return (
                      <td
                        key={index}
                        onMouseDown={(e) =>
                          handleCellMouseDown(data.staff_id, index, e)
                        }
                        onMouseEnter={() =>
                          handleCellMouseEnter(data.staff_id, index)
                        }
                        onMouseUp={handleCellMouseUp}
                        onContextMenu={disableContextMenu}
                        className={`border text-center ${shift_time === "7" ||
                          shift_time === "23" ||
                          shift_time === "UPL"
                          ? "text-white"
                          : "text-black"
                          } select-none cursor-pointer`}
                        style={{ backgroundColor: option?.color || "#ffbb01" }}
                      >
                        {shift_time}
                      </td>
                    );
                  })}

                  <td className="border text-center px-2 text-red-500">
                    {data.day_off.this_month_off}
                  </td>
                  <td className="border text-center px-2">
                    {data.day_off.balance_off}
                  </td>
                  <td className="border text-center px-2">{data.day_off.upl}</td>
                  <td className="border text-center px-2">{data.day_off.AL}</td>
                </tr>
              ))
            )}

            {/* Count time shift */}
            {timeShiftOptions.map((timeShift, index) => (
              <tr key={index}>
                <td
                  className={`border sticky left-0 z-20 ${timeShift.value === "7" ||
                    timeShift.value === "23" ||
                    timeShift.value === "UPL"
                    ? "text-white"
                    : "text-black"
                    } text-center p-1`}
                  style={{ backgroundColor: timeShift.color }}
                >
                  {timeShift.label}
                </td>

                {Array.from({ length: daysOfMonth.length }).map(
                  (_, dayIndex) => {
                    const count = staff_shift_data.filter(
                      (staff) => staff.shift_data[dayIndex] === timeShift.value
                    ).length;

                    return (
                      <td
                        key={dayIndex}
                        className={`border text-center text-sm ${count === 0 ? "text-blue-500" : ""
                          }`}
                      >
                        {count}
                      </td>
                    );
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
