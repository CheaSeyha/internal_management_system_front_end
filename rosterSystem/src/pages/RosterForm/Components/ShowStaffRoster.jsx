"use client";
import { CalendarSync, PencilLine, Save } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function RosterTable() {
  // -------------------- State --------------------
  const [staff_shift_data, setStaff_shift_data] = useState([
    {
      staff_profile:
        "https://www.corporatephotographylondon.com/wp-content/uploads/2019/11/HKstrategies-1713-1024x683.jpg",
      staff_name: "DEMO NG HAH",
      staff_position: "IT OFFICER",
      staff_role: "ADMIN",
      staff_id: "16888",
      staff_gender: "M",
      shift_data: Array(30).fill("7"),
      day_off: { last_month_off: 2, this_month_off: 4, balance_off: 0, upl: 0 },
    },
    {
      staff_profile:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      staff_name: "SOK KIM LAY",
      staff_position: "NETWORK ADMIN",
      staff_role: "STAFF",
      staff_id: "16901",
      staff_gender: "F",
      shift_data: Array(30).fill("7"),
      day_off: {
        last_month_off: "-2",
        this_month_off: 2,
        balance_off: 0,
        upl: 0,
      },
    },
    {
      staff_profile:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      staff_name: "SHIFT LEADER",
      staff_position: "NETWORK LEAD",
      staff_role: "SHIFT_LEADER",
      staff_id: "16904",
      staff_gender: "F",
      shift_data: Array(30).fill("7"),
      day_off: { last_month_off: 0, this_month_off: 4, balance_off: 0, upl: 0 },
    },
  ]);

  const now = new Date();
  const daysOfMonth = Array.from(
    { length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() },
    (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth(), i + 1);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return { date: date.getDate(), day: dayNames[date.getDay()] };
    }
  );
  const currentDay = now.getDate();

  const timeShiftOptions = [
    { label: "07:00 - 15:00 (8h)", value: "7", color: "#0045ff" },
    { label: "09:00 - 17:00 (8h)", value: "9", color: "#ff00d0" },
    { label: "11:00 - 19:00 (8h)", value: "11", color: "#00c2b2" },
    { label: "15:00 - 23:00 (8h)", value: "15", color: "#00f79c" },
    { label: "23:00 - 07:00 (8h)", value: "23", color: "#003936" },
    { label: "OFF", value: "OFF", color: "#de0101" },
    { label: "UPL", value: "UPL", color: "#414141" },
  ];

  const defaultShift = "7";

  // -------------------- Scroll & Paint --------------------
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [updateTimeShift, setUpdateTimeShift] = useState("7");
  const [isPainting, setIsPainting] = useState(false);
  const [isRightPainting, setIsRightPainting] = useState(false);

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
    const walk = (x - startX) * 1;
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
      const key = e.key.toLowerCase();
      switch (key) {
        case "7":
          setUpdateTimeShift("7");
          break;
        case "o":
          setUpdateTimeShift("OFF");
          break;
        case "u":
          setUpdateTimeShift("UPL");
          break;
        case "9":
          setUpdateTimeShift("9");
          break;
        case "1":
          setUpdateTimeShift("15"); // press 1 then 5 if needed
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editMode]);

  // -------------------- Render --------------------
  return (
    <>
      {/* BUTTON + SELECT */}
      <div className="button-controller flex items-center gap-3 relative mb-4">
        <Button
          variant="outline"
          onClick={() => setEditMode(!editMode)}
          className="relative z-20"
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

        <AnimatePresence>
          {editMode && (
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
                  className="w-[180px] text-white"
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
          )}
        </AnimatePresence>
      </div>

      {/* TABLE */}
      <div
        ref={scrollRef}
        className="overflow-x-auto max-w-full rounded-lg scroll-smooth cursor-grab"
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
              <th className="border sticky left-0 bg-card z-30">Staff Info</th>
              {daysOfMonth.map((day, index) => (
                <th
                  key={index}
                  className={`border sticky top-0 bg-card z-10 w-[50px] p-3 text-center ${
                    day.day === "Sun" ? "text-red-600" : ""
                  } ${
                    day.date === currentDay
                      ? "bg-gray-300 dark:bg-gray-700"
                      : ""
                  }`}
                >
                  <div>{day.date}</div>
                  <div>{day.day}</div>
                </th>
              ))}
              <th className="border sticky left-0 bg-card z-30 px-2">Off</th>
              <th className="border sticky left-0 bg-card z-30 px-2">
                Balance
              </th>
              <th className="border sticky left-0 bg-card z-30 px-2">
                Last Month
              </th>
              <th className="border sticky left-0 bg-card z-30 px-2">UPL</th>
            </tr>
          </thead>
          <tbody>
            {staff_shift_data.map((data, i) => (
              <tr key={i}>
                <td className="border sticky left-0 bg-card z-20 p-2">
                  <StaffInfor {...data} />
                </td>

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
                      className="border text-center text-white select-none cursor-pointer"
                      style={{ backgroundColor: option?.color || "#ffbb01" }}
                    >
                      {shift_time}
                    </td>
                  );
                })}

                <td className="border text-center px-2">
                  {data.day_off.this_month_off}
                </td>
                <td className="border text-center px-2">
                  {data.day_off.balance_off}
                </td>
                <td className="border text-center px-2">
                  {data.day_off.last_month_off}
                </td>
                <td className="border text-center px-2">{data.day_off.upl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
