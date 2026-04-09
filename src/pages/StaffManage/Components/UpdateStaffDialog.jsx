import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import axios from "../../../api/axios";
import usePositionHook from "../Hooks/usePositionHook";
import useDepartmentHook from "../Hooks/useDepartmentHook";

const toYMD = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

const initialFormState = {
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
};

export default function UpdateStaffDialog({
  open,
  onOpenChange,
  staffData,
  onSuccess,
}) {
  const [profileFile, setProfileFile] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { position, loadingPosition, errorPosition } = usePositionHook();
  const { departments, loadingDepartment } = useDepartmentHook();

  // ✅ Pre-fill form when staffData changes

  useEffect(() => {
    console.log("staffData in update ", staffData);
  }, [staffData]);

  useEffect(() => {
    if (staffData) {
      setForm({
        staff_id: staffData.staff_id ?? "",
        label_id: staffData.label_id ?? "",
        first_name: staffData.first_name ?? "",
        last_name: staffData.last_name ?? "",
        email: staffData.email ?? "",
        phone_number: staffData.phone_number ?? "",
        genders: staffData.raw?.genders ?? "",
        department_name: staffData.department_name ?? "",
        position_name: staffData.position_name ?? "",
        date_of_birth: staffData.date_of_birth
          ? new Date(staffData.date_of_birth)
          : null,
        date_of_joining: staffData.date_of_joining
          ? new Date(staffData.date_of_joining)
          : null,
        isCreatedUser: false,
        role_name: "",
        password: "",
      });
      setProfileFile(staffData.photoSrc);
      setErrors({});
    }
  }, [staffData]);

  const resetForm = () => {
    setForm(initialFormState);
    setProfileFile(null);
    setErrors({});
  };

  const filteredPositions = useMemo(() => {
    if (!form.department_name) return [];
    const searchName = String(form.department_name).toLowerCase();
    return position.filter(
      (p) => p.department?.department_name?.toLowerCase() === searchName,
    );
  }, [position, form.department_name]);

  const roleOptions = useMemo(
    () => [
      { value: "super_admin", label: "Super Admin" },
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
    [],
  );

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const validate = () => {
    const e = {};

    if (!profileFile) e.profile_picture = "Profile picture is required.";

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
      "profile_picture",
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
    const el = document.getElementById(firstKey);
    if (el && typeof el.focus === "function") el.focus();
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("staff_id", String(form.staff_id ?? ""));
    fd.append("label_id", String(form.label_id ?? ""));
    fd.append("first_name", String(form.first_name ?? ""));
    fd.append("last_name", String(form.last_name ?? ""));
    fd.append("email", String(form.email ?? ""));
    fd.append("phone_number", String(form.phone_number ?? ""));
    fd.append("genders", String(form.genders ?? ""));
    fd.append("department_name", String(form.department_name ?? ""));
    fd.append("position_name", String(form.position_name ?? ""));
    fd.append("date_of_joining", toYMD(form.date_of_joining));
    fd.append("date_of_birth", toYMD(form.date_of_birth));
    fd.append("isCreatedUser", form.isCreatedUser ? "1" : "0");
    if (form.isCreatedUser) {
      fd.append("role_name", String(form.role_name ?? ""));
      fd.append("password", String(form.password ?? ""));
    }
    fd.append("profile_picture", profileFile);
    return fd;
  };

  const handleSubmit = async (e) => {
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

    const fd = buildFormData();
    setSubmitting(true);

    try {
      const res = await axios.post("/staff/update_staff", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Update staff response:", res?.data);
      toast.success("Staff updated successfully");

      resetForm();
      onOpenChange(false); // ✅ close dialog via parent
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      console.log("❌ Update staff error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update staff.";
      toast.error("Update staff failed", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const FieldError = ({ name }) =>
    errors?.[name] ? (
      <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
    ) : null;

  return (
    // ✅ open and onOpenChange fully controlled from parent
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetForm();
      }}
    >
      {/* ✅ No DialogTrigger — triggered from the dropdown in TableUser */}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Update Staff</DialogTitle>
            <DialogDescription>
              Required fields will show an error if you skip them.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="mt-5 max-h-[65vh] pr-4">
            <div className="space-y-5">
              {/* Profile + Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Profile Picture *</Label>
                  <div id="profile_picture">
                    <ImageDropzoneHoverRemove
                      value={profileFile} // can be File OR string (blob/url)
                      onChange={(fileOrUrl) => setProfileFile(fileOrUrl)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allowed: jpg, png, jpeg, webp
                  </p>
                  <FieldError name="profile_picture" />
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
                    value={form.genders} // "female" or "male"
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
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError name="genders" />
                </div>

                <div className="grid gap-2">
                  <Label>Create User</Label>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`flex w-full items-center gap-3 rounded-md border p-3 cursor-pointer text-left transition
                      hover:bg-muted/50
                      ${form.isCreatedUser ? "border-primary ring-1 ring-primary/20" : ""}
                    `}
                    onClick={() => {
                      const checked = !form.isCreatedUser;
                      setForm((prev) => ({
                        ...prev,
                        isCreatedUser: checked,
                        ...(checked ? {} : { role_name: "", password: "" }),
                      }));
                      if (!checked) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.role_name;
                          delete copy.password;
                          return copy;
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        const checked = !form.isCreatedUser;
                        setForm((prev) => ({
                          ...prev,
                          isCreatedUser: checked,
                          ...(checked ? {} : { role_name: "", password: "" }),
                        }));
                        if (!checked) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.role_name;
                            delete copy.password;
                            return copy;
                          });
                        }
                      }
                    }}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={form.isCreatedUser} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-medium">
                        Create login account
                      </p>
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
                    onValueChange={(v) => {
                      setField("department_name", v);
                      setField("position_name", "");
                    }}
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
                        {loadingDepartment && (
                          <SelectItem disabled value="loading">
                            Loading...
                          </SelectItem>
                        )}
                        {Array.isArray(departments) &&
                          departments.map((d) => (
                            <SelectItem key={d.id} value={d.department_name}>
                              {d.department_name}
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
                    disabled={!form.department_name}
                  >
                    <SelectTrigger
                      className={`w-full ${errors.position_name ? "border-red-500" : ""}`}
                      aria-invalid={!!errors.position_name}
                    >
                      <SelectValue
                        placeholder={
                          !form.department_name
                            ? "Select department first"
                            : "Select a position"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Positions</SelectLabel>
                        {loadingPosition && (
                          <SelectItem disabled value="loading">
                            Loading positions...
                          </SelectItem>
                        )}
                        {errorPosition && (
                          <SelectItem disabled value="error">
                            Failed to load positions
                          </SelectItem>
                        )}
                        {!loadingPosition &&
                          !errorPosition &&
                          Array.isArray(filteredPositions) &&
                          filteredPositions.length === 0 && (
                            <SelectItem disabled value="none">
                              No positions available
                            </SelectItem>
                          )}
                        {!loadingPosition &&
                          Array.isArray(filteredPositions) &&
                          filteredPositions.map((p) => (
                            <SelectItem key={p.id} value={p.position_name}>
                              {p.position_name}
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
                      toYear={new Date().getFullYear()}
                      placeholder="Select DOB"
                    />
                  </div>
                  <FieldError name="date_of_birth" />
                </div>
              </div>

              {/* Role + Password */}
              {form.isCreatedUser && (
                <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Role *</Label>
                    <Select
                      value={form.role_name}
                      onValueChange={(v) => setField("role_name", v)}
                    >
                      <SelectTrigger
                        className={`w-full ${errors.role_name ? "border-red-500" : ""}`}
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
                      type="text"
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
          </ScrollArea>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
