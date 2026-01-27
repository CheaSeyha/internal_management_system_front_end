// AddStaffDialog.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ImageDropzoneHoverRemove from "../../../components/ImageDropzoneHoverRemove";
import DatePicker from "../../../components/DatePicker";

export default function AddStaffDialog() {
  const [date, setDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit form with date:", date);
    // TODO: send to API
  };

  return (
    <Dialog>
      {/* ✅ Put form INSIDE DialogContent so it doesn't wrap DialogTrigger */}
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Staff</DialogTitle>
            <DialogDescription>
              Please fill in the form below to add a new staff.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ImageDropzoneHoverRemove />

              {/* First name, Last Name  */}
              <div className="grid grid-cols-1">
                <div className="grid gap-3">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" name="first_name" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" name="last_name" />
                </div>
              </div>
            </div>

            {/* Staff id, label ID  */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="staff_id">Staff ID</Label>
                <Input id="staff_id" name="staff_id" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="label_id">Label ID</Label>
                <Input id="label_id" name="label_id" />
              </div>
            </div>

            {/* Email, Phone Number  */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" name="phone_number" />
              </div>
            </div>

            {/* Department, Position  */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="department">Departments</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Departments</SelectLabel>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="position">Position</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Position</SelectLabel>
                      <SelectItem value="it-officer">IT Officer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Join, Date of Birth  */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Label>Date Join</Label>

                {/* ✅ DatePicker trigger is type="button" so it won't submit/close */}
                <DatePicker
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                    console.log("Selected date:", d);
                  }}
                />

                {date && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {date.toDateString()}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label>Date of Birth</Label>

                {/* ✅ DatePicker trigger is type="button" so it won't submit/close */}
                <DatePicker
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                    console.log("Selected date:", d);
                  }}
                />

                {date && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {date.toDateString()}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label>Create User</Label>
                <Checkbox />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
