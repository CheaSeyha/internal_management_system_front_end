import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import ImageDropzoneHoverRemove from "../../../components/ImageDropzoneHoverRemove";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import useDepartment from "../hooks/useDepartmenet";
import DatePicker from "../../../components/DatePicker";
import { useForm, Controller } from "react-hook-form";

export function UpdateStaffDialog({
  open,
  staff,
  fetchStaffs,
  updateStaff,
  staffLoading,
  handleOpenChange,
}) {
  const [selectDepartment, setSelectDepartment] = useState(null);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const { departments, fetchDepartments } = useDepartment();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      staff_id: "",
      label_id: "",
      isCreatedUser: false,
      gender: "male",
      password: "",
      department_name: "",
      position_name: "",
      date_of_joining: null,
      date_of_birth: null,
      role_name: "",
      profile_picture: null, //  managed by RHF via Controller
    },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (staff) {
      reset({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        email: staff.email || "",
        phone_number: staff.phone_number || "",
        staff_id: staff.staff_id || "",
        label_id: staff.label_id || "",
        isCreatedUser: !!staff.user,
        gender: staff.gender || "male",
        password: "",
        department_name: staff.department?.department_name || "",
        position_name: staff.position?.position_name || "",
        date_of_joining: staff.date_of_joining
          ? new Date(staff.date_of_joining)
          : null,
        date_of_birth: staff.date_of_birth
          ? new Date(staff.date_of_birth)
          : null,
        role_name: staff.user?.role?.role_name || "",
        profile_picture: staff.preview_profile || null,
      });
      setSelectDepartment(staff.department?.department_name || null);
      setIsCreateUser(!!staff.user);
    }
  }, [staff, reset]);

  const formatDate = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toISOString().split("T")[0];
  };

  const handleReset = () => {
    reset();
    setSelectDepartment(null);
    setIsCreateUser(false);
  };

  const onSubmit = async (data) => {
    const formatted = {
      ...data,
      date_of_joining: formatDate(data.date_of_joining),
      date_of_birth: formatDate(data.date_of_birth),
      // profile_picture is already a File object from the Controller
    };

    console.log("Submitting data:", formatted);
    console.log("profile_picture:", formatted.profile_picture); // should be a File object

    try {
      const response = await updateStaff(staff.staff_id, formatted);
      if (response.status === 200) {
        toast.success("Staff updated successfully");
        fetchStaffs();
        handleReset();
        handleOpenChange(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Staff</DialogTitle>
            <DialogDescription>
              Update information for {staff?.first_name} {staff?.last_name}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] w-full rounded-md">
            <div className="flex flex-col gap-6">
              {/* Profile Picture */}
              <Field data-invalid={!!errors.profile_picture}>
                <Controller
                  name="profile_picture"
                  control={control}
                  rules={{ required: "Profile image is required" }}
                  render={({ field }) => (
                    <ImageDropzoneHoverRemove
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file); //  stores File directly in RHF
                        trigger("profile_picture");
                      }}
                    />
                  )}
                />
                <FieldError name="profile_picture" errors={errors} />
              </Field>

              <FieldGroup className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <Field data-invalid={!!errors.first_name}>
                  <Label>First Name</Label>
                  <Input
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                    placeholder="e.g John"
                  />
                  <FieldError name="first_name" errors={errors} />
                </Field>

                {/* Last Name */}
                <Field data-invalid={!!errors.last_name}>
                  <Label>Last Name</Label>
                  <Input
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                    placeholder="e.g Doe"
                  />
                  <FieldError name="last_name" errors={errors} />
                </Field>

                {/* Email */}
                <Field data-invalid={!!errors.email}>
                  <Label>Email</Label>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="demo@gmail.com"
                  />
                  <FieldError name="email" errors={errors} />
                </Field>

                {/* Phone */}
                <Field data-invalid={!!errors.phone_number}>
                  <Label>Phone</Label>
                  <Input
                    {...register("phone_number", {
                      required: "Phone is required",
                    })}
                    placeholder="e.g 1234567890"
                  />
                  <FieldError name="phone_number" errors={errors} />
                </Field>

                {/* Staff ID */}
                <Field data-invalid={!!errors.staff_id}>
                  <Label>Staff ID</Label>
                  <Input
                    type="number"
                    {...register("staff_id", {
                      required: "Staff ID is required",
                    })}
                    placeholder="e.g 1882"
                  />
                  <FieldError name="staff_id" errors={errors} />
                </Field>

                {/* Label ID */}
                <Field data-invalid={!!errors.label_id}>
                  <Label>Label ID</Label>
                  <Input
                    {...register("label_id", {
                      required: "Label ID is required",
                    })}
                    placeholder="e.g HR1882"
                  />
                  <FieldError name="label_id" errors={errors} />
                </Field>

                {/* Gender */}
                <Field data-invalid={!!errors.gender}>
                  <Label>Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          trigger("gender");
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError name="gender" errors={errors} />
                </Field>

                {/* Create User Login */}
                <Field>
                  <Label>Create User Login</Label>
                  <Controller
                    name="isCreatedUser"
                    control={control}
                    render={({ field }) => (
                      <Field
                        orientation="horizontal"
                        className="border w-full h-full ps-2 rounded-lg"
                      >
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsCreateUser(checked); //  keep local state in sync
                          }}
                          id="terms-checkbox"
                        />
                        <Label
                          htmlFor="terms-checkbox"
                          className="text-[10px] font-light"
                        >
                          Staff Can Use This Account To Login
                        </Label>
                      </Field>
                    )}
                  />
                </Field>

                {/* User Role & Password — only when isCreateUser is true */}
                {isCreateUser && (
                  <>
                    <Field data-invalid={!!errors.role_name}>
                      <Label>User Role</Label>
                      <Controller
                        name="role_name"
                        control={control}
                        rules={{
                          required: isCreateUser ? "Role is required" : false,
                        }}
                        render={({ field }) => (
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              trigger("role_name");
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem
                                  value="super_admin"
                                  className="text-green-500"
                                >
                                  Super Admin
                                </SelectItem>
                                <SelectItem
                                  value="admin"
                                  className="text-blue-500"
                                >
                                  Admin
                                </SelectItem>
                                <SelectItem
                                  value="user"
                                  className="text-gray-500"
                                >
                                  User
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FieldError name="role_name" errors={errors} />
                    </Field>

                    <Field data-invalid={!!errors.password}>
                      <Label>Password</Label>
                      <Input
                        {...register("password", {
                          required: isCreateUser
                            ? "Password is required"
                            : false,
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        type="password"
                        placeholder="*********"
                      />
                      <FieldError name="password" errors={errors} />
                      <FieldDescription className="text-[10px] font-light">
                        Password Must Be At Least 8 Characters Long
                      </FieldDescription>
                    </Field>
                  </>
                )}

                {/* Department */}
                <Field data-invalid={!!errors.department_name}>
                  <Label>Department</Label>
                  <Controller
                    name="department_name"
                    control={control}
                    rules={{ required: "Department is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setSelectDepartment(val);
                          trigger("department_name");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {departments.map((item) => (
                              <SelectItem
                                key={item.department}
                                value={item.department}
                              >
                                {item.department}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError name="department_name" errors={errors} />
                </Field>

                {/* Position */}
                <Field data-invalid={!!errors.position_name}>
                  <Label>Position</Label>
                  <Controller
                    name="position_name"
                    control={control}
                    rules={{ required: "Position is required" }}
                    render={({ field }) => (
                      <Select
                        disabled={!selectDepartment}
                        onValueChange={(val) => {
                          field.onChange(val);
                          trigger("position_name");
                        }}
                        value={field.value}
                        key={selectDepartment || "position-select"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {(() => {
                              const positions =
                                departments.find(
                                  (item) =>
                                    item.department === selectDepartment,
                                )?.positions || [];

                              if (positions.length === 0) {
                                return (
                                  <SelectItem value="none" disabled>
                                    No Position Available
                                  </SelectItem>
                                );
                              }

                              return positions.map((pos) => (
                                <SelectItem key={pos} value={pos}>
                                  {pos}
                                </SelectItem>
                              ));
                            })()}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError name="position_name" errors={errors} />
                </Field>

                {/* Date of Joining */}
                <Field data-invalid={!!errors.date_of_joining}>
                  <Label>Date of Joining</Label>
                  <Controller
                    name="date_of_joining"
                    control={control}
                    rules={{ required: "Date of joining is required" }}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          trigger("date_of_joining");
                        }}
                      />
                    )}
                  />
                  <FieldError name="date_of_joining" errors={errors} />
                </Field>

                {/* Date of Birth */}
                <Field data-invalid={!!errors.date_of_birth}>
                  <Label>Date of Birth</Label>
                  <Controller
                    name="date_of_birth"
                    control={control}
                    rules={{ required: "Date of birth is required" }}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          trigger("date_of_birth");
                        }}
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                      />
                    )}
                  />
                  <FieldError name="date_of_birth" errors={errors} />
                </Field>
              </FieldGroup>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={staffLoading}>
              {staffLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
