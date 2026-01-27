// AddStaffDialog.jsx (UI + client-side validation + console.log on submit)
// - Shows inline errors under each field
// - Prevents submit if any required field missing
// - When valid: logs all form data (including file) to console

"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

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

const toYMD = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

export default function AddStaffDialog() {
  const [open, setOpen] = useState(false);

  // UI states
  const [profileFile, setProfileFile] = useState(null);

  const [form, setForm] = useState({
    staff_id: "",
    label_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    genders: "",

    department_name: "",
    position_name: "",

    date_of_birth: null,
    date_of_joining: null,

    isCreatedUser: false,
    role_name: "",
    password: "",
  });

  // inline errors
  const [errors, setErrors] = useState({});

  // UI-only sample lists (replace with API later)
  const departmentOptions = useMemo(
    () => [
      { value: "HR", label: "HR" },
      { value: "IT", label: "IT" },
      { value: "Finance", label: "Finance" },
    ],
    [],
  );

  const positionOptions = useMemo(
    () => [
      { value: "IT Officer", label: "IT Officer" },
      { value: "Accountant", label: "Accountant" },
      { value: "HR Manager", label: "HR Manager" },
    ],
    [],
  );

  const roleOptions = useMemo(
    () => [
      { value: "super_admin", label: "Super Admin" },
      { value: "admin", label: "Admin" },
      { value: "staff", label: "Staff" },
    ],
    [],
  );

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    // clear error for that field as user edits
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const validate = () => {
    const e = {};
    const staffId = String(form.staff_id || "").trim();

    if (!staffId) e.staff_id = "Staff ID is required.";
    else if (!/^\d+$/.test(staffId)) e.staff_id = "Staff ID must be numeric.";

    if (!String(form.label_id || "").trim())
      e.label_id = "Label ID is required.";

    if (!String(form.first_name || "").trim())
      e.first_name = "First Name is required.";
    if (!String(form.last_name || "").trim())
      e.last_name = "Last Name is required.";

    if (!String(form.email || "").trim()) e.email = "Email is required.";
    else if (!isEmail(form.email)) e.email = "Email format is invalid.";

    if (!String(form.phone_number || "").trim())
      e.phone_number = "Phone Number is required.";

    if (!String(form.genders || "").trim()) e.genders = "Gender is required.";

    if (!String(form.department_name || "").trim())
      e.department_name = "Department is required.";

    if (!String(form.position_name || "").trim())
      e.position_name = "Position is required.";

    if (!form.date_of_joining)
      e.date_of_joining = "Date of Joining is required.";
    if (!form.date_of_birth) e.date_of_birth = "Date of Birth is required.";

    if (form.isCreatedUser) {
      if (!String(form.role_name || "").trim())
        e.role_name = "Role is required.";
      if (!String(form.password || "").trim())
        e.password = "Password is required.";
      else if (String(form.password).length < 8)
        e.password = "Min 8 characters.";
    }

    return e;
  };

  const focusFirstError = (errs) => {
    const order = [
      "staff_id",
      "label_id",
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "genders",
      "department_name",
      "position_name",
      "date_of_joining",
      "date_of_birth",
      "role_name",
      "password",
    ];
    const firstKey = order.find((k) => errs[k]) || Object.keys(errs)[0];
    if (!firstKey) return;

    // Inputs have id, datepicker/select won't always focus; still useful for inputs
    const el = document.getElementById(firstKey);
    if (el && typeof el.focus === "function") el.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors", {
        description: "Some required fields are missing or invalid.",
      });
      focusFirstError(newErrors);
      return;
    }

    // ✅ When valid: show all data in console
    const payload = {
      ...form,
      date_of_joining: toYMD(form.date_of_joining),
      date_of_birth: toYMD(form.date_of_birth),
      profile_picture: profileFile || null,
    };

    console.log("✅ Add Staff Submit Payload (formatted):", payload);

    console.log("✅ Add Staff Submit Payload:", payload);

    toast.success("Form is valid ✅", {
      description: "Check console for submitted data.",
    });

    // optional close
    // setOpen(false);
  };

  const FieldError = ({ name }) =>
    errors?.[name] ? (
      <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
    ) : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          // optional: reset errors when closing
          setErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Staff</DialogTitle>
            <DialogDescription>
              Required fields will show an error if you skip them.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-5">
            {/* Profile + Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Profile Picture (optional)</Label>
                <ImageDropzoneHoverRemove
                  value={profileFile}
                  onChange={(file) => setProfileFile(file)}
                />
                <p className="text-xs text-muted-foreground">
                  Allowed: jpg, png, jpeg, webp
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(e) => setField("first_name", e.target.value)}
                    placeholder="First name"
                    aria-invalid={!!errors.first_name}
                  />
                  <FieldError name="first_name" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(e) => setField("last_name", e.target.value)}
                    placeholder="Last name"
                    aria-invalid={!!errors.last_name}
                  />
                  <FieldError name="last_name" />
                </div>
              </div>
            </div>

            {/* Staff ID + Label ID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="staff_id">Staff ID *</Label>
                <Input
                  id="staff_id"
                  inputMode="numeric"
                  value={form.staff_id}
                  onChange={(e) => setField("staff_id", e.target.value)}
                  placeholder="e.g. 2323"
                  aria-invalid={!!errors.staff_id}
                />
                <FieldError name="staff_id" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="label_id">Label ID *</Label>
                <Input
                  id="label_id"
                  value={form.label_id}
                  onChange={(e) => setField("label_id", e.target.value)}
                  placeholder="e.g. ABC-001"
                  aria-invalid={!!errors.label_id}
                />
                <FieldError name="label_id" />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                />
                <FieldError name="email" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  value={form.phone_number}
                  onChange={(e) => setField("phone_number", e.target.value)}
                  placeholder="e.g. 097xxxxxxx"
                  aria-invalid={!!errors.phone_number}
                />
                <FieldError name="phone_number" />
              </div>
            </div>

            {/* Gender + Create User */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Gender *</Label>
                <Select
                  value={form.genders}
                  onValueChange={(v) => setField("genders", v)}
                >
                  <SelectTrigger
                    className={`w-full ${errors.genders ? "border-red-500" : ""}`}
                    aria-invalid={!!errors.genders}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Genders</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError name="genders" />
              </div>

              <div className="grid gap-2">
                <Label>Create User</Label>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.isCreatedUser}
                    onCheckedChange={(v) => {
                      const checked = v === true;
                      setField("isCreatedUser", checked);

                      if (!checked) {
                        setField("role_name", "");
                        setField("password", "");

                        // clear related errors too
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.role_name;
                          delete copy.password;
                          return copy;
                        });
                      }
                    }}
                  />
                  <div className="leading-tight">
                    <p className="text-sm font-medium">Create login account</p>
                    <p className="text-xs text-muted-foreground">
                      Enable to set role and password
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department + Position */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Department *</Label>
                <Select
                  value={form.department_name}
                  onValueChange={(v) => setField("department_name", v)}
                >
                  <SelectTrigger
                    className={`w-full ${errors.department_name ? "border-red-500" : ""}`}
                    aria-invalid={!!errors.department_name}
                  >
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Departments</SelectLabel>
                      {departmentOptions.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError name="department_name" />
              </div>

              <div className="grid gap-2">
                <Label>Position *</Label>
                <Select
                  value={form.position_name}
                  onValueChange={(v) => setField("position_name", v)}
                >
                  <SelectTrigger
                    className={`w-full ${errors.position_name ? "border-red-500" : ""}`}
                    aria-invalid={!!errors.position_name}
                  >
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Positions</SelectLabel>
                      {positionOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError name="position_name" />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Date of Joining *</Label>
                <div
                  className={
                    errors.date_of_joining
                      ? "rounded-md border border-red-500 p-1"
                      : ""
                  }
                >
                  <DatePicker
                    value={form.date_of_joining}
                    onChange={(d) => setField("date_of_joining", d)}
                  />
                </div>
                <FieldError name="date_of_joining" />
              </div>

              <div className="grid gap-2">
                <Label>Date of Birth *</Label>
                <div
                  className={
                    errors.date_of_birth
                      ? "rounded-md border border-red-500 p-1"
                      : ""
                  }
                >
                  <DatePicker
                    value={form.date_of_birth}
                    onChange={(d) => setField("date_of_birth", d)}
                    fromYear={1950}
                    toYear={new Date().getFullYear()} // DOB should not be future
                    placeholder="Select DOB"
                  />
                </div>
                <FieldError name="date_of_birth" />
              </div>
            </div>

            {/* Role + Password (only when Create User enabled) */}
            {form.isCreatedUser && (
              <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Role *</Label>
                  <Select
                    value={form.role_name}
                    onValueChange={(v) => setField("role_name", v)}
                  >
                    <SelectTrigger
                      className={errors.role_name ? "border-red-500" : ""}
                      aria-invalid={!!errors.role_name}
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {roleOptions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError name="role_name" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="Min 8 characters"
                    aria-invalid={!!errors.password}
                  />
                  <FieldError name="password" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
