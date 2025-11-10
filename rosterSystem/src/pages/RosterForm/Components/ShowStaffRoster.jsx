"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import StaffInfor from "./StaffInfor";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function RosterTable() {
  const [staff_shift_data, setStaff_shift_data] = useState([
    {
      staff_profile:
        "https://www.corporatephotographylondon.com/wp-content/uploads/2019/11/HKstrategies-1713-1024x683.jpg",
      staff_name: "DEMO NG HAH",
      staff_position: "IT OFFICER",
      staff_id: "16888",
      staff_gender: "M",
      shift_data: [
        7, 7, 7, 7, 7, 7, 15, 15, 15, 15, 15, 15, 15, 23, 23, 23, 23, 23, 23,
        15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
      ],
    },
    {
      staff_profile:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      staff_name: "SOK KIM LAY",
      staff_position: "NETWORK ADMIN",
      staff_id: "16901",
      staff_gender: "F",
      shift_data: [
        7, 7, 7, 7, 7, 7, 15, 15, 15, 15, 23, 23, 23, 23, 23, 23, 15, 15, 15,
        15, 7, 7, 7, 7, 7, 23, 23, 23, 23, 23,
      ],
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/men/32.jpg",
      staff_name: "CHAN SOPHEA",
      staff_position: "SECURITY",
      staff_id: "17022",
      staff_gender: "M",
      shift_data: [
        15, 15, 15, 15, 15, 23, 23, 23, 23, 23, 7, 7, 7, 7, 7, 15, 15, 15, 23,
        23, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
      ],
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

  const leftTableRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(0);

  const leftRowsRef = useRef([]);
  const rightRowsRef = useRef([]);

  // Measure left table width
  useLayoutEffect(() => {
    if (leftTableRef.current) {
      setLeftWidth(leftTableRef.current.offsetWidth);
    }
  }, []);

  // Sync row heights between left and right tables
  useLayoutEffect(() => {
    leftRowsRef.current.forEach((leftRow, i) => {
      const rightRow = rightRowsRef.current[i];
      if (leftRow && rightRow) {
        const maxHeight = Math.max(leftRow.offsetHeight, rightRow.offsetHeight);
        leftRow.style.height = `${maxHeight}px`;
        rightRow.style.height = `${maxHeight}px`;
      }
    });
  }, [staff_shift_data, leftWidth]);

  // Use strings for Select values
  const [updateTimeShift, setUpdateTimeShift] = useState("7");

  const timeShiftOptions = [
    { label: "07:00 - 15:00 (8h)", value: "7", color: "#0045ff" },
    { label: "09:00 - 17:00 (8h)", value: "9", color: "#ff00d0" },
    { label: "11:00 - 19:00 (8h)", value: "11", color: "#00c2b2" },
    { label: "15:00 - 23:00 (8h)", value: "15", color: "#00f79c" },
    { label: "23:00 - 07:00 (8h)", value: "23", color: "#003936" },
    { label: "OFF", value: "OFF", color: "#de0101" },
    { label: "UPL", value: "UPL", color: "#414141" },
  ];

  // Get the selected option to style the trigger
  const selectedOption = timeShiftOptions.find(
    (opt) => opt.value === updateTimeShift
  );

  const handleUpdateShift = (staff_name, staff_id, dayIndex) => {
    setStaff_shift_data((prevData) =>
      prevData.map((staff) => {
        if (staff.staff_name === staff_name && staff.staff_id === staff_id) {
          const newShiftData = [...staff.shift_data];
          newShiftData[dayIndex] = updateTimeShift;
          return { ...staff, shift_data: newShiftData };
        }
        return staff;
      })
    );
  };
  return (
    <div className="space-y-4">
      <div className="button-controller">
        <Select value={updateTimeShift} onValueChange={setUpdateTimeShift}>
          <SelectTrigger
            className="w-[180px] text-white"
            style={{
              backgroundColor: selectedOption?.color || "#000",
            }}
          >
            <SelectValue placeholder="Select Time Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Time Shift</SelectLabel>
              {timeShiftOptions.map((Option) => (
                <SelectItem
                  key={Option.value}
                  value={Option.value}
                  style={{
                    backgroundColor: Option.color,
                    color: "#fff",
                  }}
                >
                  {Option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border relative bg-card shadow-sm max-h-[450px] overflow-auto">
        {/* LEFT TABLE */}
        <div
          ref={leftTableRef}
          className="absolute top-0 left-0 z-30 bg-card border-r"
        >
          <Table className="table-auto bg-card">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0font-bold text-center">
                  Employee-Infor
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff_shift_data.map((data, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  ref={(el) => (leftRowsRef.current[rowIndex] = el)}
                >
                  <TableCell className="border-b">
                    <StaffInfor {...data} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* RIGHT TABLE (Swiper Horizontal Scroll) */}
        <Swiper
          modules={[FreeMode, Mousewheel]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={true}
          mousewheel={{ forceToAxis: true }}
          grabCursor={true}
          observer={true}
          observeParents={true}
          className="cursor-grab"
        >
          <SwiperSlide
            className="!w-auto flex-shrink-0"
            style={{ marginLeft: leftWidth + "px" }}
          >
            <Table className="table-auto min-w-max">
              <TableHeader>
                <TableRow>
                  {daysOfMonth.map((data, index) => (
                    <TableHead
                      key={index}
                      className={`text-center border font-medium ${
                        data.day === "Sun"
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {data.day} {data.date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff_shift_data.map((data, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    ref={(el) => (rightRowsRef.current[rowIndex] = el)}
                  >
                    {data.shift_data.map((shift_time, colIndex) => {
                      // Make sure shift_time is string to match timeShiftOptions
                      const shiftValue = shift_time.toString();

                      // Find the color for this shift value
                      const option = timeShiftOptions.find(
                        (opt) => opt.value === shiftValue
                      );

                      return (
                        <TableCell
                          key={colIndex}
                          onClick={() =>
                            handleUpdateShift(
                              data.staff_name,
                              data.staff_id,
                              colIndex
                            )
                          }
                          className="h-full border text-center text-white hover:opacity-70"
                          style={{
                            backgroundColor: option?.color || "#ffbb01",
                          }}
                        >
                          {shift_time}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
