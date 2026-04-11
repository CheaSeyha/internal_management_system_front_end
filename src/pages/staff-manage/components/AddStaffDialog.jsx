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
import { Plus, Shield } from "lucide-react";
import ImageDropzoneHoverRemove from "../../../components/ImageDropzoneHoverRemove";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import useDepartment from "../hooks/useDepartmenet";
import DatePicker from "../../../components/DatePicker";
import { useForm, Controller } from "react-hook-form";
export function AddStaffDialog() {
  const [selectDepartment, setSelectDepartment] = useState(null);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const { departments, fetchDepartments } = useDepartment();
  const {
    register,
    handleSubmit,
    control,
    watch,
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
      phone: "",
      staff_id: "",
      label_id: "",
      gender: "male",
      password: "",
      department_name: "",
      position_name: "",
      date_of_joining: null,
      date_of_birth: null,
      role: "",
      profile_image: null,
    },
  });
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSelectDepartment = (department) => {
    setSelectDepartment(department);
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      reset();
      setSelectDepartment(null);
      setIsCreateUser(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          New Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Please Fill Infor For New Staff
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full rounded-md">
            <div className="flex flex-col gap-6">
              <Field data-invalid={!!errors.profile_image}>
                <Controller
                  name="profile_image"
                  control={control}
                  rules={{ required: "Profile image is required" }}
                  render={({ field }) => (
                    <ImageDropzoneHoverRemove
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        trigger("profile_image");
                      }}
                    />
                  )}
                />
                <FieldError name="profile_image" errors={errors} />
              </Field>
              <FieldGroup className="grid grid-cols-2 gap-4">
                {/* First Name  */}
                <Field data-invalid={!!errors.first_name}>
                  <Label htmlFor="first-name-1">First Name</Label>
                  <Input
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                    placeholder="e.g John"
                  />
                  <FieldError name="first_name" errors={errors} />
                </Field>
                {/* Last Name  */}
                <Field data-invalid={!!errors.last_name}>
                  <Label htmlFor="last-name-1">Last Name</Label>
                  <Input
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                    placeholder="e.g Doe"
                  />
                  <FieldError name="last_name" errors={errors} />
                </Field>
                {/* Email  */}
                <Field data-invalid={!!errors.email}>
                  <Label htmlFor="email-1">Email</Label>
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
                {/* Phone  */}
                <Field data-invalid={!!errors.phone}>
                  <Label htmlFor="phone-1">Phone</Label>
                  <Input
                    {...register("phone", {
                      required: "Phone is required",
                    })}
                    placeholder="e.g 1234567890"
                  />
                  <FieldError name="phone" errors={errors} />
                </Field>
                {/* Staff ID  */}
                <Field data-invalid={!!errors.staff_id}>
                  <Label htmlFor="staff-id-1">Staff ID</Label>
                  <Input
                    {...register("staff_id", {
                      required: "Staff ID is required",
                    })}
                    placeholder="e.g 1882"
                  />
                  <FieldError name="staff_id" errors={errors} />
                </Field>
                {/* Lable ID  */}
                <Field data-invalid={!!errors.label_id}>
                  <Label htmlFor="label-id-1">Label ID</Label>
                  <Input
                    {...register("label_id", {
                      required: "Label ID is required",
                    })}
                    placeholder="e.g HR1882"
                  />
                  <FieldError name="label_id" errors={errors} />
                </Field>
                {/* Gender  */}
                <Field data-invalid={!!errors.gender}>
                  <Label htmlFor="gender-1">Gender</Label>
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
                            <SelectItem key="male" value="male">
                              Male
                            </SelectItem>
                            <SelectItem key="female" value="female">
                              Female
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError name="gender" errors={errors} />
                </Field>
                {/* Create Login User  */}
                <Field>
                  <Label htmlFor="gender-1">Create User Login</Label>
                  <Field
                    orientation="horizontal"
                    className="border w-full h-full ps-2 rounded-lg"
                  >
                    <Checkbox
                      checked={isCreateUser}
                      onCheckedChange={(e) => setIsCreateUser(e)}
                      id="terms-checkbox"
                      name="terms-checkbox"
                    />
                    <Label
                      htmlFor="terms-checkbox"
                      className="text-[10px] font-light"
                    >
                      Staff Can Use This Account To login
                    </Label>
                  </Field>
                </Field>
                {/* User Role And Password  */}
                {isCreateUser && (
                  <>
                    <Field data-invalid={!!errors.role}>
                      <Label htmlFor="user-role-1">User Role</Label>
                      <Controller
                        name="role"
                        control={control}
                        rules={{ required: "Role is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              trigger("role");
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem
                                  key="super-admin"
                                  value="super-admin"
                                  className="text-green-500"
                                >
                                  Super Admin
                                </SelectItem>
                                <SelectItem
                                  key="admin"
                                  value="admin"
                                  className="text-blue-500"
                                >
                                  Admin
                                </SelectItem>
                                <SelectItem
                                  key="user"
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
                      <FieldError name="role" errors={errors} />
                    </Field>
                    <Field data-invalid={!!errors.password}>
                      <Label htmlFor="password-1">Password</Label>
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
                {/* Department  */}
                <Field data-invalid={!!errors.department_name}>
                  <Label htmlFor="department-1">Department</Label>
                  <Controller
                    name="department_name"
                    control={control}
                    rules={{ required: "Department is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleSelectDepartment(val);
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
                {/* Position  */}
                <Field data-invalid={!!errors.position_name}>
                  <Label htmlFor="position-1">Position</Label>
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
                                  <SelectItem key="none" value="none" disabled>
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
                {/* Date of joining  */}
                <Field data-invalid={!!errors.date_of_joining}>
                  <Label htmlFor="date-of-joining-1">Date of Joining</Label>
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
                {/* Date of birth  */}
                <Field data-invalid={!!errors.date_of_birth}>
                  <Label htmlFor="date-of-birth-1">Date of Birth</Label>
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
          <DialogFooter>
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
