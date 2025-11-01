"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import StaffInfor from "./StaffInfor";
import ShiftCalendar from "./ShiftCalendar";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
// ✅ Helper: get all days in current month
export default function getDaysInMonth() {
  const staff_shift_data = [
    {
      staff_profile:
        "https://www.corporatephotographylondon.com/wp-content/uploads/2019/11/HKstrategies-1713-1024x683.jpg",
      staff_name: "DEMO NG HAH",
      staff_position: "IT OFFICER",
      staff_id: "16888",
      staff_gender: "M",
      shift_data: [
        7, 7, 7, 7, 7, 7, 3, 3, 3, 3, 3, 3, 3, 23, 23, 23, 23, 23, 23, 3, 3, 3,
        3, 3, 3, 3, 3, 3, 3, 3,
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
        7, 7, 7, 7, 7, 7, 3, 3, 3, 3, 23, 23, 23, 23, 23, 23, 3, 3, 3, 3, 7, 7,
        7, 7, 7, 23, 23, 23, 23, 23,
      ],
    },
    {
      staff_profile: "https://randomuser.me/api/portraits/men/32.jpg",
      staff_name: "CHAN SOPHEA",
      staff_position: "SECURITY",
      staff_id: "17022",
      staff_gender: "M",
      shift_data: [
        3, 3, 3, 3, 3, 23, 23, 23, 23, 23, 7, 7, 7, 7, 7, 3, 3, 3, 23, 23, 7, 7,
        7, 7, 7, 7, 7, 7, 7, 7,
      ],
    },
  ];

  // Helper function: get all dates for a given month/year with day names
  function getMonthDays(year, month) {
    const date = new Date(year, month, 1);
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    while (date.getMonth() === month) {
      days.push({
        date: date.getDate(),
        day: dayNames[date.getDay()],
      });
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  // Example usage
  const now = new Date();
  const daysOfMonth = getMonthDays(now.getFullYear(), now.getMonth());

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-x-auto">
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
        <SwiperSlide className="!w-auto flex-shrink-0">
          <Table className="table-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-card text-center">
                  Employee-Infor
                </TableHead>
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
                <TableRow key={rowIndex}>
                  <TableCell className="sticky left-0 z-10 bg-card">
                    <StaffInfor {...data} />
                  </TableCell>
                  {data.shift_data.map((shift_time, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`h-full border text-center hover:bg-gray-700 ${
                        shift_time === 7
                          ? "bg-[#0059ff] text-[#ffffff]"
                          : shift_time === 3
                          ? "bg-[#06ffa0] text-[#ffffff]"
                          : shift_time === 23
                          ? "bg-[#004753] text-[#ffffff]"
                          : "bg-[#ffbb01] text-[#ffffff]"
                      }`}
                    >
                      {shift_time}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
