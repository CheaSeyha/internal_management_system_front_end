"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import StaffInfor from "./StaffInfor";

export default function RosterTable() {
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
    },
  ]);
  // Days of month
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

  // Scroll Logic  ----------------------
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll-fast multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Scroll Logic  ----------------------

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto max-w-full rounded-lg scroll-smooth cursor-grab border-2"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
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
                  day.date === currentDay ? "bg-gray-300 dark:bg-gray-700" : ""
                }`}
              >
                <div>{day.date}</div>
                <div>{day.day}</div>
              </th>
            ))}
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
                    className="border text-center text-white"
                    style={{ backgroundColor: option?.color || "#ffbb01" }}
                  >
                    {shift_time}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
