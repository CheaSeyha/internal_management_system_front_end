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

export default function RosterTable() {
  // -------------------- State --------------------
  const [staff_shift_data, setStaff_shift_data] = useState([
    {
      staff_profile: "https://randomuser.me/api/portraits/men/15.jpg",
      staff_name: "Sok Kim",
      staff_position: "IT OFFICER",
      staff_role: "STAFF",
      staff_id: "EMP-1001",
      staff_gender: "M",
      shift_data: [
        "7",
        "9",
        "7",
        "11",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "11",
        "15",
        "23",
      ],
      day_off: {
        last_month_off: 1,
        this_month_off: 3,
        balance_off: 2,
        upl: 1,
        AL: 0,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/women/20.jpg",
      staff_name: "Chan Lay",
      staff_position: "IT OFFICER",
      staff_role: "STAFF",
      staff_id: "EMP-1002",
      staff_gender: "F",
      shift_data: [
        "9",
        "9",
        "15",
        "23",
        "7",
        "7",
        "7",
        "11",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "7",
        "15",
        "9",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
      ],
      day_off: {
        last_month_off: 0,
        this_month_off: 2,
        balance_off: 1,
        upl: 0,
        AL: 1,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/men/45.jpg",
      staff_name: "Dara Lim",
      staff_position: "IT LEADER",
      staff_role: "ADMIN",
      staff_id: "EMP-1003",
      staff_gender: "M",
      shift_data: [
        "11",
        "15",
        "23",
        "7",
        "9",
        "7",
        "7",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "7",
      ],
      day_off: {
        last_month_off: 2,
        this_month_off: 4,
        balance_off: 0,
        upl: 0,
        AL: 0,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/women/32.jpg",
      staff_name: "Ly Chea",
      staff_position: "SHIFT LEADER",
      staff_role: "SHIFT_LEADER",
      staff_id: "EMP-1004",
      staff_gender: "F",
      shift_data: [
        "15",
        "23",
        "7",
        "7",
        "9",
        "11",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "7",
        "15",
      ],
      day_off: {
        last_month_off: 1,
        this_month_off: 3,
        balance_off: 1,
        upl: 1,
        AL: 0,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/men/40.jpg",
      staff_name: "Vanna Hun",
      staff_position: "IT SUPPORT",
      staff_role: "STAFF",
      staff_id: "EMP-1005",
      staff_gender: "M",
      shift_data: [
        "23",
        "23",
        "7",
        "9",
        "11",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "7",
        "15",
        "23",
      ],
      day_off: {
        last_month_off: 3,
        this_month_off: 2,
        balance_off: 2,
        upl: 0,
        AL: 0,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/women/11.jpg",
      staff_name: "Kimly Chheng",
      staff_position: "IT OFFICER",
      staff_role: "STAFF",
      staff_id: "EMP-1006",
      staff_gender: "F",
      shift_data: [
        "7",
        "7",
        "7",
        "11",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "9",
        "15",
        "23",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
      ],
      day_off: {
        last_month_off: 0,
        this_month_off: 1,
        balance_off: 0,
        upl: 1,
        AL: 1,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/men/28.jpg",
      staff_name: "Piseth Ng",
      staff_position: "IT SUPPORT",
      staff_role: "STAFF",
      staff_id: "EMP-1007",
      staff_gender: "M",
      shift_data: [
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "OFF",
        "UPL",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "7",
        "15",
        "23",
      ],
      day_off: {
        last_month_off: 2,
        this_month_off: 3,
        balance_off: 1,
        upl: 1,
        AL: 0,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/women/38.jpg",
      staff_name: "Srey Mao",
      staff_position: "HELPDESK",
      staff_role: "STAFF",
      staff_id: "EMP-1008",
      staff_gender: "F",
      shift_data: [
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
      ],
      day_off: {
        last_month_off: 1,
        this_month_off: 2,
        balance_off: 0,
        upl: 0,
        AL: 0,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/men/12.jpg",
      staff_name: "Kimsan Dara",
      staff_position: "NETWORK SUPPORT",
      staff_role: "STAFF",
      staff_id: "EMP-1009",
      staff_gender: "M",
      shift_data: [
        "11",
        "15",
        "23",
        "7",
        "9",
        "7",
        "7",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
        "7",
      ],
      day_off: {
        last_month_off: 2,
        this_month_off: 4,
        balance_off: 2,
        upl: 0,
        AL: 0,
      },
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/women/29.jpg",
      staff_name: "Dalin Lim",
      staff_position: "SHIFT LEADER",
      staff_role: "SHIFT_LEADER",
      staff_id: "EMP-1010",
      staff_gender: "F",
      shift_data: [
        "23",
        "7",
        "9",
        "11",
        "15",
        "23",
        "OFF",
        "UPL",
        "7",
        "9",
        "15",
        "23",
        "11",
        "7",
        "9",
        "15",
        "23",
        "7",
        "7",
        "9",
        "15",
        "23",
        "OFF",
        "7",
        "9",
        "11",
        "15",
        "23",
        "7",
        "7",
      ],
      day_off: {
        last_month_off: 1,
        this_month_off: 3,
        balance_off: 1,
        upl: 1,
        AL: 1,
      },
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
    { label: "07:00 - 15:00 (8h)", value: "7", color: "#0000FF" },
    { label: "09:00 - 17:00 (8h)", value: "9", color: "#d76dcc" },
    { label: "11:00 - 19:00 (8h)", value: "11", color: "#FAE2D5" },
    { label: "15:00 - 23:00 (8h)", value: "15", color: "#00FFCC" },
    { label: "23:00 - 07:00 (8h)", value: "23", color: "#3F3F3F" },
    { label: "OFF", value: "OFF", color: "#de0101" },
    { label: "UPL", value: "UPL", color: "#414141" },
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
    const walk = (x - startX) * 100;
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

  return (
    <>
      {/* BUTTON + SELECT */}
      <div className="button-controller flex items-center gap-3 relative mb-4">
        <Select defaultValue="all-department">
          <SelectTrigger className="w-fit">
            <span>
              <ChartBarStacked />
            </span>
            <SelectValue placeholder="Select a Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all-department">All Department</SelectItem>
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
        className="overflow-x-auto max-w-full rounded-lg scroll-smooth cursor-grab h-[750px]"
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
                  className={`border sticky top-0 bg-card z-10 w-[50px] p-2 text-center text-sm ${
                    day.day === "Sun" ? "text-red-600" : ""
                  } ${
                    day.date === currentDay
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
                Last Month
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
            {staff_shift_data.map((data, i) => (
              <tr key={i}>
                <td className="border sticky left-0 bg-card z-20 p-2">
                  <StaffInfor {...data} />
                </td>
                {/* //show work time of staff  */}
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
                      className={`border text-center ${
                        shift_time === "7" ||
                        shift_time === "23" ||
                        shift_time === "UPL"
                          ? "text-white"
                          : "text-black"
                      }  select-none cursor-pointer`}
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
                <td
                  className={`border text-center px-2 ${
                    typeof data.day_off.last_month_off === "number"
                      ? ""
                      : "text-red-500"
                  }`}
                >
                  {data.day_off.last_month_off}
                </td>

                <td className="border text-center px-2">{data.day_off.upl}</td>
                <td className="border text-center px-2">{data.day_off.AL}</td>
              </tr>
            ))}
            {/* Count time shift  */}
            {timeShiftOptions.map((timeShift, index) => (
              <tr key={index}>
                {/* shift label cell */}
                <td
                  className={`border sticky left-0 z-20 ${
                    timeShift.value === "7" ||
                    timeShift.value === "23" ||
                    timeShift.value === "UPL"
                      ? "text-white"
                      : "text-black"
                  } text-center p-1`}
                  style={{ backgroundColor: timeShift.color }}
                >
                  {timeShift.label}
                </td>

                {/* count staff by shift per day */}
                {Array.from({ length: daysOfMonth.length }).map(
                  (_, dayIndex) => {
                    // count how many staff have this shift on this day
                    const count = staff_shift_data.filter(
                      (staff) => staff.shift_data[dayIndex] === timeShift.value
                    ).length;

                    return (
                      <td key={dayIndex} className="border text-center text-sm">
                        {count}
                      </td>
                    );
                  }
                )}

                {/* Empty summary cells for Off/Balance/etc */}
                <td className="border"></td>
                <td className="border"></td>
                <td className="border"></td>
                <td className="border"></td>
                <td className="border"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
