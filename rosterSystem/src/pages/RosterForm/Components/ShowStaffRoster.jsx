"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { CalendarSync, PencilLine, Save } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function RosterTable() {
  // ------------------------------
  // Mock logged-in user (change role to test)
  // ------------------------------
  const [authUser, setAuthUser] = useState({
    staff_id: "16901",
    staff_role: "STAFF", // Change to "ADMIN" or "SHIFT_LEADER" to test
  });

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

  const leftTableRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(0);
  const leftRowsRef = useRef([]);
  const rightRowsRef = useRef([]);

  useLayoutEffect(() => {
    if (leftTableRef.current) setLeftWidth(leftTableRef.current.offsetWidth);
  }, []);

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

  // ------------------------------
  // EDIT MODE + SELECT SHIFT
  // ------------------------------
  const [updateTimeShift, setUpdateTimeShift] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const timeShiftOptions = [
    { label: "07:00 - 15:00 (8h)", value: "7", color: "#0045ff" },
    { label: "09:00 - 17:00 (8h)", value: "9", color: "#ff00d0" },
    { label: "11:00 - 19:00 (8h)", value: "11", color: "#00c2b2" },
    { label: "15:00 - 23:00 (8h)", value: "15", color: "#00f79c" },
    { label: "23:00 - 07:00 (8h)", value: "23", color: "#003936" },
    { label: "OFF", value: "OFF", color: "#de0101" },
    { label: "UPL", value: "UPL", color: "#414141" },
  ];

  const selectedOption = timeShiftOptions.find(
    (opt) => opt.value === updateTimeShift
  );

  // ------------------------------
  // ROLE BASED SHIFT UPDATE
  // ------------------------------
  const canEditShift = (targetStaff) => {
    // STAFF can only edit themselves
    if (authUser.staff_role === "STAFF") {
      return authUser.staff_id === targetStaff.staff_id;
    }
    // SHIFT_LEADER cannot edit ADMIN
    if (authUser.staff_role === "SHIFT_LEADER") {
      return targetStaff.staff_role !== "ADMIN";
    }
    // ADMIN can edit anyone
    if (authUser.staff_role === "ADMIN") return true;

    return false;
  };

  const handleUpdateShift = (staff_name, staff_id, dayIndex) => {
    if (!isEditing) return;

    const targetStaff = staff_shift_data.find(
      (s) => s.staff_name === staff_name && s.staff_id === staff_id
    );

    if (!canEditShift(targetStaff)) {
      toast.error("❌ You cannot edit this staff shift!");
      return;
    }

    if (updateTimeShift === "") {
      toast.warning("⚠️ Please select a shift type first!");
      return;
    }

    setStaff_shift_data((prevData) =>
      prevData.map((staff) => {
        if (staff.staff_name === staff_name && staff.staff_id === staff_id) {
          const updated = [...staff.shift_data];
          updated[dayIndex] = updateTimeShift;
          return { ...staff, shift_data: updated };
        }
        return staff;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Pretend login user selector */}
      <div className="flex gap-2">
        <span>Pretend as:</span>
        <Button onClick={() => setAuthUser({ staff_id: "16901", staff_role: "STAFF" })}>
          STAFF
        </Button>
        <Button onClick={() => setAuthUser({ staff_id: "16888", staff_role: "ADMIN" })}>
          ADMIN
        </Button>
        <Button onClick={() => setAuthUser({ staff_id: "16904", staff_role: "SHIFT_LEADER" })}>
          SHIFT_LEADER
        </Button>
        <span className="ml-2 font-bold">{authUser.staff_role}</span>
      </div>

      {/* BUTTON + SLIDE SELECT */}
      <div className="button-controller flex items-center gap-3 relative">
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="relative z-20"
        >
          {isEditing ? (
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
          {isEditing && (
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="z-10"
            >
              <Select value={updateTimeShift} onValueChange={setUpdateTimeShift}>
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
      <div className="rounded-xl border relative bg-card shadow-sm max-h-[450px] overflow-auto">
        {/* LEFT FIXED TABLE */}
        <div ref={leftTableRef} className="absolute top-0 left-0 z-30 bg-card border-r">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 text-center font-bold">
                  Employee Info
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff_shift_data.map((data, i) => (
                <TableRow key={i} ref={(el) => (leftRowsRef.current[i] = el)}>
                  <TableCell className="border-b">
                    <StaffInfor {...data} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* RIGHT SCROLLABLE TABLE */}
        <Swiper
          modules={[FreeMode, Mousewheel]}
          freeMode
          mousewheel={{ forceToAxis: true }}
          spaceBetween={16}
          slidesPerView="auto"
          className="cursor-grab"
        >
          <SwiperSlide className="!w-auto" style={{ marginLeft: leftWidth + "px" }}>
            <Table className="min-w-max">
              <TableHeader>
                <TableRow>
                  {daysOfMonth.map((d, i) => (
                    <TableHead
                      key={i}
                      className={`text-center border font-medium ${
                        d.day === "Sun" ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {d.day} {d.date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {staff_shift_data.map((staff, rowIndex) => (
                  <TableRow key={rowIndex} ref={(el) => (rightRowsRef.current[rowIndex] = el)}>
                    {staff.shift_data.map((shift, colIndex) => {
                      const option = timeShiftOptions.find((opt) => opt.value === shift);
                      const editable = canEditShift(staff);

                      return (
                        <TableCell
                          key={colIndex}
                          onClick={() =>
                            editable &&
                            handleUpdateShift(staff.staff_name, staff.staff_id, colIndex)
                          }
                          className={`border text-center text-white hover:opacity-70 ${
                            !editable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                          }`}
                          style={{ backgroundColor: option?.color || "#ffbb01" }}
                        >
                          {shift}
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
